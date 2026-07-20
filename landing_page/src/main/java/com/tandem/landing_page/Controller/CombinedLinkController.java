package com.tandem.landing_page.Controller;

import com.tandem.landing_page.dto.AttributionRequest;
import com.tandem.landing_page.dto.ReferralClickRequest;
import com.tandem.landing_page.service.CombinedLinkService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/links")
@CrossOrigin(origins = "*")
public class CombinedLinkController {

    private final CombinedLinkService combinedLinkService;

    @Value("${app.security.api-key}")
    private String requiredApiKey;

    public CombinedLinkController(CombinedLinkService combinedLinkService) {
        this.combinedLinkService = combinedLinkService;
    }

    /**
     * Tracks a click on a combined event+referral link.
     * Called by CombinedRedirect frontend component before redirecting to the app store.
     */
    @PostMapping("/click")
    public ResponseEntity<?> trackClick(
            @RequestHeader(value = "User-Agent", required = false) String userAgent,
            @RequestHeader(value = "X-API-KEY", required = false) String apiKey,
            @RequestParam(required = false) String referralCode,
            @RequestParam(required = false) String eventId,
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

        combinedLinkService.save(
                referralCode,
                eventId,
                userAgent,
                ip,
                body != null ? body.getScreenWidth() : null,
                body != null ? body.getLang() : null,
                body != null ? body.getPlatform() : null
        );

        return ResponseEntity.ok(Map.of("success", true));
    }

    /**
     * Unified deferred attribution — called by otp-auth-service on app cold start.
     * Checks combined_link_hits (new /l/links format) first, falls back to referral_hits.
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

        CombinedLinkService.AttributionResult result = combinedLinkService.attribute(req);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "matched", result.isMatched(),
                "referralCode", result.getReferralCode() != null ? result.getReferralCode() : "",
                "eventId", result.getEventId() != null ? result.getEventId() : ""
        ));
    }
}
