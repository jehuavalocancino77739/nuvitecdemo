package pe.nuvitec.backend.chat;

import org.springframework.stereotype.Service;

@Service
public class FaqChatService {
    public String reply(String message) {
        var normalized = normalize(message);

        if (containsAny(normalized, "hola", "buenos dias", "buenas tardes", "buenas noches", "informacion")) {
            return "Hola, gracias por comunicarte con Nuvitec. Puedo ayudarte con servicios, horarios, presupuestos, soporte técnico, cámaras, logística, construcción y soluciones TI.";
        }

        if (containsAny(normalized, "horario", "atienden", "abren", "cierran", "hora")) {
            return "Atendemos de lunes a sábado de 08:00 a 18:00. Para emergencias o soporte remoto, indícanos tu caso y un asesor revisará la disponibilidad.";
        }

        if (containsAny(normalized, "telefono", "celular", "llamar", "whatsapp", "numero", "contacto")) {
            return "Puedes comunicarte con Nuvitec por WhatsApp o llamada al 970 982 915 y al 994 152 707.";
        }

        if (containsAny(normalized, "correo", "email", "mail")) {
            return "Puedes escribirnos a informes@nuvitecsac.pe o ventas@nuvitecsac.pe. También puedes dejar tus datos en el formulario de contacto.";
        }

        if (containsAny(normalized, "direccion", "ubicacion", "donde estan", "oficina", "local")) {
            return "Nuestra oficina central está en Av. 2 de mayo nro. 647, Urb. Nueva Esperanza - Lima 35. También contamos con oficina de operaciones en Av. Pedro Silva 830-984, Lima 29.";
        }

        if (containsAny(normalized, "presupuesto", "cotizacion", "cotizar", "precio", "costo", "cuanto cuesta")) {
            return "Para preparar un presupuesto necesitamos tu nombre, empresa, ubicación, teléfono y una breve descripción del servicio que necesitas. Puedes enviarlo por el formulario o por WhatsApp.";
        }

        if (containsAny(normalized, "servicio", "servicios", "que hacen", "ofrecen")) {
            return "Brindamos soporte técnico, construcción y pavimentaciones, distribución eléctrica, apoyo logístico y transporte, soluciones TI, seguridad y cámaras.";
        }

        if (containsAny(normalized, "soporte", "computadora", "red", "servidor", "sistema", "tecnico", "impresora", "internet")) {
            return "Nuestro soporte técnico atiende equipos, redes, servidores, sistemas e infraestructura tecnológica. Podemos revisar incidencias presenciales o remotas según el caso.";
        }

        if (containsAny(normalized, "ti", "tecnologia", "software", "infraestructura", "sistemas", "redes")) {
            return "En soluciones TI implementamos soporte, redes, infraestructura tecnológica, sistemas empresariales, mantenimiento y continuidad operativa.";
        }

        if (containsAny(normalized, "camara", "camaras", "seguridad", "videovigilancia", "alarma")) {
            return "Implementamos sistemas de seguridad electrónica, cámaras de videovigilancia y soluciones para proteger empresas, locales y hogares.";
        }

        if (containsAny(normalized, "construccion", "obra", "pavimento", "pavimentacion", "civil", "estructura")) {
            return "Realizamos proyectos de construcción, pavimentaciones e infraestructura civil con supervisión técnica, seguridad y control de calidad.";
        }

        if (containsAny(normalized, "electric", "electrica", "energia", "tablero", "cableado")) {
            return "Brindamos soluciones de distribución eléctrica, cableado, tableros y mantenimiento eléctrico para hogares, empresas e industrias.";
        }

        if (containsAny(normalized, "logistica", "transporte", "traslado", "carga", "envio")) {
            return "Ofrecemos apoyo logístico y transporte seguro para personal, materiales y operaciones empresariales a nivel local y nacional.";
        }

        if (containsAny(normalized, "lima", "provincia", "nacional", "cobertura", "atienden en")) {
            return "Atendemos principalmente en Lima y también podemos evaluar servicios a nivel nacional según el tipo de proyecto o soporte requerido.";
        }

        if (containsAny(normalized, "visita", "evaluacion", "reunion", "inspeccion")) {
            return "Puedes solicitar una visita técnica o evaluación. Indícanos tu ubicación, disponibilidad y el servicio requerido para coordinar la atención.";
        }

        if (containsAny(normalized, "cliente", "portal", "login", "cuenta", "entrar")) {
            return "El portal de clientes permite revisar solicitudes, presupuestos y estados de atención. Usa el botón Clientes en la parte superior para ingresar.";
        }

        if (containsAny(normalized, "gracias", "ok", "listo")) {
            return "Gracias a ti. Si deseas, déjanos tu teléfono y el servicio que necesitas para que un asesor de Nuvitec te contacte.";
        }

        return "Puedo ayudarte con horarios, teléfonos, ubicación, servicios, presupuestos, soporte técnico, soluciones TI, cámaras, construcción, electricidad y logística. Cuéntame qué necesitas.";
    }

    private boolean containsAny(String value, String... words) {
        for (var word : words) {
            if (value.contains(word)) {
                return true;
            }
        }
        return false;
    }

    private String normalize(String value) {
        return value == null ? "" : value.toLowerCase()
                .replace("á", "a")
                .replace("é", "e")
                .replace("í", "i")
                .replace("ó", "o")
                .replace("ú", "u")
                .replace("ñ", "n");
    }
}
