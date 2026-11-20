package com.tandem.landing_page.Controller;

import com.tandem.landing_page.dto.AttributionRequest;
import com.tandem.landing_page.dto.AttributionResponse;
import com.tandem.landing_page.dto.ReferralClickRequest;
import com.tandem.landing_page.service.ReferralHitService;
import jakarta.servlet.http.HttpServletRequest;
import com.tandem.landing_page.service.ConfigService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/referral")
public class ReferralHitController {

    private final ReferralHitService referralHitService;
    private final ConfigService configService;

    public ReferralHitController(ReferralHitService service, ConfigService configService) {
        this.referralHitService = service;
        this.configService = configService;
    }

    @PostMapping("/{code}")
    public ResponseEntity<?> trackReferral(
            @PathVariable String code,
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

        referralHitService.save(code, userAgent, ip, screenWidth, lang, platform);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Referral tracked",
                "code", code
        ));
    }

    /**
     * Deferred attribution endpoint — called by otp-auth-service on app first cold start.
     * Runs fingerprint scoring against recent clicks and returns the best matching referral code.
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

        AttributionResponse result = referralHitService.attribute(req);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "matched", result.isMatched(),
                "referralCode", result.getReferralCode() != null ? result.getReferralCode() : ""
        ));
    }
}
