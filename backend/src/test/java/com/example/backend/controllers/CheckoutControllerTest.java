package com.example.backend.controllers;

import com.example.backend.application.services.CheckoutService;
import com.example.backend.domain.dtos.PaymentDTO;
import com.example.backend.domain.entities.User;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class CheckoutControllerTest {

    @Mock
    private CheckoutService checkoutService;

    @Mock
    private HttpServletRequest request;

    @InjectMocks
    private CheckoutController checkoutController;

    @Captor
    private ArgumentCaptor<String> sessionIdCaptor;

    private User mockUser;

    private final String endpointSecret = "whsec_testsecret";

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        checkoutController = new CheckoutController(checkoutService, endpointSecret);

        mockUser = new User();
        mockUser.setId(UUID.randomUUID());
    }

    @Test
    void createCheckoutSession_ReturnsSessionId() throws Exception {
        PaymentDTO dto = new PaymentDTO();
        String expectedSessionId = "sess_abc123";

        when(checkoutService.createCheckoutSession(dto, mockUser)).thenReturn(expectedSessionId);

        ResponseEntity<Map<String, String>> response = checkoutController.createCheckoutSession(dto, mockUser);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(expectedSessionId, response.getBody().get("id"));
        verify(checkoutService).createCheckoutSession(dto, mockUser);
    }

    @Test
    void handleStripeEvent_ValidSignature_PaymentSucceeded_CallsService() throws Exception {
        // Mock payload and signature header
        String payload = "{\"id\": \"evt_123\", \"type\": \"payment_intent.succeeded\"}";
        String sigHeader = "t=123,v1=signature";

        BufferedReader reader = new BufferedReader(new StringReader(payload));
        when(request.getReader()).thenReturn(reader);

        // Mock Webhook.constructEvent to return an Event with type "payment_intent.succeeded"
        Event event = mock(Event.class);
        when(event.getType()).thenReturn("payment_intent.succeeded");

        // We need to mock the static method Webhook.constructEvent. Use Mockito inline or PowerMockito if available.
        // Here we use Mockito.mockStatic for illustration (requires Mockito 3.4+ and inline mock-maker)
        try (MockedStatic<Webhook> webhookStatic = mockStatic(Webhook.class)) {
            webhookStatic.when(() -> Webhook.constructEvent(payload, sigHeader, endpointSecret)).thenReturn(event);

            ResponseEntity<String> response = checkoutController.handleStripeEvent(request, sigHeader);

            assertEquals(200, response.getStatusCodeValue());
            assertEquals("", response.getBody());

            verify(checkoutService).handlePaymentIntentSucceeded(event);
        }
    }

    @Test
    void handleStripeEvent_InvalidSignature_Returns400() throws Exception {
        String payload = "{\"id\": \"evt_123\", \"type\": \"payment_intent.succeeded\"}";
        String sigHeader = "invalid_signature";

        BufferedReader reader = new BufferedReader(new StringReader(payload));
        when(request.getReader()).thenReturn(reader);

        try (MockedStatic<Webhook> webhookStatic = mockStatic(Webhook.class)) {
            webhookStatic.when(() -> Webhook.constructEvent(payload, sigHeader, endpointSecret))
                    .thenThrow(new SignatureVerificationException("Invalid signature", null));

            ResponseEntity<String> response = checkoutController.handleStripeEvent(request, sigHeader);

            assertEquals(400, response.getStatusCodeValue());
            assertEquals("Invalid signature", response.getBody());

            verify(checkoutService, never()).handlePaymentIntentSucceeded(any());
        }
    }

    @Test
    void handleStripeEvent_ReadPayloadFails_ReturnsBadRequest() throws Exception {
        when(request.getReader()).thenThrow(new IOException("Failed to read"));

        ResponseEntity<String> response = checkoutController.handleStripeEvent(request, "sigHeader");

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Failed to read request", response.getBody());

        verifyNoInteractions(checkoutService);
    }
}

