package com.sts.sarvamtalent.contact;

import java.time.LocalDateTime;

public record ContactMessageResponse(
    Long id,
    String name,
    String email,
    String phone,
    String message,
    LocalDateTime createdAt) {

  public static ContactMessageResponse from(ContactMessage contactMessage) {
    return new ContactMessageResponse(
        contactMessage.getId(),
        contactMessage.getName(),
        contactMessage.getEmail(),
        contactMessage.getPhone(),
        contactMessage.getMessage(),
        contactMessage.getCreatedAt());
  }
}
