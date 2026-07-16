package com.tandem.landing_page.service;

import com.tandem.landing_page.Entity.CombinedLinkHit;
import com.tandem.landing_page.Entity.ReferralHit;
import com.tandem.landing_page.Repository.CombinedLinkHitRepository;
import com.tandem.landing_page.Repository.ReferralHitRepository;
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
public class CombinedLinkService {

    private static final Logger logger = LoggerFactory.getLogger(CombinedLinkService.class);
    private static final int ATTRIBUTION_THRESHOLD = 75;
    private static final int ATTRIBUTION_WINDOW_MINUTES = 30;

    private final CombinedLinkHitRepository combinedRepo;
    private final ReferralHitRepository referralRepo;

    public CombinedLinkService(CombinedLinkHitRepository combinedRepo, ReferralHitRepository referralRepo) {
        this.combinedRepo = combinedRepo;
        this.referralRepo = referralRepo;
    }

    public void save(String referralCode, String eventId, String userAgent, String ip,
                     Integer screenWidth, String lang, String platform) {
        CombinedLinkHit hit = new CombinedLinkHit();
        hit.setReferralCode(referralCode);
        hit.setEventId(eventId);
        hit.setUserAgent(userAgent);
        hit.setIp(ip);
        hit.setScreenWidth(screenWidth);
        hit.setLang(lang);
        hit.setPlatform(platform);
        combinedRepo.save(hit);
    }

    /**
     * Unified deferred attribution — called by otp-auth-service on app cold start.
     * Checks combined_link_hits first, falls back to referral_hits for old-format links.
     * Returns {matched, referralCode, eventId} — either or both payload fields may be null.
     */
    public AttributionResult attribute(AttributionRequest req) {
        if (req.getIp() == null || req.getIp().isBlank()) {
            return new AttributionResult(false, null, null);
        }

        LocalDateTime since = LocalDateTime.now(ZoneOffset.UTC).minusMinutes(ATTRIBUTION_WINDOW_MINUTES);
        String ipPrefix = extractSubnet(req.getIp());
        LocalDateTime installTime = parseInstallTime(req.getInstallTs());

        // 1. Check combined_link_hits (new /l/links format)
        List<CombinedLinkHit> combinedCandidates =
                combinedRepo.findByIpStartingWithAndCreatedAtAfterAndResolvedFalse(ipPrefix, since);
        logger.info("[attribute] combined candidates: ip={}, count={}", ipPrefix, combinedCandidates.size());

        int bestScore = 0;
        CombinedLinkHit bestCombined = null;
        for (CombinedLinkHit hit : combinedCandidates) {
            int score = score(req.getIp(), req.getScreenWidth(), hit.getIp(), hit.getScreenWidth(), hit.getCreatedAt(), installTime);
            logger.info("[attribute] combined hitId={}, score={}", hit.getId(), score);
            if (score > bestScore) { bestScore = score; bestCombined = hit; }
        }
        if (bestScore >= ATTRIBUTION_THRESHOLD && bestCombined != null) {
            bestCombined.setResolved(true);
            combinedRepo.save(bestCombined);
            logger.info("[attribute] matched combined hitId={}, referralCode={}, eventId={}", bestCombined.getId(), bestCombined.getReferralCode(), bestCombined.getEventId());
            return new AttributionResult(true, bestCombined.getReferralCode(), bestCombined.getEventId());
        }

        // 2. Fall back to referral_hits (old /r?ref= format)
        List<ReferralHit> referralCandidates =
                referralRepo.findByIpStartingWithAndCreatedAtAfter(ipPrefix, since);
        logger.info("[attribute] referral candidates: ip={}, count={}", ipPrefix, referralCandidates.size());

        bestScore = 0;
        ReferralHit bestReferral = null;
        for (ReferralHit hit : referralCandidates) {
            int score = score(req.getIp(), req.getScreenWidth(), hit.getIp(), hit.getScreenWidth(), hit.getCreatedAt(), installTime);
            logger.info("[attribute] referral hitId={}, score={}", hit.getId(), score);
            if (score > bestScore) { bestScore = score; bestReferral = hit; }
        }
        if (bestScore >= ATTRIBUTION_THRESHOLD && bestReferral != null) {
            logger.info("[attribute] matched referral hitId={}, code={}", bestReferral.getId(), bestReferral.getCode());
            return new AttributionResult(true, bestReferral.getCode(), null);
        }

        logger.info("[attribute] no match for ip={}", req.getIp());
        return new AttributionResult(false, null, null);
    }

    private int score(String reqIp, Integer reqWidth, String hitIp, Integer hitWidth,
                      LocalDateTime hitCreatedAt, LocalDateTime installTime) {
        int score = reqIp.equals(hitIp) ? 60 : 40;
        if (hitCreatedAt != null && Math.abs(Duration.between(hitCreatedAt, installTime).getSeconds()) <= 900) {
            score += 30;
        }
        if (reqWidth != null && hitWidth != null && Math.abs(reqWidth - hitWidth) <= 2) {
            score += 10;
        }
        return score;
    }

    private LocalDateTime parseInstallTime(String installTs) {
        if (installTs == null || installTs.isBlank()) return LocalDateTime.now(ZoneOffset.UTC);
        try {
            return OffsetDateTime.parse(installTs).withOffsetSameInstant(ZoneOffset.UTC).toLocalDateTime();
        } catch (Exception e) {
            try {
                return LocalDateTime.parse(installTs).atZone(ZoneId.of("Asia/Kolkata"))
                        .withZoneSameInstant(ZoneOffset.UTC).toLocalDateTime();
            } catch (Exception ex) {
                return LocalDateTime.now(ZoneOffset.UTC);
            }
        }
    }

    private String extractSubnet(String ip) {
        int lastDot = ip.lastIndexOf('.');
        return lastDot > 0 ? ip.substring(0, lastDot + 1) : ip;
    }

    public static class AttributionResult {
        private final boolean matched;
        private final String referralCode;
        private final String eventId;

        public AttributionResult(boolean matched, String referralCode, String eventId) {
            this.matched = matched;
            this.referralCode = referralCode;
            this.eventId = eventId;
        }

        public boolean isMatched() { return matched; }
        public String getReferralCode() { return referralCode; }
        public String getEventId() { return eventId; }
    }
}