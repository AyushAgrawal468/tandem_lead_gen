package com.tandem.landing_page.service;

import com.tandem.landing_page.Entity.AppConfig;
import com.tandem.landing_page.Repository.AppConfigRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * Loads secrets from the app_config table at startup.
 * To update a secret: UPDATE app_config SET config_value = '...' WHERE config_key = '...';
 * Then restart the service (or call reload() if hot-reload is needed later).
 */
@Service
public class ConfigService {

    private static final Logger log = LoggerFactory.getLogger(ConfigService.class);

    // ponytail: seeded once at startup, no per-request DB hit
    private final Map<String, String> cache = new HashMap<>();

    private final AppConfigRepository repo;

    public ConfigService(AppConfigRepository repo) {
        this.repo = repo;
    }

    @PostConstruct
    public void load() {
        repo.findAll().forEach(c -> cache.put(c.getConfigKey(), c.getConfigValue()));
        log.info("ConfigService: loaded {} keys from app_config", cache.size());
    }

    public String get(String key) {
        String value = cache.get(key);
        if (value == null) throw new IllegalStateException("Missing config key in app_config table: " + key);
        return value;
    }
}