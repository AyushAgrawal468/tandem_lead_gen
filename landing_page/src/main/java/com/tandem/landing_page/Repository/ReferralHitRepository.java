package com.tandem.landing_page.Repository;

import com.tandem.landing_page.Entity.ReferralHit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReferralHitRepository extends JpaRepository<ReferralHit, Long> {
    Optional<ReferralHit> findFirstByCodeOrderByCreatedAtDesc(String referralCode);

}
