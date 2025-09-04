package com.tandem.landing_page.service;

import com.tandem.landing_page.Entity.Lead;
import com.tandem.landing_page.Repository.LeadRepository;
import com.tandem.landing_page.Repository.UserLocationRepository;
import org.springframework.stereotype.Service;

@Service
public class LeadService {

    private final LeadRepository leadRepository;
    private final UserLocationRepository userLocationRepository;

    public LeadService(LeadRepository leadRepository, UserLocationRepository userLocationRepository) {
        this.leadRepository = leadRepository;
        this.userLocationRepository = userLocationRepository;
    }

    public Lead saveLead(Lead lead) {
        // check if sessionId exists in user_loc
        if (lead.getSessionId() != null) {
            userLocationRepository.findBySessionId(lead.getSessionId())
                    .ifPresent(userLoc -> lead.setLocationFetched(userLoc.getCity())); // set city if found
        }
        return leadRepository.save(lead);
    }
}
