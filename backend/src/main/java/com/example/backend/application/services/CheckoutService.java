package com.example.backend.application.services;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.backend.domain.dtos.PaymentDTO;
import com.example.backend.domain.dtos.payments.PaymentType;
import com.example.backend.domain.dtos.payments.Product;
import com.example.backend.domain.entities.Team;
import com.example.backend.domain.entities.User;
import com.example.backend.infrastructure.TeamRepository;
import com.example.backend.infrastructure.UserRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

@Service
public class CheckoutService {
  private final TeamRepository teamRepository;
  private final UserRepository userRepository;

  public CheckoutService(TeamRepository teamRepository, UserRepository userRepository) {
    this.teamRepository = teamRepository;
    this.userRepository = userRepository;
  }

  public String createCheckoutSession(@RequestBody PaymentDTO data, User user) throws StripeException {
    Product product = this.getProduct(data);

    SessionCreateParams params = SessionCreateParams.builder()
        .setMode(SessionCreateParams.Mode.PAYMENT)
        .setSuccessUrl("http://localhost:3000/payments/success")
        .setCancelUrl("http://localhost:3000/payments/cancel")
        .setCustomerEmail(user.getEmail())
        .setPaymentIntentData(
            SessionCreateParams.PaymentIntentData.builder()
                .putMetadata("userId", user.getId().toString())
                .putMetadata("paymentType", data.getType().toString())
                .putMetadata("id", product.getId())
                .putMetadata("productName", product.getName())
                .build())
        .addLineItem(
            SessionCreateParams.LineItem.builder()
                .setQuantity(1L)
                .setPriceData(
                    SessionCreateParams.LineItem.PriceData.builder()
                        .setCurrency(product.getCurrency())
                        .setUnitAmount(product.getPrice())
                        .setProductData(
                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                .setName(product.getName())
                                .build())
                        .build())
                .build())
        .build();

    Session session = Session.create(params);
    return session.getId();
  }
  
  private Product getProduct(PaymentDTO data) {
    if (data.getType() == PaymentType.UPGRADE_TEAM) {
      Optional<Team> teamOptional = this.teamRepository.findById(UUID.fromString(data.getId()));
      Team team = teamOptional.orElseThrow(() ->
            new RuntimeException("Team not found")
        );

        return new Product(
            team.getId().toString(),
            "Upgrade team: " + team.getName(),
            1000L,
            "usd"
        );
      } else if (data.getType() == PaymentType.UPGRADE_USER) {
        Optional<User> userOptional = this.userRepository.findById(UUID.fromString(data.getId()));
        User user = userOptional.orElseThrow(() -> new RuntimeException("User not found"));

        return new Product(
            user.getId().toString(),
            "Upgrade user: " + user.getUsername(),
            2000L,
            "usd"
        );
      }
      throw new RuntimeException("Invalid payment type");
  }
}
