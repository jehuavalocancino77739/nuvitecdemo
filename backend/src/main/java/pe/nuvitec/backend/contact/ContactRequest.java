package pe.nuvitec.backend.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ContactRequest(
        @NotBlank String name,
        String company,
        @Email @NotBlank String email,
        String subject,
        @NotBlank String message) {
}
