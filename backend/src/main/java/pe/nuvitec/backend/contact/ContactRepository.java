package pe.nuvitec.backend.contact;

import java.util.List;

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

    public List<ContactMessage> findAll() {
        return jdbcTemplate.query(
                "EXEC dbo.sp_contact_messages_list",
                (rs, rowNum) -> new ContactMessage(
                        rs.getLong("id"),
                        rs.getString("name"),
                        rs.getString("company"),
                        rs.getString("email"),
                        rs.getString("subject"),
                        rs.getString("message"),
                        rs.getTimestamp("created_at").toLocalDateTime()));
    }
}
