package com.tandem.landing_page.Controller;

import com.tandem.landing_page.Entity.Lead;
import com.tandem.landing_page.Repository.LeadRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leads")
@CrossOrigin(origins = "*") // Allow frontend calls
public class LeadController {
    private final LeadRepository repo;

    public LeadController(LeadRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public Lead submitLead(@RequestBody Lead lead) {
        System.out.println(lead);
        return repo.save(lead);
    }
}
