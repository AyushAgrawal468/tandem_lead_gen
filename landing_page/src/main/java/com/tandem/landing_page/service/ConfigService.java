package com.tandem.landing_page.service;

import com.tandem.landing_page.Entity.AppConfig;
import com.tandem.landing_page.Repository.AppConfigRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
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

    /** Constant-time check of a caller-supplied secret. A missing config row never matches (so deleting the row revokes it). */
    public boolean matches(String key, String candidate) {
        String expected = cache.get(key);
        if (expected == null || candidate == null || candidate.isBlank()) return false;
        return MessageDigest.isEqual(expected.getBytes(StandardCharsets.UTF_8), candidate.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Server-to-server auth for the /attribute endpoints (only tandem-core calls them).
     * ponytail: old X-API-KEY accepted during switchover; revoke it by deleting the app.security.api-key row + restart.
     */
    public boolean isAttributionAuthorized(String attributionSecret, String legacyApiKey) {
        return matches("app.security.attribution-secret", attributionSecret)
                || matches("app.security.api-key", legacyApiKey);
    }
}