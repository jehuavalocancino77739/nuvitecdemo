package pe.nuvitec.backend.admin;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import pe.nuvitec.backend.contact.ContactMessage;
import pe.nuvitec.backend.contact.ContactRepository;
import pe.nuvitec.backend.portal.AdminCustomerRequest;
import pe.nuvitec.backend.portal.AdminRequestPayload;
import pe.nuvitec.backend.portal.CustomerRequestRepository;
import pe.nuvitec.backend.user.ClientUser;
import pe.nuvitec.backend.user.ClientUserCreateRequest;
import pe.nuvitec.backend.user.ClientUserRepository;
import pe.nuvitec.backend.user.ClientUserRequest;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final ClientUserRepository userRepository;
    private final CustomerRequestRepository requestRepository;
    private final ContactRepository contactRepository;

    public AdminController(
            ClientUserRepository userRepository,
            CustomerRequestRepository requestRepository,
            ContactRepository contactRepository) {
        this.userRepository = userRepository;
        this.requestRepository = requestRepository;
        this.contactRepository = contactRepository;
    }

    @GetMapping("/clients")
    public List<ClientUser> clients() {
        return userRepository.findAll();
    }

    @PostMapping("/clients")
    @ResponseStatus(HttpStatus.CREATED)
    public ClientUserCreated createClient(@Valid @RequestBody ClientUserCreateRequest request) {
        var id = userRepository.create(
                request.email(), request.password(), request.fullName(), request.company(), request.phone());
        return new ClientUserCreated(id);
    }

    @PutMapping("/clients/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateClient(@PathVariable long id, @Valid @RequestBody ClientUserRequest request) {
        userRepository.update(id, request);
    }

    @DeleteMapping("/clients/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteClient(@PathVariable long id) {
        userRepository.delete(id);
    }

    @GetMapping("/requests")
    public List<AdminCustomerRequest> requests() {
        return requestRepository.findAllForAdmin();
    }

    @GetMapping("/messages")
    public List<ContactMessage> messages() {
        return contactRepository.findAll();
    }

    @PostMapping("/requests")
    @ResponseStatus(HttpStatus.CREATED)
    public RequestCreated createRequest(@Valid @RequestBody AdminRequestPayload request) {
        return new RequestCreated(requestRepository.createForAdmin(request));
    }

    @PutMapping("/requests/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateRequest(@PathVariable long id, @Valid @RequestBody AdminRequestPayload request) {
        requestRepository.update(id, request);
    }

    @DeleteMapping("/requests/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRequest(@PathVariable long id) {
        requestRepository.delete(id);
    }

    public record ClientUserCreated(long id) {
    }

    public record RequestCreated(long id) {
    }
}
