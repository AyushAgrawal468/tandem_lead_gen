package com.tandem.landing_page.Controller;

import com.tandem.landing_page.service.AmbassadorPageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class AmbassadorPageControllerTest {

    private AmbassadorPageService pageService;
    private AmbassadorPageController controller;

    @BeforeEach
    void setup() {
        pageService = Mockito.mock(AmbassadorPageService.class);
        controller = new AmbassadorPageController(pageService);
    }

    @Test
    void returnsSuccessShapeWithDataOnHit() {
        Map<String, Object> data = Map.of("ambassadorId", "abc");
        when(pageService.fetchPageData("tok")).thenReturn(data);

        ResponseEntity<?> response = controller.getPage("tok");

        assertEquals(200, response.getStatusCode().value());
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals(true, body.get("success"));
        assertEquals(data, body.get("data"));
    }

    @Test
    void returnsFailureShapeOnMiss() {
        when(pageService.fetchPageData("bad")).thenReturn(null);

        ResponseEntity<?> response = controller.getPage("bad");

        assertEquals(404, response.getStatusCode().value());
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals(false, body.get("success"));
    }
}
