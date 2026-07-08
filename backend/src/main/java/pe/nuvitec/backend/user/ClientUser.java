package pe.nuvitec.backend.user;

import java.time.LocalDateTime;

public record ClientUser(
        long id,
        String email,
        String fullName,
        String company,
        String phone,
        String role,
        boolean enabled,
        LocalDateTime createdAt) {
}

