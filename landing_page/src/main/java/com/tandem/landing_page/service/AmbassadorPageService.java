package com.tandem.landing_page.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
public class AmbassadorPageService {

    private static final Logger log = LoggerFactory.getLogger(AmbassadorPageService.class);

    private final RestTemplate restTemplate;
    private final ConfigService configService;

    public AmbassadorPageService(RestTemplate restTemplate, ConfigService configService) {
        this.restTemplate = restTemplate;
        this.configService = configService;
    }

    /** Returns the page data map, or null if the token is unknown / tandem_main is unreachable / any error occurs (including missing app_config keys). */
    public Map<String, Object> fetchPageData(String token) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-Internal-Auth", configService.get("tandem.internal-auth-secret"));
            String encodedToken = URLEncoder.encode(token, StandardCharsets.UTF_8);
            String url = configService.get("tandem.ambassador-api-base-url")
                    + "/internal/ambassador/page-data?token=" + encodedToken;

            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), Map.class);
            @SuppressWarnings("unchecked")
            Map<String, Object> body = response.getBody();
            return body;
        } catch (Exception e) {
            // Broad catch is deliberate: RestClientException (network/HTTP failures) and
            // IllegalStateException (ConfigService.get() on a missing app_config key) must both
            // degrade to the same "not found" response, never a raw 500.
            log.warn("Ambassador page-data fetch failed for token lookup: {}", e.getMessage());
            return null;
        }
    }
}
