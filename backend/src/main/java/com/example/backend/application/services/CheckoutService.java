package com.example.backend.application.services;

import com.example.backend.domain.dtos.PaymentDTO;
import com.example.backend.domain.dtos.payments.PaymentType;
import com.example.backend.domain.dtos.payments.Product;
import com.example.backend.domain.entities.Team;
import com.example.backend.domain.entities.User;
import com.example.backend.exceptions.payments.InvalidPaymentTypeException;
import com.example.backend.exceptions.payments.MetadataException;
import com.example.backend.exceptions.teams.TeamNotFoundException;
import com.example.backend.exceptions.users.UserNotFoundException;
import com.example.backend.infrastructure.TeamRepository;
import com.example.backend.infrastructure.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;
import java.util.UUID;

@Service
public class CheckoutService {
    @Value("${FRONTEND_URL}")
    private String frontendUrl;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    public CheckoutService(TeamRepository teamRepository, UserRepository userRepository) {
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
    }

    public String createCheckoutSession(@RequestBody PaymentDTO data, User user) throws StripeException, TeamNotFoundException, UserNotFoundException, InvalidPaymentTypeException {
        Product product = this.getProduct(data);

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(frontendUrl + "/payments/success")
                .setCancelUrl(frontendUrl + "/payments/cancel")
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

    private Product getProduct(PaymentDTO data) throws TeamNotFoundException, UserNotFoundException, InvalidPaymentTypeException {
        if (data.getType() == PaymentType.UPGRADE_TEAM) {
            Optional<Team> teamOptional = this.teamRepository.findById(UUID.fromString(data.getId()));
            Team team = teamOptional.orElseThrow(TeamNotFoundException::new);

            return new Product(
                    team.getId().toString(),
                    "Upgrade team: " + team.getName(),
                    1000L,
                    "usd");
        } else if (data.getType() == PaymentType.UPGRADE_USER) {
            Optional<User> userOptional = this.userRepository.findById(UUID.fromString(data.getId()));
            User user = userOptional.orElseThrow(UserNotFoundException::new);

            return new Product(
                    user.getId().toString(),
                    "Upgrade user: " + user.getUsername(),
                    2000L,
                    "usd");
        }
        throw new InvalidPaymentTypeException();
    }

    public void handlePaymentIntentSucceeded(Event event) throws TeamNotFoundException, UserNotFoundException, JsonProcessingException, MetadataException {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode eventJson = mapper.readTree(event.toJson());

        JsonNode metadataNode = eventJson.path("data").path("object").path("metadata");
        if (metadataNode.isMissingNode()) {
            throw new MetadataException("Metadata not found in event JSON");
        }

        PaymentType paymentType = PaymentType.valueOf(metadataNode.path("paymentType").asText(null));
        String id = metadataNode.path("id").asText(null);


        if (paymentType == PaymentType.UPGRADE_TEAM) {
            Optional<Team> teamOptional = this.teamRepository.findById(UUID.fromString(id));
            Team team = teamOptional.orElseThrow(TeamNotFoundException::new);
            team.setIsUpgraded(true);
            teamRepository.save(team);
        } else if (paymentType == PaymentType.UPGRADE_USER) {
            Optional<User> userOptional = this.userRepository.findById(UUID.fromString(id));
            User user = userOptional.orElseThrow(UserNotFoundException::new);
            user.setIsPremium(true);
            userRepository.save(user);
        }
    }
}
