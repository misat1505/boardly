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

import com.example.backend.domain.entities.User;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.PaymentIntent;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;

import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/checkout")
public class CheckoutController {
    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody Map<String, Object> data) throws StripeException {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(principal instanceof User user)) {
          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String productName = data.get("name").toString();
        long price = Long.parseLong(data.get("price").toString());

        SessionCreateParams params = SessionCreateParams.builder()
            .setMode(SessionCreateParams.Mode.PAYMENT)
            .setSuccessUrl("http://localhost:3000/payments/success")
            .setCancelUrl("http://localhost:3000/payments/cancel")
            .setCustomerEmail(user.getEmail())
            .setPaymentIntentData(
                SessionCreateParams.PaymentIntentData.builder()
                    .putMetadata("userId", user.getId().toString())
                    .putMetadata("productName", productName)
                    .putMetadata("checkout_session_id", "auto")
                    .build()
            )
            .addLineItem(
                SessionCreateParams.LineItem.builder()
                    .setQuantity(1L)
                    .setPriceData(
                        SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency("usd")
                            .setUnitAmount(price)
                            .setProductData(
                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                    .setName(productName)
                                    .build()
                            )
                            .build()
                    )
                    .build()
                )
            .build();

        Session session = Session.create(params);
        return ResponseEntity.ok(Map.of("id", session.getId()));
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
            case "payment_intent.succeeded":
                System.out.println("✅ Payment succeeded");
                System.out.println(event);
                break;
            case "payment_intent.payment_failed":
                System.out.println("❌ Payment failed");
                break;
            default:
                System.out.println("Unhandled event type: " + event.getType());
        }

        return ResponseEntity.ok("");
    }
}

