package pe.nuvitec.backend.security;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class JwtService {
    private static final Base64.Encoder ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder DECODER = Base64.getUrlDecoder();

    private final ObjectMapper objectMapper;
    private final String secret;
    private final long expirationMinutes;

    public JwtService(
            ObjectMapper objectMapper,
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-minutes}") long expirationMinutes) {
        this.objectMapper = objectMapper;
        this.secret = secret;
        this.expirationMinutes = expirationMinutes;
    }

    public String createToken(String email, String role) {
        try {
            var now = Instant.now();
            var header = Map.of("alg", "HS256", "typ", "JWT");
            var payload = Map.of(
                    "sub", email,
                    "role", role,
                    "iat", now.getEpochSecond(),
                    "exp", now.plusSeconds(expirationMinutes * 60).getEpochSecond());

            var encodedHeader = encodeJson(header);
            var encodedPayload = encodeJson(payload);
            var unsignedToken = encodedHeader + "." + encodedPayload;
            return unsignedToken + "." + sign(unsignedToken);
        } catch (Exception ex) {
            throw new IllegalStateException("No se pudo crear el token", ex);
        }
    }

    public String subject(String token) {
        try {
            var parts = token.split("\\.");
            if (parts.length != 3) {
                return null;
            }

            var unsignedToken = parts[0] + "." + parts[1];
            if (!constantTimeEquals(parts[2], sign(unsignedToken))) {
                return null;
            }

            var payload = objectMapper.readValue(
                    DECODER.decode(parts[1]),
                    new TypeReference<Map<String, Object>>() {
                    });
            var exp = ((Number) payload.get("exp")).longValue();
            if (Instant.now().getEpochSecond() >= exp) {
                return null;
            }

            return (String) payload.get("sub");
        } catch (Exception ex) {
            return null;
        }
    }

    private String encodeJson(Map<String, ?> value) throws Exception {
        return ENCODER.encodeToString(objectMapper.writeValueAsBytes(value));
    }

    private String sign(String value) throws Exception {
        var mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        return ENCODER.encodeToString(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
    }

    private boolean constantTimeEquals(String left, String right) {
        return MessageDigestUtil.equals(left.getBytes(StandardCharsets.UTF_8), right.getBytes(StandardCharsets.UTF_8));
    }
}
