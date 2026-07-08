package pe.nuvitec.backend.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ClientUserRequest(
        @NotBlank @Email @Size(max = 160) String email,
        @NotBlank @Size(max = 160) String fullName,
        @Size(max = 160) String company,
        @Size(max = 40) String phone,
        boolean enabled) {
}

