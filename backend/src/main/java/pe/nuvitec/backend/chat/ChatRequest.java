package pe.nuvitec.backend.chat;

import jakarta.validation.constraints.NotBlank;

public record ChatRequest(@NotBlank String message) {
}
