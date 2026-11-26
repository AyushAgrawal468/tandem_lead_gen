package com.tandem.landing_page.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

/** City-not-supported waitlist (canvas J1-19a): "leave your number and we'll tell you when we launch there". */
@Entity
@Table(name = "waitlist", uniqueConstraints = @UniqueConstraint(columnNames = {"mobile", "city"}))
public class WaitlistEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[6-9][0-9]{9}$", message = "Mobile number must be 10 digits")
    private String mobile;

    @NotBlank(message = "City is required")
    @Size(max = 80, message = "City is too long")
    private String city;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
