package pe.nuvitec.backend.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import pe.nuvitec.backend.contact.ContactRequest;
import pe.nuvitec.backend.portal.CreateCustomerRequest;

@Service
public class NotificationService {
    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final boolean enabled;
    private final String recipient;
    private final String sender;

    public NotificationService(
            ObjectProvider<JavaMailSender> mailSenderProvider,
            @Value("${app.notifications.enabled:false}") boolean enabled,
            @Value("${app.notifications.to:}") String recipient,
            @Value("${app.notifications.from:no-reply@nuvitec.pe}") String sender) {
        this.mailSenderProvider = mailSenderProvider;
        this.enabled = enabled;
        this.recipient = recipient;
        this.sender = sender;
    }

    public void contactReceived(long id, ContactRequest request) {
        send(
                "Nuevo mensaje web Nuvitec #" + id,
                """
                Se recibio un nuevo mensaje desde la pagina web.

                Nombre: %s
                Empresa: %s
                Correo: %s
                Servicio: %s

                Mensaje:
                %s
                """.formatted(
                        request.name(),
                        blankAsDash(request.company()),
                        request.email(),
                        blankAsDash(request.subject()),
                        request.message()));
    }

    public void customerRequestReceived(long id, String customerEmail, CreateCustomerRequest request) {
        send(
                "Nueva solicitud de cliente Nuvitec #" + id,
                """
                Se registro una nueva solicitud desde el portal de clientes.

                Cliente: %s
                Servicio: %s
                Asunto: %s

                Descripcion:
                %s
                """.formatted(
                        customerEmail,
                        request.serviceType(),
                        request.title(),
                        request.description()));
    }

    private void send(String subject, String body) {
        if (!enabled) {
            log.info("Email notifications disabled. Subject: {}", subject);
            return;
        }

        if (recipient == null || recipient.isBlank()) {
            log.warn("Email notifications enabled but app.notifications.to is empty.");
            return;
        }

        var mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            log.warn("Email notifications enabled but JavaMailSender is not configured.");
            return;
        }

        try {
            var message = new SimpleMailMessage();
            message.setFrom(sender);
            message.setTo(recipient);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (RuntimeException ex) {
            log.warn("Email notification failed: {}", ex.getMessage());
        }
    }

    private String blankAsDash(String value) {
        return value == null || value.isBlank() ? "-" : value;
    }
}
