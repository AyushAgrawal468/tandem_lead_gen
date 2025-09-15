package com.tandem.landing_page.service;

import com.tandem.landing_page.dto.LocationRequest;
import com.tandem.landing_page.Entity.UserLocation;
import com.tandem.landing_page.Repository.UserLocationRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Service for handling location-related operations, including geocoding and saving user location.
 */
@Service
public class LocationService {

    private final UserLocationRepository repository;
    // OpenCage API key for geocoding
    private final String OPENCAGE_API_KEY = "8412a66ff5de4cfdb7b903319d63511d"; // put your key

    /**
     * Constructor for LocationService
     * @param repository UserLocationRepository instance
     */
    public LocationService(UserLocationRepository repository) {
        this.repository = repository;
    }

    /**
     * Uses latitude and longitude from LocationRequest to fetch city name using OpenCage API,
     * then saves the city and sessionId in the database.
     * @param request LocationRequest containing lat/lon and sessionId
     * @return Saved UserLocation entity
     */
    public UserLocation saveLocationWithCity(LocationRequest request) {
        String city = null;

        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://api.opencagedata.com/geocode/v1/json?q="
                    + request.getLat() + "+" + request.getLon()
                    + "&key=" + OPENCAGE_API_KEY;

            String resp = restTemplate.getForObject(url, String.class);
            JSONObject obj = new JSONObject(resp);

            JSONArray results = obj.getJSONArray("results");
            if (results.length() > 0) {
                JSONObject components = results.getJSONObject(0).getJSONObject("components");

                // Try to get city, town, or village from geocoding response
                if (components.has("city")) city = components.getString("city");
                else if (components.has("town")) city = components.getString("town");
                else if (components.has("village")) city = components.getString("village");
            }
        } catch (Exception e) {
            // Log and ignore errors, city will be null if not found
            e.printStackTrace();
        }

        // Save only city + sessionId
        UserLocation loc = new UserLocation();
        loc.setCity(city);
        loc.setSessionId(request.getSessionId());

        return repository.save(loc);
    }
}
