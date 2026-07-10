package pe.nuvitec.backend.contact;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ContactStatusRequest(
        @NotBlank @Pattern(regexp = "Nuevo|Leido|Atendido") String status) {
}
