package com.tandem.landing_page.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_check_logs")
public class HealthCheckLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String serviceName;

    @Column(nullable = false)
    private String status;

    private Integer httpCode;
    private Integer responseTimeMs;
    private Integer connectionPoolActive;
    private Integer connectionPoolPending;
    private Integer connectionPoolMax;
    private String dbStatus;
    private Integer dbResponseTimeMs;
    private Integer memoryUsedPercent;
    private Integer threadPoolActive;
    private Integer threadPoolMax;

    @Column(columnDefinition = "TEXT")
    private String issues;

    @Column(columnDefinition = "TEXT")
    private String rawResponse;

    @Column(nullable = false)
    private LocalDateTime requestSentAt;

    private LocalDateTime responseReceivedAt;

    @Column(nullable = false)
    private LocalDateTime checkedAt;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Long getId() { return id; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getHttpCode() { return httpCode; }
    public void setHttpCode(Integer httpCode) { this.httpCode = httpCode; }

    public Integer getResponseTimeMs() { return responseTimeMs; }
    public void setResponseTimeMs(Integer responseTimeMs) { this.responseTimeMs = responseTimeMs; }

    public Integer getConnectionPoolActive() { return connectionPoolActive; }
    public void setConnectionPoolActive(Integer connectionPoolActive) { this.connectionPoolActive = connectionPoolActive; }

    public Integer getConnectionPoolPending() { return connectionPoolPending; }
    public void setConnectionPoolPending(Integer connectionPoolPending) { this.connectionPoolPending = connectionPoolPending; }

    public Integer getConnectionPoolMax() { return connectionPoolMax; }
    public void setConnectionPoolMax(Integer connectionPoolMax) { this.connectionPoolMax = connectionPoolMax; }

    public String getDbStatus() { return dbStatus; }
    public void setDbStatus(String dbStatus) { this.dbStatus = dbStatus; }

    public Integer getDbResponseTimeMs() { return dbResponseTimeMs; }
    public void setDbResponseTimeMs(Integer dbResponseTimeMs) { this.dbResponseTimeMs = dbResponseTimeMs; }

    public Integer getMemoryUsedPercent() { return memoryUsedPercent; }
    public void setMemoryUsedPercent(Integer memoryUsedPercent) { this.memoryUsedPercent = memoryUsedPercent; }

    public Integer getThreadPoolActive() { return threadPoolActive; }
    public void setThreadPoolActive(Integer threadPoolActive) { this.threadPoolActive = threadPoolActive; }

    public Integer getThreadPoolMax() { return threadPoolMax; }
    public void setThreadPoolMax(Integer threadPoolMax) { this.threadPoolMax = threadPoolMax; }

    public String getIssues() { return issues; }
    public void setIssues(String issues) { this.issues = issues; }

    public String getRawResponse() { return rawResponse; }
    public void setRawResponse(String rawResponse) { this.rawResponse = rawResponse; }

    public LocalDateTime getRequestSentAt() { return requestSentAt; }
    public void setRequestSentAt(LocalDateTime requestSentAt) { this.requestSentAt = requestSentAt; }

    public LocalDateTime getResponseReceivedAt() { return responseReceivedAt; }
    public void setResponseReceivedAt(LocalDateTime responseReceivedAt) { this.responseReceivedAt = responseReceivedAt; }

    public LocalDateTime getCheckedAt() { return checkedAt; }
    public void setCheckedAt(LocalDateTime checkedAt) { this.checkedAt = checkedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
