package com.example.backend.domain.dtos.payments;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

public class ProductTest {

    @Test
    public void testDefaultConstructor() {
        Product product = new Product();

        assertNull(product.getId());
        assertNull(product.getName());
        assertNull(product.getPrice());
        assertNull(product.getCurrency());
    }

    @Test
    public void testParameterizedConstructor() {
        String id = "prod-001";
        String name = "Premium Upgrade";
        Long price = 999L;
        String currency = "USD";

        Product product = new Product(id, name, price, currency);

        assertEquals(id, product.getId());
        assertEquals(name, product.getName());
        assertEquals(price, product.getPrice());
        assertEquals(currency, product.getCurrency());
    }

    @Test
    public void testSettersAndGetters() {
        Product product = new Product();

        product.setId("prod-002");
        product.setName("Basic Upgrade");
        product.setPrice(499L);
        product.setCurrency("EUR");

        assertEquals("prod-002", product.getId());
        assertEquals("Basic Upgrade", product.getName());
        assertEquals(499L, product.getPrice());
        assertEquals("EUR", product.getCurrency());
    }
}
