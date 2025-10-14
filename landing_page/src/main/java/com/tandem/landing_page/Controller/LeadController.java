package com.tandem.landing_page.Controller;

import com.tandem.landing_page.Entity.Lead;
import com.tandem.landing_page.Entity.UserLocation;
import com.tandem.landing_page.Repository.LeadRepository;
import com.tandem.landing_page.Repository.UserLocationRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;
import jakarta.validation.Valid;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.Optional;

@RestController
@RequestMapping("/api/leads")
@CrossOrigin(origins = "*") // Allow frontend calls
@Validated
public class LeadController {

    private final LeadRepository leadRepo;
    private final UserLocationRepository locationRepo;

    /**
     * Constructor for LeadController
     * @param leadRepo LeadRepository instance
     * @param locationRepo UserLocationRepository instance
     */
    public LeadController(LeadRepository leadRepo, UserLocationRepository locationRepo) {
        this.leadRepo = leadRepo;
        this.locationRepo = locationRepo;
    }

    /**
     * Accepts a Lead object and saves it after validation.
     * Validates name, mobile, email, and location fields.
     * @param lead Lead object containing user details
     * @return Saved Lead entity
     */
    @PostMapping
    public Lead submitLead(@Valid @RequestBody Lead lead) {
        // Lookup city by sessionId
        if (lead.getSessionId() != null) {
            Optional<UserLocation> locOpt = locationRepo.findBySessionId(lead.getSessionId());
            if (locOpt.isPresent()) {
                lead.setLocationFetched(locOpt.get().getCity()); // set matched city
            } else {
                lead.setLocationFetched(null); // no match found
            }
        }
        if(leadRepo.existsByEmailAndMobile(lead.getEmail(), lead.getMobile())) {
            return lead; // Duplicate lead, do not save
        }
        return leadRepo.save(lead);
    }

    /**
     * Handles validation errors and returns readable error messages.
     * @param ex MethodArgumentNotValidException
     * @return ResponseEntity with error details
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        StringBuilder errors = new StringBuilder();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errors.append(error.getField()).append(": ").append(error.getDefaultMessage()).append("; ");
        });

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors.toString());
    }


}
