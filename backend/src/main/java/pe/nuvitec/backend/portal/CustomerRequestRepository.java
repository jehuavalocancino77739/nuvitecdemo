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
                        rs.getLong("id"),
                        rs.getString("request_code"),
                        rs.getString("title"),
                        rs.getString("description"),
                        rs.getString("service_type"),
                        rs.getString("status"),
                        rs.getTimestamp("created_at").toLocalDateTime(),
                        rs.getTimestamp("updated_at").toLocalDateTime()),
                email);
    }

    public long createForClient(String email, CreateCustomerRequest request) {
        return jdbcTemplate.queryForObject(
                "EXEC dbo.sp_customer_request_create ?, ?, ?, ?",
                Long.class,
                email,
                request.title().trim(),
                request.description().trim(),
                request.serviceType().trim());
    }

    public List<AdminCustomerRequest> findAllForAdmin() {
        return jdbcTemplate.query(
                "EXEC dbo.sp_admin_requests_list",
                (rs, rowNum) -> new AdminCustomerRequest(
                        rs.getLong("id"),
                        rs.getString("request_code"),
                        rs.getString("title"),
                        rs.getString("description"),
                        rs.getString("service_type"),
                        rs.getString("status"),
                        rs.getTimestamp("created_at").toLocalDateTime(),
                        rs.getTimestamp("updated_at").toLocalDateTime(),
                        rs.getLong("user_id"),
                        rs.getString("full_name"),
                        rs.getString("email"),
                        rs.getString("company"),
                        rs.getString("phone")));
    }

    public long createForAdmin(AdminRequestPayload request) {
        return jdbcTemplate.queryForObject(
                "EXEC dbo.sp_admin_request_create ?, ?, ?, ?, ?",
                Long.class,
                request.userId(),
                request.title().trim(),
                request.description().trim(),
                request.serviceType().trim(),
                request.status().trim());
    }

    public void update(long id, AdminRequestPayload request) {
        jdbcTemplate.update(
                "EXEC dbo.sp_admin_request_update ?, ?, ?, ?, ?, ?",
                id,
                request.userId(),
                request.title().trim(),
                request.description().trim(),
                request.serviceType().trim(),
                request.status().trim());
    }

    public void delete(long id) {
        jdbcTemplate.update("EXEC dbo.sp_admin_request_delete ?", id);
    }
}
