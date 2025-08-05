package com.example.backend.domain.dtos;

import com.example.backend.domain.dtos.payments.PaymentType;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

public class PaymentDTOTest {

    @Test
    public void testNoArgsConstructorDefaults() {
        PaymentDTO dto = new PaymentDTO();

        assertNull(dto.getType());
        assertNull(dto.getId());
    }

    @Test
    public void testAllArgsConstructor() {
        PaymentType type = PaymentType.UPGRADE_TEAM;
        String id = "payment-123";

        PaymentDTO dto = new PaymentDTO(type, id);

        assertEquals(type, dto.getType());
        assertEquals(id, dto.getId());
    }

    @Test
    public void testSettersAndGetters() {
        PaymentDTO dto = new PaymentDTO();

        dto.setType(PaymentType.UPGRADE_TEAM);
        dto.setId("paypal-456");

        assertEquals(PaymentType.UPGRADE_TEAM, dto.getType());
        assertEquals("paypal-456", dto.getId());
    }
}
