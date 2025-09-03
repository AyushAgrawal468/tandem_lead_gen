package com.tandem.landing_page.Controller;

import com.tandem.landing_page.dto.LocationRequest;
import com.tandem.landing_page.dto.LocationResponse;
import com.tandem.landing_page.Entity.UserLocation;
import com.tandem.landing_page.service.LocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/location")
@CrossOrigin(origins = "*")
public class LocationController {

    private final LocationService service;

    public LocationController(LocationService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<LocationResponse> saveLocation(@RequestBody LocationRequest request) {
        UserLocation saved = service.saveLocationWithCity(request);
        return ResponseEntity.ok(new LocationResponse(saved.getCity(), saved.getSessionId()));
    }
}
