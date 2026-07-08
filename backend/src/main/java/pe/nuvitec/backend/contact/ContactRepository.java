package pe.nuvitec.backend.contact;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ContactRepository {
    private final JdbcTemplate jdbcTemplate;

    public ContactRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public long create(ContactRequest request) {
        return jdbcTemplate.queryForObject(
                "EXEC dbo.sp_contact_create ?, ?, ?, ?, ?",
                Long.class,
                request.name(),
                request.company(),
                request.email(),
                request.subject(),
                request.message());
    }
}
