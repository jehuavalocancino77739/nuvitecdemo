package pe.nuvitec.backend.portal;

import java.time.LocalDateTime;

public record AdminCustomerRequest(
        long id,
        String code,
        String title,
        String description,
        String serviceType,
        String status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        long userId,
        String clientName,
        String clientEmail,
        String company,
        String phone) {
}

