package com.tandem.landing_page.Controller;

import com.tandem.landing_page.service.ReferralHitService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/referral")
public class ReferralHitController {

    private final ReferralHitService service;

    public ReferralHitController(ReferralHitService service) {
        this.service = service;
    }

    @PostMapping("/{code}")
    public ResponseEntity<?> trackReferral(
            @PathVariable String code,
            @RequestHeader(value = "User-Agent", required = false) String userAgent,
            HttpServletRequest request
    ) {
        String ip = request.getRemoteAddr();
        service.save(code, userAgent, ip);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Referral tracked",
                "code", code
        )); 
    }
}

