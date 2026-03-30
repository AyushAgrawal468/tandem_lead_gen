package com.tandem.landing_page.service;

import com.tandem.landing_page.Entity.EventLinkHit;
import com.tandem.landing_page.Repository.EventLinkHitRepository;
import com.tandem.landing_page.dto.AttributionRequest;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

@Service
public class EventLinkService {

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

        LocalDateTime since = LocalDateTime.now().minusMinutes(ATTRIBUTION_WINDOW_MINUTES);
        List<EventLinkHit> candidates = repository.findByIpAndCreatedAtAfter(req.getIp(), since);

        if (candidates.isEmpty()) {
            return null;
        }

        LocalDateTime installTime;
        if (req.getInstallTs() != null && !req.getInstallTs().isBlank()) {
            try {
                installTime = OffsetDateTime.parse(req.getInstallTs()).toLocalDateTime();
            } catch (Exception e) {
                try {
                    installTime = LocalDateTime.parse(req.getInstallTs());
                } catch (Exception ex) {
                    installTime = LocalDateTime.now();
                }
            }
        } else {
            installTime = LocalDateTime.now();
        }

        int bestScore = 0;
        EventLinkHit bestHit = null;

        for (EventLinkHit hit : candidates) {
            int score = 60; // IP match guaranteed by query

            if (req.getUserAgent() != null && req.getUserAgent().equals(hit.getUserAgent())) {
                score += 20;
            }

            if (hit.getCreatedAt() != null) {
                long deltaSecs = Math.abs(Duration.between(hit.getCreatedAt(), installTime).getSeconds());
                if (deltaSecs <= 900) {
                    score += 15;
                }
            }

            if (req.getScreenWidth() != null && req.getScreenWidth().equals(hit.getScreenWidth())) {
                score += 5;
            }

            if (score > bestScore) {
                bestScore = score;
                bestHit = hit;
            }
        }

        if (bestScore >= ATTRIBUTION_THRESHOLD && bestHit != null) {
            return bestHit.getEventId();
        }

        return null;
    }
}