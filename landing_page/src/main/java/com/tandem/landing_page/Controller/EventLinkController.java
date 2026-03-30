package com.tandem.landing_page.Controller;

import com.tandem.landing_page.dto.AttributionRequest;
import com.tandem.landing_page.dto.ReferralClickRequest;
import com.tandem.landing_page.service.EventLinkService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/event-link")
@CrossOrigin(origins = "*")
public class EventLinkController {

    private final EventLinkService eventLinkService;

    @Value("${app.security.api-key}")
    private String requiredApiKey;

    public EventLinkController(EventLinkService eventLinkService) {
        this.eventLinkService = eventLinkService;
    }

    /**
     * Tracks a click on an event share link.
     * Called by the EventRedirect frontend component before redirecting to the app store.
     */
    @PostMapping("/{eventId}")
    public ResponseEntity<?> trackEventLinkClick(
            @PathVariable String eventId,
            @RequestHeader(value = "User-Agent", required = false) String userAgent,
            @RequestHeader(value = "X-API-KEY", required = false) String apiKey,
            @RequestBody(required = false) ReferralClickRequest body,
            HttpServletRequest request
    ) {
        if (apiKey == null || apiKey.isBlank() || !requiredApiKey.equals(apiKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "success", false,
                    "message", "Unauthorized: Missing or invalid X-API-KEY"
            ));
        }

        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isBlank()) {
            ip = request.getRemoteAddr();
        } else {
            ip = ip.split(",")[0].trim();
        }

        Integer screenWidth = body != null ? body.getScreenWidth() : null;
        String lang = body != null ? body.getLang() : null;
        String platform = body != null ? body.getPlatform() : null;

        eventLinkService.save(eventId, userAgent, ip, screenWidth, lang, platform);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Event link click tracked",
                "eventId", eventId
        ));
    }

    /**
     * Deferred attribution — called by the app on first cold start.
     * Returns the eventId of the event share link the user clicked before installing.
     */
    @PostMapping("/attribute")
    public ResponseEntity<?> attributeInstall(
            @RequestHeader(value = "X-API-KEY", required = false) String apiKey,
            @RequestBody AttributionRequest req
    ) {
        if (apiKey == null || apiKey.isBlank() || !requiredApiKey.equals(apiKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "success", false,
                    "message", "Unauthorized: Missing or invalid X-API-KEY"
            ));
        }

        String eventId = eventLinkService.attribute(req);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "matched", eventId != null,
                "eventId", eventId != null ? eventId : ""
        ));
    }
}