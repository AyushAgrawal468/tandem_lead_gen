package com.tandem.landing_page.Repository;

import com.tandem.landing_page.Entity.EventLinkHit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface EventLinkHitRepository extends JpaRepository<EventLinkHit, Long> {
    List<EventLinkHit> findByIpAndCreatedAtAfter(String ip, LocalDateTime since);
}