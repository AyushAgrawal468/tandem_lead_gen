package com.tandem.landing_page.Entity;

import jakarta.persistence.*;

@Entity
@Table(name="lead")
public class Lead {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String mobile;
    private String email;
    private String location;
    private String sessionId;
    private String locationFetched;

    public Lead() {
    }

    public Lead(Long id, String name, String mobile, String email, String location, String sessionId, String locationFetched) {
        this.id = id;
        this.name = name;
        this.mobile = mobile;
        this.email = email;
        this.location = location;
        this.sessionId=sessionId;
        this.locationFetched = locationFetched;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getLocationFetched() {
        return locationFetched;
    }

    public void setLocationFetched(String locationFetched) {
        this.locationFetched = locationFetched;
    }
}
