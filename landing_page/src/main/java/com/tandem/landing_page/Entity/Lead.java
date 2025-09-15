package com.tandem.landing_page.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name="lead")
public class Lead {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Pattern(regexp = "^[A-Za-z ]+$", message = "Name must contain only alphabets and spaces")
    private String name;

    // Validates mobile number to be 10 digits
    @NotBlank(message = "Mobile number is required")
    @Size(min = 10, max = 10, message = "Mobile number must be exactly 10 digits")
    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be numeric and 10 digits")
    private String mobile;

    //Email validation
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid (e.g. user@example.com)")
    private String email;

    @NotBlank(message = "Location is required")
    @Pattern(regexp = "^[A-Za-z ]+$", message = "Location must contain only alphabets and spaces")
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
