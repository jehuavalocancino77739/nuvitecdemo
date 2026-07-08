package pe.nuvitec.backend.portal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record AdminRequestPayload(
        @Positive long userId,
        @NotBlank @Size(max = 180) String title,
        @NotBlank @Size(max = 4000) String description,
        @NotBlank @Size(max = 120) String serviceType,
        @NotBlank @Size(max = 60) String status) {
}

