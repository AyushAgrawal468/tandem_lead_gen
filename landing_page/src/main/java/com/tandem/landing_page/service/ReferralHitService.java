package com.tandem.landing_page.service;

import com.tandem.landing_page.Entity.ReferralHit;
import com.tandem.landing_page.Repository.ReferralHitRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReferralHitService {

    private final ReferralHitRepository repository;

    public ReferralHitService(ReferralHitRepository repository) {
        this.repository = repository;
    }

    public void save(String code, String userAgent, String ip) {
        ReferralHit hit = new ReferralHit();
        hit.setCode(code);
        hit.setUserAgent(userAgent);
        hit.setIp(ip);
        repository.save(hit);
    }

    public ReferralHit getReferalHitsByReferralCode(String referralCode) {

        Optional<ReferralHit> referralHits  = repository.findFirstByCodeOrderByCreatedAtDesc(referralCode);
        return referralHits.orElse(null);
    }
}
