package com.tandem.landing_page.service;
import com.tandem.landing_page.dto.LocationRequest;
import com.tandem.landing_page.Entity.UserLocation;
import com.tandem.landing_page.Repository.UserLocationRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.json.JSONArray;
import org.json.JSONObject;

@Service
public class LocationService {

    private final UserLocationRepository repository;
    private final String OPENCAGE_API_KEY = "8412a66ff5de4cfdb7b903319d63511d"; // replace with your key

    public LocationService(UserLocationRepository repository) {
        this.repository = repository;
    }

    public UserLocation saveLocationWithCity(LocationRequest request) {
        UserLocation loc = new UserLocation();


        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://api.opencagedata.com/geocode/v1/json?q="
                    + request.getLat() + "+" + request.getLon()
                    + "&key=" + OPENCAGE_API_KEY;

            String resp = restTemplate.getForObject(url, String.class);
            JSONObject obj = new JSONObject(resp);

            String city = null;
            JSONArray results = obj.getJSONArray("results");
            if (results.length() > 0) {
                JSONObject components = results.getJSONObject(0).getJSONObject("components");

                if (components.has("city")) city = components.getString("city");
                else if (components.has("town")) city = components.getString("town");
                else if (components.has("village")) city = components.getString("village");
            }

            loc.setCity(city);

        } catch (Exception e) {
            loc.setCity(null);
            e.printStackTrace();
        }

        return repository.save(loc);
    }
}

