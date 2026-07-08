package pe.nuvitec.backend.chat;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;

@Service
public class OpenAiChatService implements ChatService {
    private static final Logger LOGGER = LoggerFactory.getLogger(OpenAiChatService.class);

    private final RestClient restClient;
    private final FaqChatService faqChatService;
    private final String apiKey;
    private final String model;
    private final String responsesUrl;

    public OpenAiChatService(
            RestClient.Builder restClientBuilder,
            FaqChatService faqChatService,
            @Value("${openai.api-key}") String apiKey,
            @Value("${openai.model}") String model,
            @Value("${openai.responses-url}") String responsesUrl) {
        this.restClient = restClientBuilder.build();
        this.faqChatService = faqChatService;
        this.apiKey = apiKey;
        this.model = model;
        this.responsesUrl = responsesUrl;
    }

    @Override
    public String reply(String message) {
        if (apiKey == null || apiKey.isBlank()) {
            return faqChatService.reply(message);
        }

        var request = Map.of(
                "model", model,
                "input", List.of(
                        Map.of(
                                "role", "system",
                                "content", "Eres el asistente virtual de Nuvitec.pe. Responde en español, breve y orientado a ventas. Servicios: soporte técnico, construcción, pavimentaciones, distribución eléctrica, logística, soluciones TI, seguridad y cámaras. Teléfonos: 970 982 915 y 994 152 707. Horario: lunes a sábado de 08:00 a 18:00."),
                        Map.of("role", "user", "content", message)));

        try {
            var response = restClient.post()
                    .uri(responsesUrl)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(JsonNode.class);

            return extractText(response);
        } catch (Exception ex) {
            LOGGER.warn("OpenAI chatbot request failed: {}", ex.getMessage());
            return faqChatService.reply(message);
        }
    }

    private String extractText(JsonNode response) {
        if (response == null) {
            return "No se recibió respuesta de la API de IA.";
        }

        var outputText = response.get("output_text");
        if (outputText != null && outputText.isTextual()) {
            return outputText.asText();
        }

        var output = response.path("output");
        if (output.isArray()) {
            for (var item : output) {
                var content = item.path("content");
                if (content.isArray()) {
                    for (var contentItem : content) {
                        var text = contentItem.path("text");
                        if (text.isTextual()) {
                            return text.asText();
                        }
                    }
                }
            }
        }

        return "Gracias por escribirnos. Un asesor de Nuvitec puede revisar tu consulta.";
    }

}
