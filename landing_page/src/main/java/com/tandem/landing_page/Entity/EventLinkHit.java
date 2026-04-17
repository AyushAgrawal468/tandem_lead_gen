package com.tandem.landing_page.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "event_link_hits")
public class EventLinkHit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String eventId;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private boolean resolved = false;

    private String userAgent;
    private String ip;
    private Integer screenWidth;
    private String lang;
    private String platform;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public EventLinkHit() {}

    public Long getId() { return id; }

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public String getIp() { return ip; }
    public void setIp(String ip) { this.ip = ip; }

    public Integer getScreenWidth() { return screenWidth; }
    public void setScreenWidth(Integer screenWidth) { this.screenWidth = screenWidth; }

    public String getLang() { return lang; }
    public void setLang(String lang) { this.lang = lang; }

    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }

    public boolean isResolved() { return resolved; }
    public void setResolved(boolean resolved) { this.resolved = resolved; }
}