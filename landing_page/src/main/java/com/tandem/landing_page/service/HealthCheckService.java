package com.tandem.landing_page.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tandem.landing_page.Entity.HealthCheckLog;
import com.tandem.landing_page.Repository.HealthCheckLogRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.net.SocketTimeoutException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;

@Service
public class HealthCheckService {

    private static final String SERVICE_NAME = "otp-auth-service";
    private static final ZoneId IST = ZoneId.of("Asia/Kolkata");
    private static final int TIMEOUT_MS = 10_000;

    @Value("${health.check.otp-auth.url}")
    private String healthCheckUrl;

    @Value("${health.check.otp-auth.auth-key}")
    private String authKey;

    private final HealthCheckLogRepository repository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public HealthCheckService(HealthCheckLogRepository repository) {
        this.repository = repository;
    }

    public void checkAndLog() {
        HealthCheckLog log = new HealthCheckLog();
        log.setServiceName(SERVICE_NAME);

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(TIMEOUT_MS);
        factory.setReadTimeout(TIMEOUT_MS);
        RestTemplate restTemplate = new RestTemplate(factory);

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Internal-Auth", authKey);
        HttpEntity<Void> request = new HttpEntity<>(headers);

        Instant sentInstant = Instant.now();
        log.setRequestSentAt(LocalDateTime.ofInstant(sentInstant, ZoneOffset.UTC));

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    healthCheckUrl, HttpMethod.GET, request, String.class);

            Instant receivedInstant = Instant.now();
            log.setResponseReceivedAt(LocalDateTime.ofInstant(receivedInstant, ZoneOffset.UTC));
            log.setResponseTimeMs((int) (receivedInstant.toEpochMilli() - sentInstant.toEpochMilli()));
            log.setHttpCode(response.getStatusCode().value());
            log.setStatus("ok");
            parseBody(log, response.getBody());

        } catch (HttpStatusCodeException e) {
            Instant receivedInstant = Instant.now();
            log.setResponseReceivedAt(LocalDateTime.ofInstant(receivedInstant, ZoneOffset.UTC));
            log.setResponseTimeMs((int) (receivedInstant.toEpochMilli() - sentInstant.toEpochMilli()));
            log.setHttpCode(e.getStatusCode().value());
            log.setStatus("not_ok");
            parseBody(log, e.getResponseBodyAsString());

        } catch (ResourceAccessException e) {
            if (e.getCause() instanceof SocketTimeoutException) {
                log.setStatus("frozen");
            } else {
                log.setStatus("unreachable");
            }

        } catch (Exception e) {
            log.setStatus("unreachable");
        }

        LocalDateTime istNow = LocalDateTime.now(IST);
        log.setCheckedAt(istNow);
        log.setCreatedAt(istNow);

        repository.save(log);
    }

    private void parseBody(HealthCheckLog log, String body) {
        if (body == null || body.isBlank()) return;

        log.setRawResponse(body);

        try {
            JsonNode root = objectMapper.readTree(body);

            JsonNode checks = root.path("checks");
            if (!checks.isMissingNode()) {
                JsonNode pool = checks.path("connectionPool");
                if (!pool.isMissingNode()) {
                    if (pool.has("active")) log.setConnectionPoolActive(pool.get("active").asInt());
                    if (pool.has("pending")) log.setConnectionPoolPending(pool.get("pending").asInt());
                    if (pool.has("max")) log.setConnectionPoolMax(pool.get("max").asInt());
                }

                JsonNode db = checks.path("database");
                if (!db.isMissingNode()) {
                    if (db.has("status")) log.setDbStatus(db.get("status").asText());
                    if (db.has("responseTimeMs")) log.setDbResponseTimeMs(db.get("responseTimeMs").asInt());
                }

                JsonNode memory = checks.path("memory");
                if (!memory.isMissingNode()) {
                    if (memory.has("heapUsedPercent")) log.setMemoryUsedPercent(memory.get("heapUsedPercent").asInt());
                }

                JsonNode threadPool = checks.path("threadPool");
                if (!threadPool.isMissingNode()) {
                    if (threadPool.has("activeThreads")) log.setThreadPoolActive(threadPool.get("activeThreads").asInt());
                    if (threadPool.has("maxThreads")) log.setThreadPoolMax(threadPool.get("maxThreads").asInt());
                }
            }

            JsonNode issues = root.path("issues");
            if (!issues.isMissingNode() && !issues.isNull()) {
                log.setIssues(issues.toString());
            }

        } catch (Exception ignored) {
            // raw_response is still saved even if parsing fails
        }
    }
}
