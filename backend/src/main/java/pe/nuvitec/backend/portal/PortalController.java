package pe.nuvitec.backend.portal;

import java.security.Principal;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
@RestController
@RequestMapping("/api/portal")
public class PortalController {
    private final CustomerRequestRepository repository;

    public PortalController(CustomerRequestRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/requests")
    public java.util.List<CustomerRequest> requests(Principal principal) {
        return repository.findByEmail(principal.getName());
    }

    @PostMapping("/requests")
    @ResponseStatus(HttpStatus.CREATED)
    public CreatedRequest create(
            Principal principal,
            @Valid @RequestBody CreateCustomerRequest request) {
        return new CreatedRequest(repository.createForClient(principal.getName(), request));
    }

    public record CreatedRequest(long id) {
    }
}
