package pe.nuvitec.backend.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import pe.nuvitec.backend.security.JwtService;
import pe.nuvitec.backend.user.ClientUserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final ClientUserRepository userRepository;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            ClientUserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        var role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_CLIENT")
                .replace("ROLE_", "");

        return new LoginResponse(jwtService.createToken(request.email(), role), request.email(), role);
    }

    @PostMapping("/register")
    public RegistrationResponse register(@Valid @RequestBody RegisterRequest request) {
        var id = userRepository.create(
                request.email(),
                request.password(),
                request.fullName(),
                request.company(),
                request.phone());
        return new RegistrationResponse(id, "Cuenta creada correctamente.");
    }
}
