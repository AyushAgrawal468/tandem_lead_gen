package com.tandem.landing_page.Controller;

import com.tandem.landing_page.Entity.ReferralHit;
import com.tandem.landing_page.service.ReferralHitService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/referral")
@CrossOrigin(origins = "*")
public class ReferralHitController {

    private final ReferralHitService referralHitService;

    @Value("${app.security.api-key}")
    private String requiredApiKey;

    public ReferralHitController(ReferralHitService service) {
        this.referralHitService = service;
    }

    @PostMapping("/{code}")
    public ResponseEntity<?> trackReferral(
            @PathVariable String code,
            @RequestHeader(value = "User-Agent", required = false) String userAgent,
            @RequestHeader(value = "X-API-KEY", required = false) String apiKey,
            HttpServletRequest request
    ) {

        if (apiKey == null || apiKey.isBlank() || !requiredApiKey.equals(apiKey)) {
            HashMap<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Unauthorized: Missing or invalid X-API-KEY");
            response.put("data", null);

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        String ip = request.getRemoteAddr();
        referralHitService.save(code, userAgent, ip);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Referral tracked",
                "code", code
        )); 
    }

    @GetMapping("/{code}")
    public ResponseEntity<?> getReferralHits(@PathVariable("code") String referralCode) {

        ReferralHit referralHit = referralHitService.getReferalHitsByReferralCode(referralCode);

        HashMap<String, Object> response = new HashMap<>();

        if (referralHit == null) {
            response.put("success", false);
            response.put("message", "No referral hit found for code: " + referralCode);
            response.put("data", null);

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        response.put("success", true);
        response.put("message", "Referral hit found");
        response.put("data", referralHit);

        return ResponseEntity.ok(response);
    }


}

