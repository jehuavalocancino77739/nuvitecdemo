package pe.nuvitec.backend.auth;

public record LoginResponse(String token, String email, String role) {
}
