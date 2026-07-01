package com.tandem.landing_page.Repository;

import com.tandem.landing_page.Entity.HealthCheckLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthCheckLogRepository extends JpaRepository<HealthCheckLog, Long> {
    List<HealthCheckLog> findTop3ByServiceNameOrderByCheckedAtDesc(String serviceName);
}
