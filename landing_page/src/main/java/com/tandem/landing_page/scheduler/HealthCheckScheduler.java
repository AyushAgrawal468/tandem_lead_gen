package com.tandem.landing_page.scheduler;

import com.tandem.landing_page.service.HealthCheckService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class HealthCheckScheduler {

    private final HealthCheckService healthCheckService;

    public HealthCheckScheduler(HealthCheckService healthCheckService) {
        this.healthCheckService = healthCheckService;
    }

    @Scheduled(cron = "0 0/15 * * * *")
    public void runHealthCheck() {
        healthCheckService.checkAndLog();
    }

    @Scheduled(cron = "0 0/15 * * * *")
    public void runScraperHealthCheck() {
        healthCheckService.checkScraperAndLog();
    }
}
