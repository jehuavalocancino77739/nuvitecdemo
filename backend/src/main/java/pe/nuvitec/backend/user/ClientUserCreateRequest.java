package pe.nuvitec.backend.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ClientUserCreateRequest(
        @NotBlank @Email @Size(max = 160) String email,
        @NotBlank @Size(min = 8, max = 72) String password,
        @NotBlank @Size(max = 160) String fullName,
        @Size(max = 160) String company,
        @Size(max = 40) String phone) {
}

