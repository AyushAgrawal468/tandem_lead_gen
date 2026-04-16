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
import java.time.ZoneId;
import java.time.ZoneOffset;
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

        LocalDateTime since = LocalDateTime.now(ZoneOffset.UTC).minusMinutes(ATTRIBUTION_WINDOW_MINUTES);
        String ipPrefix = extractSubnet(req.getIp());
        List<ReferralHit> candidates = repository.findByIpStartingWithAndCreatedAtAfter(ipPrefix, since);

        if (candidates.isEmpty()) {
            return new AttributionResponse(false, null);
        }

        // Parse installTs if provided — used for time-window scoring.
        // App sends IST (no offset); DB createdAt is UTC. Convert IST → UTC for correct delta.
        LocalDateTime installTime = null;
        if (req.getInstallTs() != null && !req.getInstallTs().isBlank()) {
            try {
                // Has explicit offset (e.g. "Z" or "+05:30") — convert to UTC
                installTime = OffsetDateTime.parse(req.getInstallTs())
                        .withOffsetSameInstant(ZoneOffset.UTC)
                        .toLocalDateTime();
            } catch (Exception e) {
                try {
                    // No offset — treat as IST (Flutter app clock), convert to UTC
                    installTime = LocalDateTime.parse(req.getInstallTs())
                            .atZone(ZoneId.of("Asia/Kolkata"))
                            .withZoneSameInstant(ZoneOffset.UTC)
                            .toLocalDateTime();
                } catch (Exception ex) {
                    installTime = LocalDateTime.now(ZoneOffset.UTC);
                }
            }
        } else {
            installTime = LocalDateTime.now(ZoneOffset.UTC);
        }

        int bestScore = 0;
        ReferralHit bestHit = null;

        for (ReferralHit hit : candidates) {
            int score = 0;

            // Exact IP = 60 pts; same /24 subnet (CGNAT sibling) = 40 pts
            if (req.getIp().equals(hit.getIp())) {
                score += 60;
            } else {
                score += 40;
            }

            // Time window: click within 15 min of install (30 pts)
            // UA signal removed — browser UA (Chrome) never matches Dart HTTP client UA
            if (hit.getCreatedAt() != null) {
                long deltaSecs = Math.abs(Duration.between(hit.getCreatedAt(), installTime).getSeconds());
                if (deltaSecs <= 900) { // 15 minutes
                    score += 30;
                }
            }

            // Screen width match ±2px tolerance (10 pts)
            if (req.getScreenWidth() != null && hit.getScreenWidth() != null
                    && Math.abs(req.getScreenWidth() - hit.getScreenWidth()) <= 2) {
                score += 10;
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

    /** Extracts the /24 prefix (e.g. "103.163.62.193" → "103.163.62."). */
    private String extractSubnet(String ip) {
        int lastDot = ip.lastIndexOf('.');
        return lastDot > 0 ? ip.substring(0, lastDot + 1) : ip;
    }
}
