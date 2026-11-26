package com.tandem.landing_page.Repository;

import com.tandem.landing_page.Entity.WaitlistEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WaitlistRepository extends JpaRepository<WaitlistEntry, Long> {
    boolean existsByMobileAndCityIgnoreCase(String mobile, String city);
}
