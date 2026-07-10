package pe.nuvitec.backend.contact;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import pe.nuvitec.backend.notification.NotificationService;

@RestController
@RequestMapping("/api/contact")
public class ContactController {
    private final ContactRepository repository;
    private final NotificationService notificationService;

    public ContactController(ContactRepository repository, NotificationService notificationService) {
        this.repository = repository;
        this.notificationService = notificationService;
    }

    @PostMapping
    public ContactResponse create(@Valid @RequestBody ContactRequest request) {
        var id = repository.create(request);
        notificationService.contactReceived(id, request);
        return new ContactResponse(
                true,
                "Solicitud recibida. Un asesor de Nuvitec se comunicara contigo pronto.");
    }
}
