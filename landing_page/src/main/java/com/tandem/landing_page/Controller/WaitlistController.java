package com.tandem.landing_page.Controller;

import com.tandem.landing_page.Entity.WaitlistEntry;
import com.tandem.landing_page.Repository.WaitlistRepository;
import jakarta.validation.Valid;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

/**
 * POST /api/waitlist {mobile, city}: city-not-supported waitlist (canvas J1-19a/b).
 * No auth; nginx rate-limits it with /api/leads. Joining twice for the same city is a no-op, and the
 * response never echoes the number back.
 */
@RestController
@RequestMapping("/api/waitlist")
public class WaitlistController {

    private final WaitlistRepository repo;

    public WaitlistController(WaitlistRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public ResponseEntity<Void> join(@Valid @RequestBody WaitlistEntry entry) {
        entry.setCity(entry.getCity().trim());
        if (!repo.existsByMobileAndCityIgnoreCase(entry.getMobile(), entry.getCity())) {
            try {
                repo.save(entry);
            } catch (DataIntegrityViolationException dup) {
                // two taps at once: the unique (mobile, city) row is already there
            }
        }
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        StringBuilder errors = new StringBuilder();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.append(error.getField()).append(": ").append(error.getDefaultMessage()).append("; ")
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors.toString());
    }
}
