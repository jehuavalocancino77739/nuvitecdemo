package pe.nuvitec.backend.contact;

import java.time.LocalDateTime;

public record ContactMessage(
        long id,
        String name,
        String company,
        String email,
        String subject,
        String message,
        LocalDateTime createdAt) {
}
