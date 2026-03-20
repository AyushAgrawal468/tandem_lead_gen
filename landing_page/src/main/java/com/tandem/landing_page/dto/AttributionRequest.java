package com.tandem.landing_page.dto;

public class AttributionRequest {
    private String ip;
    private String userAgent;
    private Integer screenWidth;
    private String lang;
    private String installTs; // ISO-8601 string, when app first launched

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public Integer getScreenWidth() {
        return screenWidth;
    }

    public void setScreenWidth(Integer screenWidth) {
        this.screenWidth = screenWidth;
    }

    public String getLang() {
        return lang;
    }

    public void setLang(String lang) {
        this.lang = lang;
    }

    public String getInstallTs() {
        return installTs;
    }

    public void setInstallTs(String installTs) {
        this.installTs = installTs;
    }
}
