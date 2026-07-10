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
import pe.nuvitec.backend.notification.NotificationService;
@RestController
@RequestMapping("/api/portal")
public class PortalController {
    private final CustomerRequestRepository repository;
    private final NotificationService notificationService;

    public PortalController(CustomerRequestRepository repository, NotificationService notificationService) {
        this.repository = repository;
        this.notificationService = notificationService;
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
        var id = repository.createForClient(principal.getName(), request);
        notificationService.customerRequestReceived(id, principal.getName(), request);
        return new CreatedRequest(id);
    }

    public record CreatedRequest(long id) {
    }
}
