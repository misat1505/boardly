package com.example.backend.domain.dtos;

import java.util.UUID;

public class InviteUserToTeamDTO {
  private UUID userId;

  public UUID getUserId() {
    return userId;
  }

  public void setUserId(UUID userId) {
    this.userId = userId;
  }
}
