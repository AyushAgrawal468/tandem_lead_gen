package com.tandem.landing_page.Controller;

import com.tandem.landing_page.dto.LocationRequest;
import com.tandem.landing_page.dto.LocationResponse;
import com.tandem.landing_page.Entity.UserLocation;
import com.tandem.landing_page.service.LocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/location")
@CrossOrigin(origins = "*")
public class LocationController {

    private final LocationService service;

    /**
     * Constructor for LocationController
     * @param service LocationService instance
     */
    public LocationController(LocationService service) {
        this.service = service;
    }

    /**
     * Accepts a LocationRequest and saves a UserLocation.
     * Validates city field to ensure only alphabets and spaces are allowed.
     * @param request LocationRequest containing location details
     * @return LocationResponse with saved city and sessionId
     */
    @PostMapping
    public ResponseEntity<LocationResponse> saveLocation(@Valid @RequestBody LocationRequest request) {
        UserLocation saved = service.saveLocationWithCity(request);
        return ResponseEntity.ok(new LocationResponse(saved.getCity(), saved.getSessionId()));
    }
}
