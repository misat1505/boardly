package com.example.backend.domain.dtos;

import com.example.backend.domain.dtos.payments.PaymentType;

public class PaymentDTO {
    private PaymentType type;
    private String id;

    public PaymentDTO() {}

    public PaymentDTO(PaymentType type, String id) {
        this.type = type;
        this.id = id;
    }

    public PaymentType getType() {
        return type;
    }

    public void setType(PaymentType type) {
        this.type = type;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}

