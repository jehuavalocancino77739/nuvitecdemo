package pe.nuvitec.backend.portal;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class CustomerRequestRepository {
    private final JdbcTemplate jdbcTemplate;

    public CustomerRequestRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<CustomerRequest> findByEmail(String email) {
        return jdbcTemplate.query(
                "EXEC dbo.sp_customer_requests_by_email ?",
                (rs, rowNum) -> new CustomerRequest(
                        rs.getString("request_code"),
                        rs.getString("title"),
                        rs.getString("status")),
                email);
    }
}
