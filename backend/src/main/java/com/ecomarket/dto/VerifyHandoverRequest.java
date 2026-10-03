package com.ecomarket.dto;

import jakarta.validation.constraints.NotBlank;

public class VerifyHandoverRequest {

    @NotBlank(message = "Handover code is required")
    private String handoverCode;

    public VerifyHandoverRequest() {}

    public VerifyHandoverRequest(String handoverCode) {
        this.handoverCode = handoverCode;
    }

    public String getHandoverCode() {
        return handoverCode;
    }

    public void setHandoverCode(String handoverCode) {
        this.handoverCode = handoverCode;
    }
}
