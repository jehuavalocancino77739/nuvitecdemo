package pe.nuvitec.backend.portal;

import java.security.Principal;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
