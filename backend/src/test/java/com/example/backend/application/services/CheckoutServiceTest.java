package com.example.backend.application.services;

import com.example.backend.domain.dtos.PaymentDTO;
import com.example.backend.domain.dtos.payments.PaymentType;
import com.example.backend.domain.entities.Team;
import com.example.backend.domain.entities.User;
import com.example.backend.exceptions.payments.InvalidPaymentTypeException;
import com.example.backend.exceptions.payments.MetadataException;
import com.example.backend.exceptions.teams.TeamNotFoundException;
import com.example.backend.exceptions.users.UserNotFoundException;
import com.example.backend.infrastructure.TeamRepository;
import com.example.backend.infrastructure.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CheckoutServiceTest {

    @Mock
    private TeamRepository teamRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CheckoutService checkoutService;

    @Captor
    private ArgumentCaptor<Team> teamCaptor;

    @Captor
    private ArgumentCaptor<User> userCaptor;

    private final String frontendUrl = "https://frontend.com";

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        checkoutService = new CheckoutService(teamRepository, userRepository, frontendUrl);
    }

    @Test
    void createCheckoutSession_upgradeTeam_success()
            throws StripeException, UserNotFoundException, TeamNotFoundException, InvalidPaymentTypeException {
        UUID teamId = UUID.randomUUID();
        User user = new User();
        user.setEmail("test@example.com");
        user.setId(UUID.randomUUID());

        Team team = new Team();
        team.setId(teamId);
        team.setName("My Team");

        PaymentDTO dto = new PaymentDTO();
        dto.setType(PaymentType.UPGRADE_TEAM);
        dto.setId(teamId.toString());

        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team));

        // Stripe creates real sessions; mock it to avoid real API calls
        Session mockSession = mock(Session.class);
        when(mockSession.getId()).thenReturn("mock-session-id");

        try (MockedStatic<Session> mocked = mockStatic(Session.class)) {
            mocked.when(() -> Session.create(any(SessionCreateParams.class))).thenReturn(mockSession);

            String sessionId = checkoutService.createCheckoutSession(dto, user);
            assertEquals("mock-session-id", sessionId);
        }
    }

    @Test
    void createCheckoutSession_upgradeUser_success() throws StripeException,
            UserNotFoundException, TeamNotFoundException, InvalidPaymentTypeException {
        UUID userId = UUID.randomUUID();
        User user = new User();
        user.setId(userId);
        user.setEmail("test@example.com");
        user.setUsername("myuser");

        PaymentDTO dto = new PaymentDTO();
        dto.setType(PaymentType.UPGRADE_USER);
        dto.setId(userId.toString());

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        Session mockSession = mock(Session.class);
        when(mockSession.getId()).thenReturn("mock-session-id");

        try (MockedStatic<Session> mocked = mockStatic(Session.class)) {
            mocked.when(() -> Session.create(any(SessionCreateParams.class))).thenReturn(mockSession);

            String sessionId = checkoutService.createCheckoutSession(dto, user);
            assertEquals("mock-session-id", sessionId);
        }
    }

    @Test
    void handlePaymentIntentSucceeded_upgradeTeam_success()
            throws JsonProcessingException, TeamNotFoundException, UserNotFoundException, MetadataException {
        UUID teamId = UUID.randomUUID();
        Team team = new Team();
        team.setId(teamId);
        team.setIsUpgraded(false);

        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team));

        String eventJson = """
                {
                  "data": {
                    "object": {
                      "metadata": {
                        "paymentType": "UPGRADE_TEAM",
                        "id": "%s"
                      }
                    }
                  }
                }
                """.formatted(teamId);

        Event event = mock(Event.class);
        when(event.toJson()).thenReturn(eventJson);

        checkoutService.handlePaymentIntentSucceeded(event);

        verify(teamRepository).save(teamCaptor.capture());
        assertTrue(teamCaptor.getValue().getIsUpgraded());
    }

    @Test
    void handlePaymentIntentSucceeded_upgradeUser_success()
            throws JsonProcessingException, TeamNotFoundException, UserNotFoundException, MetadataException {
        UUID userId = UUID.randomUUID();
        User user = new User();
        user.setId(userId);
        user.setIsPremium(false);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        String eventJson = """
                {
                  "data": {
                    "object": {
                      "metadata": {
                        "paymentType": "UPGRADE_USER",
                        "id": "%s"
                      }
                    }
                  }
                }
                """.formatted(userId);

        Event event = mock(Event.class);
        when(event.toJson()).thenReturn(eventJson);

        checkoutService.handlePaymentIntentSucceeded(event);

        verify(userRepository).save(userCaptor.capture());
        assertTrue(userCaptor.getValue().getIsPremium());
    }

    @Test
    void createCheckoutSession_invalidType_throws() {
        PaymentDTO dto = new PaymentDTO();
        dto.setType(null); // Invalid type
        dto.setId(UUID.randomUUID().toString());

        assertThrows(InvalidPaymentTypeException.class, () ->
                checkoutService.createCheckoutSession(dto, new User()));
    }

    @Test
    void handlePaymentIntentSucceeded_missingMetadata_throws() throws JsonProcessingException {
        String eventJson = """
                {
                  "data": {
                    "object": {
                      "not_metadata": {}
                    }
                  }
                }
                """;

        Event event = mock(Event.class);
        when(event.toJson()).thenReturn(eventJson);

        assertThrows(MetadataException.class, () -> checkoutService.handlePaymentIntentSucceeded(event));
    }
}

