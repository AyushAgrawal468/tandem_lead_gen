package com.tandem.landing_page.Repository;

import com.tandem.landing_page.Entity.CombinedLinkHit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface CombinedLinkHitRepository extends JpaRepository<CombinedLinkHit, Long> {
    List<CombinedLinkHit> findByIpStartingWithAndCreatedAtAfterAndResolvedFalse(String ipPrefix, LocalDateTime since);
}
