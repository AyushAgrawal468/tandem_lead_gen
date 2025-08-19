package com.tandem.landing_page.dto;
public class LocationRequest {

    private Double lat;
    private Double lon;
    private Double accuracy;
    private String source;
    private Double ts;  // timestamp as Double

    // Getters and Setters
    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }

    public Double getLon() { return lon; }
    public void setLon(Double lon) { this.lon = lon; }

    public Double getAccuracy() { return accuracy; }
    public void setAccuracy(Double accuracy) { this.accuracy = accuracy; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public Double getTs() { return ts; }
    public void setTs(Double ts) { this.ts = ts; }
}
