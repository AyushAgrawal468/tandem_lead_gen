package com.tandem.landing_page.dto;

public class LocationResponse {
    private String city;
    private String sessionId;
    private Double lat;
    private Double lon;
    private Double accuracy;

    public LocationResponse(String city, String sessionId,Double lat,Double lon,Double accuracy) {
        this.city = city;
        this.sessionId = sessionId;
        this.lat=lat;
        this.lon=lon;
        this.accuracy=accuracy;
    }

    public String getCity() { return city; }
    public String getSessionId() { return sessionId; }

    public Double getLat() {
        return lat;
    }

    public Double getLon() {
        return lon;
    }

    public Double getAccuracy() {
        return accuracy;
    }
}
