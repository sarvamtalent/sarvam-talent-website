package com.sts.sarvamtalent.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactMessageRequest(
    @NotBlank @Size(max = 100) String name,
    @NotBlank @Email @Size(max = 150) String email,
    @Size(max = 20) String phone,
    @NotBlank String message) {
}
