package com.tandem.landing_page.Controller;
import com.tandem.landing_page.Repository.LeadRepository;

import com.tandem.landing_page.Entity.Lead;
import com.tandem.landing_page.Repository.LeadRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/api/get")
@CrossOrigin(origins = "*")
public class AdminController {

    private final LeadRepository leadRepo;

    public AdminController(LeadRepository leadRepo) {
        this.leadRepo = leadRepo;
    }

    @GetMapping("/all")
    public List<Lead> getAllLeads() {
        return leadRepo.findAll();
    }

    @GetMapping("/date")
    public ResponseEntity<?> getLeadsByDate(@RequestParam String createdDate) {
        // Accept flexible input like '1-1-2025' or '01-01-2025', but normalize to 'dd-MM-yyyy'
        LocalDate parsedDate;
        try {
            DateTimeFormatter flexible = DateTimeFormatter.ofPattern("d-M-uuuu");
            parsedDate = LocalDate.parse(createdDate, flexible);
        } catch (DateTimeParseException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("createdDate must be a valid date in DD-MM-YYYY format (e.g. 01-01-2025)");
        }

        // Normalize to DD-MM-YYYY
        String normalized = parsedDate.format(DateTimeFormatter.ofPattern("dd-MM-uuuu"));

        List<Lead> leads = leadRepo.findByCreatedAt(normalized);
        return ResponseEntity.ok(leads);
    }
}
