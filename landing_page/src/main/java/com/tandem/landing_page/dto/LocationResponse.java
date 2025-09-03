package com.tandem.landing_page.dto;

public class LocationResponse {
    private String city;
    private String sessionId;

    public LocationResponse(String city, String sessionId) {
        this.city = city;
        this.sessionId = sessionId;
    }

    public String getCity() { return city; }
    public String getSessionId() { return sessionId; }
}
