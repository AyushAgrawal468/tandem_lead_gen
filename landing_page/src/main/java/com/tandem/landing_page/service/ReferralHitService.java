package com.tandem.landing_page.service;

import com.tandem.landing_page.Entity.ReferralHit;
import com.tandem.landing_page.Repository.ReferralHitRepository;
import com.tandem.landing_page.dto.AttributionRequest;
import com.tandem.landing_page.dto.AttributionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReferralHitService {

    private static final int ATTRIBUTION_THRESHOLD = 75;
    private static final int ATTRIBUTION_WINDOW_MINUTES = 30;

    @Value("${app.store.ios-url}")
    private String iosStoreUrl;

    @Value("${app.store.android-url}")
    private String androidStoreUrl;

    @Value("${app.store.fallback-url}")
    private String fallbackUrl;

    private final ReferralHitRepository repository;

    public ReferralHitService(ReferralHitRepository repository) {
        this.repository = repository;
    }

    /**
     * Resolves the correct store URL based on the User-Agent string.
     * Used by both the referral redirect flow and the public /download endpoint.
     */
    public String resolveStoreUrl(String userAgent) {
        if (userAgent == null || userAgent.isBlank()) {
            return fallbackUrl;
        }
        String ua = userAgent.toLowerCase();
        if (ua.contains("iphone") || ua.contains("ipad") || ua.contains("ipod")) {
            return iosStoreUrl;
        }
        if (ua.contains("android")) {
            return androidStoreUrl;
        }
        return fallbackUrl;
    }

    public void save(String code, String userAgent, String ip,
                     Integer screenWidth, String lang, String platform) {
        ReferralHit hit = new ReferralHit();
        hit.setCode(code);
        hit.setUserAgent(userAgent);
        hit.setIp(ip);
        hit.setScreenWidth(screenWidth);
        hit.setLang(lang);
        hit.setPlatform(platform);
        repository.save(hit);
    }

    public ReferralHit getReferalHitsByReferralCode(String referralCode) {
        Optional<ReferralHit> referralHits = repository.findFirstByCodeOrderByCreatedAtDesc(referralCode);
        return referralHits.orElse(null);
    }

    public AttributionResponse attribute(AttributionRequest req) {
        if (req.getIp() == null || req.getIp().isBlank()) {
            return new AttributionResponse(false, null);
        }

        LocalDateTime since = LocalDateTime.now().minusMinutes(ATTRIBUTION_WINDOW_MINUTES);
        List<ReferralHit> candidates = repository.findByIpAndCreatedAtAfter(req.getIp(), since);

        if (candidates.isEmpty()) {
            return new AttributionResponse(false, null);
        }

        // Parse installTs if provided — used for time-window scoring
        LocalDateTime installTime = null;
        if (req.getInstallTs() != null && !req.getInstallTs().isBlank()) {
            try {
                installTime = OffsetDateTime.parse(req.getInstallTs()).toLocalDateTime();
            } catch (Exception e) {
                try {
                    installTime = LocalDateTime.parse(req.getInstallTs());
                } catch (Exception ex) {
                    // fallback: use now
                    installTime = LocalDateTime.now();
                }
            }
        } else {
            installTime = LocalDateTime.now();
        }

        int bestScore = 0;
        ReferralHit bestHit = null;

        for (ReferralHit hit : candidates) {
            int score = 0;

            // IP match — already guaranteed by the query, but worth 60 pts
            score += 60;

            // User-Agent match (20 pts)
            if (req.getUserAgent() != null && req.getUserAgent().equals(hit.getUserAgent())) {
                score += 20;
            }

            // Time window: click within 15 min of install (15 pts)
            if (hit.getCreatedAt() != null) {
                long deltaSecs = Math.abs(Duration.between(hit.getCreatedAt(), installTime).getSeconds());
                if (deltaSecs <= 900) { // 15 minutes
                    score += 15;
                }
            }

            // Screen width match (5 pts)
            if (req.getScreenWidth() != null && req.getScreenWidth().equals(hit.getScreenWidth())) {
                score += 5;
            }

            if (score > bestScore) {
                bestScore = score;
                bestHit = hit;
            }
        }

        if (bestScore >= ATTRIBUTION_THRESHOLD && bestHit != null) {
            return new AttributionResponse(true, bestHit.getCode());
        }

        return new AttributionResponse(false, null);
    }
}
