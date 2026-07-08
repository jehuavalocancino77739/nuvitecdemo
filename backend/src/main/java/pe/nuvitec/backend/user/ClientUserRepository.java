package pe.nuvitec.backend.user;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

@Repository
public class ClientUserRepository {
    private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;

    public ClientUserRepository(JdbcTemplate jdbcTemplate, PasswordEncoder passwordEncoder) {
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    public long create(
            String email,
            String password,
            String fullName,
            String company,
            String phone) {
        return jdbcTemplate.queryForObject(
                "EXEC dbo.sp_user_create ?, ?, ?, ?, ?, ?",
                Long.class,
                email.trim(),
                passwordEncoder.encode(password),
                fullName.trim(),
                clean(company),
                clean(phone),
                "CLIENT");
    }

    public List<ClientUser> findAll() {
        return jdbcTemplate.query(
                "EXEC dbo.sp_users_list",
                (rs, rowNum) -> new ClientUser(
                        rs.getLong("id"),
                        rs.getString("email"),
                        rs.getString("full_name"),
                        rs.getString("company"),
                        rs.getString("phone"),
                        rs.getString("role_name"),
                        rs.getBoolean("enabled"),
                        rs.getTimestamp("created_at").toLocalDateTime()));
    }

    public void update(long id, ClientUserRequest request) {
        jdbcTemplate.update(
                "EXEC dbo.sp_user_update ?, ?, ?, ?, ?, ?",
                id,
                request.email().trim(),
                request.fullName().trim(),
                clean(request.company()),
                clean(request.phone()),
                request.enabled());
    }

    public void delete(long id) {
        jdbcTemplate.update("EXEC dbo.sp_user_delete ?", id);
    }

    private String clean(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}

