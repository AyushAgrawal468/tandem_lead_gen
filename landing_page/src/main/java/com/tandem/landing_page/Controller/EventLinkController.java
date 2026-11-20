package com.tandem.landing_page.Controller;

import com.tandem.landing_page.dto.AttributionRequest;
import com.tandem.landing_page.dto.ReferralClickRequest;
import com.tandem.landing_page.service.EventLinkService;
import jakarta.servlet.http.HttpServletRequest;
import com.tandem.landing_page.service.ConfigService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/event-link")
public class EventLinkController {

    private final EventLinkService eventLinkService;
    private final ConfigService configService;

    public EventLinkController(EventLinkService eventLinkService, ConfigService configService) {
        this.eventLinkService = eventLinkService;
        this.configService = configService;
    }

    /**
     * Tracks a click on an event share link.
     * Called by the EventRedirect frontend component before redirecting to the app store.
     */
    @PostMapping("/{eventId}")
    public ResponseEntity<?> trackEventLinkClick(
            @PathVariable String eventId,
            @RequestHeader(value = "User-Agent", required = false) String userAgent,
            @RequestBody(required = false) ReferralClickRequest body,
            HttpServletRequest request
    ) {
        // Public click endpoint: no key (it shipped in the JS bundle). Rate-limited per visitor IP in nginx.

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
            @RequestHeader(value = "X-Attribution-Secret", required = false) String attributionSecret,
            @RequestHeader(value = "X-API-KEY", required = false) String apiKey,
            @RequestBody AttributionRequest req
    ) {
        if (!configService.isAttributionAuthorized(attributionSecret, apiKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "success", false,
                    "message", "Unauthorized"
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