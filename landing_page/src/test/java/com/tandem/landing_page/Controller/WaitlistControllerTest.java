package com.tandem.landing_page.Controller;

import com.tandem.landing_page.Entity.WaitlistEntry;
import com.tandem.landing_page.Repository.WaitlistRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.dao.DataIntegrityViolationException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class WaitlistControllerTest {

    private WaitlistRepository repo;
    private WaitlistController controller;

    @BeforeEach
    void setup() {
        repo = Mockito.mock(WaitlistRepository.class);
        controller = new WaitlistController(repo);
    }

    private static WaitlistEntry entry(String city) {
        WaitlistEntry e = new WaitlistEntry();
        e.setMobile("9876543210");
        e.setCity(city);
        return e;
    }

    @Test
    void savesNewEntryWithTrimmedCity() {
        when(repo.existsByMobileAndCityIgnoreCase("9876543210", "Lucknow")).thenReturn(false);

        assertEquals(204, controller.join(entry("  Lucknow ")).getStatusCode().value());
        verify(repo).save(argThat(e -> e.getCity().equals("Lucknow")));
    }

    @Test
    void sameNumberAndCityIsANoOp() {
        when(repo.existsByMobileAndCityIgnoreCase("9876543210", "Lucknow")).thenReturn(true);

        assertEquals(204, controller.join(entry("Lucknow")).getStatusCode().value());
        verify(repo, never()).save(any());
    }

    @Test
    void raceOnTheUniqueRowStillAnswers204() {
        when(repo.save(any())).thenThrow(new DataIntegrityViolationException("dup"));

        assertEquals(204, controller.join(entry("Lucknow")).getStatusCode().value());
    }
}
