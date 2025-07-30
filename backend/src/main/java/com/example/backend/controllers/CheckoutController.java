package com.example.backend.controllers;

import java.io.IOException;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.application.services.CheckoutService;
import com.example.backend.domain.dtos.PaymentDTO;
import com.example.backend.domain.entities.User;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.net.Webhook;

import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/checkout")
public class CheckoutController {
    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody PaymentDTO data) throws StripeException {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(principal instanceof User user)) {
          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String sessionId = checkoutService.createCheckoutSession(data, user);
        return ResponseEntity.ok(Map.of("id", sessionId));
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeEvent(HttpServletRequest request, @RequestHeader("Stripe-Signature") String sigHeader) {
        String payload;

        try {
            payload = request.getReader().lines().collect(Collectors.joining("\n"));
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Failed to read request");
        }

        Event event;

        try {
            event = Webhook.constructEvent(
                payload,
                sigHeader,
                endpointSecret
            );
        } catch (SignatureVerificationException e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(400).body("Invalid signature");
        }

        switch (event.getType()) {
            case "payment_intent.succeeded" -> {
                System.out.println("✅ Payment succeeded");
                System.out.println(event);
                checkoutService.handlePaymentIntentSucceeded(event);
            }
            case "payment_intent.payment_failed" -> System.out.println("❌ Payment failed");
            default -> System.out.println("Unhandled event type: " + event.getType());
        }

        return ResponseEntity.ok("");
    }
}

