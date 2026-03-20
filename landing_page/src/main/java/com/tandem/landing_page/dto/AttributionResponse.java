package com.tandem.landing_page.dto;

public class AttributionResponse {
    private boolean matched;
    private String referralCode;

    public AttributionResponse(boolean matched, String referralCode) {
        this.matched = matched;
        this.referralCode = referralCode;
    }

    public boolean isMatched() {
        return matched;
    }

    public String getReferralCode() {
        return referralCode;
    }
}
