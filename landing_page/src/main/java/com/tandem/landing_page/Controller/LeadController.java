package com.tandem.landing_page.Controller;

import com.tandem.landing_page.Entity.Lead;
import com.tandem.landing_page.Entity.UserLocation;
import com.tandem.landing_page.Repository.LeadRepository;
import com.tandem.landing_page.Repository.UserLocationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/leads")
@CrossOrigin(origins = "*") // Allow frontend calls
public class LeadController {

    private final LeadRepository leadRepo;
    private final UserLocationRepository locationRepo;

    public LeadController(LeadRepository leadRepo, UserLocationRepository locationRepo) {
        this.leadRepo = leadRepo;
        this.locationRepo = locationRepo;
    }

    @PostMapping
    public Lead submitLead(@RequestBody Lead lead) {
        // Lookup city by sessionId
        if (lead.getSessionId() != null) {
            Optional<UserLocation> locOpt = locationRepo.findBySessionId(lead.getSessionId());
            if (locOpt.isPresent()) {
                lead.setCityReal(locOpt.get().getCity()); // set matched city
            } else {
                lead.setCityReal(null); // no match found
            }
        }

        return leadRepo.save(lead);
    }
}
