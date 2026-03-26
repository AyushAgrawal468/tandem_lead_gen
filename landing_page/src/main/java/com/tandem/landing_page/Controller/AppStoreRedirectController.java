package com.tandem.landing_page.Controller;

import com.tandem.landing_page.service.ReferralHitService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

/**
 * Public redirect endpoint used in marketing links.
 * URL: GET /download
 *
 * Detects the user's platform via User-Agent and redirects to the iOS App Store,
 * Google Play, or the fallback website. Store URLs are managed in application.properties
 * via ReferralHitService so they stay in one place across all redirect flows.
 */
@RestController
@RequestMapping("/download")
public class AppStoreRedirectController {

    private final ReferralHitService referralHitService;

    public AppStoreRedirectController(ReferralHitService referralHitService) {
        this.referralHitService = referralHitService;
    }

    @GetMapping
    public ResponseEntity<Void> redirectToStore(
            @RequestHeader(value = "User-Agent", required = false) String userAgent
    ) {
        String target = referralHitService.resolveStoreUrl(userAgent);
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(target))
                .build();
    }
}