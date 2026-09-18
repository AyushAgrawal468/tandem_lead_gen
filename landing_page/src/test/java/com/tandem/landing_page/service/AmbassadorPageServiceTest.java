package com.tandem.landing_page.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

class AmbassadorPageServiceTest {

    private RestTemplate restTemplate;
    private ConfigService configService;
    private AmbassadorPageService service;

    @BeforeEach
    void setup() {
        restTemplate = Mockito.mock(RestTemplate.class);
        configService = Mockito.mock(ConfigService.class);
        when(configService.get("tandem.internal-auth-secret")).thenReturn("shared-secret");
        when(configService.get("tandem.ambassador-api-base-url")).thenReturn("https://tandem-main.internal");
        service = new AmbassadorPageService(restTemplate, configService);
    }

    @Test
    void attachesInternalAuthHeaderAndReturnsBodyOnSuccess() {
        Map<String, Object> body = Map.of("ambassadorId", "abc");
        when(restTemplate.exchange(
                eq("https://tandem-main.internal/internal/ambassador/page-data?token=tok123"),
                eq(HttpMethod.GET),
                any(HttpEntity.class),
                eq(Map.class)
        )).thenReturn(ResponseEntity.ok(body));

        Map<String, Object> result = service.fetchPageData("tok123");

        assertEquals(body, result);
    }

    @Test
    void returnsNull_whenTandemMainReturns404() {
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(Map.class)))
                .thenThrow(HttpClientErrorException.create(HttpStatus.NOT_FOUND, "Not Found", HttpHeaders.EMPTY, new byte[0], null));

        assertNull(service.fetchPageData("bad-token"));
    }

    @Test
    void returnsNull_onConnectionFailure() {
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(Map.class)))
                .thenThrow(new org.springframework.web.client.ResourceAccessException("connection refused"));

        assertNull(service.fetchPageData("tok"));
    }

    @Test
    void returnsNull_whenAppConfigKeyIsMissing() {
        // ConfigService.get() throws IllegalStateException (not a RestClientException) for a
        // missing key — must degrade the same way as any other failure, never a raw 500.
        Mockito.reset(configService);
        when(configService.get("tandem.internal-auth-secret")).thenThrow(new IllegalStateException("Missing config key in app_config table: tandem.internal-auth-secret"));

        assertNull(service.fetchPageData("tok"));
    }

    @Test
    void urlEncodesTheToken() {
        Map<String, Object> body = Map.of("ambassadorId", "abc");
        when(restTemplate.exchange(
                eq("https://tandem-main.internal/internal/ambassador/page-data?token=tok+with%26special%23chars"),
                eq(HttpMethod.GET),
                any(HttpEntity.class),
                eq(Map.class)
        )).thenReturn(ResponseEntity.ok(body));

        Map<String, Object> result = service.fetchPageData("tok with&special#chars");

        assertEquals(body, result);
    }
}
