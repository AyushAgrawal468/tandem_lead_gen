package com.tandem.landing_page.Repository;

import com.tandem.landing_page.Entity.ReferralHit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReferralHitRepository extends JpaRepository<ReferralHit, Long> {
    Optional<ReferralHit> findFirstByCodeOrderByCreatedAtDesc(String referralCode);
    List<ReferralHit> findByIpAndCreatedAtAfter(String ip, LocalDateTime since);
    List<ReferralHit> findByIpStartingWithAndCreatedAtAfter(String ipPrefix, LocalDateTime since);
}
