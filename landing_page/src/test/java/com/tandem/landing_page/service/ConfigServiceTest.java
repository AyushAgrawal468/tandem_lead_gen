package com.tandem.landing_page.service;

import com.tandem.landing_page.Entity.AppConfig;
import com.tandem.landing_page.Repository.AppConfigRepository;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ConfigServiceTest {

    private ConfigService serviceWith(AppConfig... rows) {
        AppConfigRepository repo = mock(AppConfigRepository.class);
        when(repo.findAll()).thenReturn(List.of(rows));
        ConfigService service = new ConfigService(repo);
        service.load();
        return service;
    }

    @Test
    void attributionAcceptsNewSecretOrLegacyKeyOnly() {
        ConfigService s = serviceWith(
                new AppConfig("app.security.attribution-secret", "new-secret"),
                new AppConfig("app.security.api-key", "old-key"));

        assertTrue(s.isAttributionAuthorized("new-secret", null));
        assertTrue(s.isAttributionAuthorized(null, "old-key"));
        assertFalse(s.isAttributionAuthorized("wrong", "wrong"));
        assertFalse(s.isAttributionAuthorized(null, null));
        assertFalse(s.isAttributionAuthorized("", ""));
        assertFalse(s.isAttributionAuthorized("old-key", "new-secret")); // headers aren't interchangeable
    }

    @Test
    void deletingLegacyRowRevokesOldKey() {
        ConfigService s = serviceWith(new AppConfig("app.security.attribution-secret", "new-secret"));

        assertFalse(s.isAttributionAuthorized(null, "old-key"));
        assertTrue(s.isAttributionAuthorized("new-secret", null));
    }
}
