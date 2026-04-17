package com.tandem.landing_page.service;

import com.tandem.landing_page.Entity.EventLinkHit;
import com.tandem.landing_page.Repository.EventLinkHitRepository;
import com.tandem.landing_page.dto.AttributionRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.List;

@Service
public class EventLinkService {

    private static final Logger logger = LoggerFactory.getLogger(EventLinkService.class);

    private static final int ATTRIBUTION_THRESHOLD = 75;
    private static final int ATTRIBUTION_WINDOW_MINUTES = 30;

    private final EventLinkHitRepository repository;

    public EventLinkService(EventLinkHitRepository repository) {
        this.repository = repository;
    }

    public void save(String eventId, String userAgent, String ip,
                     Integer screenWidth, String lang, String platform) {
        EventLinkHit hit = new EventLinkHit();
        hit.setEventId(eventId);
        hit.setUserAgent(userAgent);
        hit.setIp(ip);
        hit.setScreenWidth(screenWidth);
        hit.setLang(lang);
        hit.setPlatform(platform);
        repository.save(hit);
    }

    /**
     * Deferred attribution — called by the app on first cold start.
     * Fingerprint-scores recent event link clicks against the install context.
     * Returns the eventId of the best matching click, or null if no match.
     */
    public String attribute(AttributionRequest req) {
        if (req.getIp() == null || req.getIp().isBlank()) {
            return null;
        }

        LocalDateTime since = LocalDateTime.now(ZoneOffset.UTC).minusMinutes(ATTRIBUTION_WINDOW_MINUTES);
        String ipPrefix = extractSubnet(req.getIp());
        List<EventLinkHit> candidates = repository.findByIpStartingWithAndCreatedAtAfterAndResolvedFalse(ipPrefix, since);

        logger.info("[attribute] ip={}, ipPrefix={}, since={}, installTs={}, candidates={}",
                req.getIp(), ipPrefix, since, req.getInstallTs(), candidates.size());

        if (candidates.isEmpty()) {
            logger.info("[attribute] No candidates found for ip prefix={}", ipPrefix);
            return null;
        }

        // Parse installTs — app sends IST (no offset); DB createdAt is UTC. Convert IST → UTC.
        LocalDateTime installTime;
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
        EventLinkHit bestHit = null;

        for (EventLinkHit hit : candidates) {
            int score = 0;

            // Exact IP = 60 pts; same /24 subnet (CGNAT sibling) = 40 pts
            // UA signal removed — browser UA (Chrome) never matches Dart HTTP client UA
            if (req.getIp().equals(hit.getIp())) {
                score += 60;
            } else {
                score += 40;
            }

            // Time window: click within 15 min of install (30 pts)
            long deltaSecs = -1;
            if (hit.getCreatedAt() != null) {
                deltaSecs = Math.abs(Duration.between(hit.getCreatedAt(), installTime).getSeconds());
                if (deltaSecs <= 900) {
                    score += 30;
                }
            }

            // Screen width ±2px tolerance (10 pts)
            if (req.getScreenWidth() != null && hit.getScreenWidth() != null
                    && Math.abs(req.getScreenWidth() - hit.getScreenWidth()) <= 2) {
                score += 10;
            }

            logger.info("[attribute] candidate hitId={}, hitIp={}, hitCreatedAt={}, hitScreenWidth={} | installTime={}, deltaSecs={}, score={}",
                    hit.getId(), hit.getIp(), hit.getCreatedAt(), hit.getScreenWidth(), installTime, deltaSecs, score);

            if (score > bestScore) {
                bestScore = score;
                bestHit = hit;
            }
        }

        logger.info("[attribute] bestScore={}, threshold={}, matched={}", bestScore, ATTRIBUTION_THRESHOLD, bestScore >= ATTRIBUTION_THRESHOLD);

        if (bestScore >= ATTRIBUTION_THRESHOLD && bestHit != null) {
            bestHit.setResolved(true);
            repository.save(bestHit);
            return bestHit.getEventId();
        }

        return null;
    }

    /** Extracts the /24 prefix (e.g. "103.163.62.193" → "103.163.62."). */
    private String extractSubnet(String ip) {
        int lastDot = ip.lastIndexOf('.');
        return lastDot > 0 ? ip.substring(0, lastDot + 1) : ip;
    }
}