package pe.nuvitec.backend.security;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class DatabaseUserDetailsService implements UserDetailsService {
    private final JdbcTemplate jdbcTemplate;

    public DatabaseUserDetailsService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        var users = jdbcTemplate.query(
                "EXEC dbo.sp_auth_get_user_by_email ?",
                (rs, rowNum) -> User.withUsername(rs.getString("email"))
                        .password(rs.getString("password_hash"))
                        .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + rs.getString("role_name"))))
                        .disabled(!rs.getBoolean("enabled"))
                        .build(),
                email);

        if (users.isEmpty()) {
            throw new UsernameNotFoundException("Usuario no encontrado: " + email);
        }

        return users.get(0);
    }
}
