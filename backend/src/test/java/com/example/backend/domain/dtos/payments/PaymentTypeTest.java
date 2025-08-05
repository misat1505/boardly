package com.example.backend.domain.dtos.payments;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class PaymentTypeTest {

    @Test
    public void testEnumValues() {
        PaymentType[] expectedValues = {PaymentType.UPGRADE_TEAM, PaymentType.UPGRADE_USER};
        assertArrayEquals(expectedValues, PaymentType.values());
    }

    @Test
    public void testValueOf() {
        assertEquals(PaymentType.UPGRADE_TEAM, PaymentType.valueOf("UPGRADE_TEAM"));
        assertEquals(PaymentType.UPGRADE_USER, PaymentType.valueOf("UPGRADE_USER"));
    }
}
