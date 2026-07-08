package pe.nuvitec.backend.contact;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/contact")
public class ContactController {
    private final ContactRepository repository;

    public ContactController(ContactRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ContactResponse create(@Valid @RequestBody ContactRequest request) {
        repository.create(request);
        return new ContactResponse(
                true,
                "Solicitud recibida. Un asesor de Nuvitec se comunicará contigo pronto.");
    }
}
