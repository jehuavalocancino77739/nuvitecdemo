# Nuvitec.pe

Proyecto base para rehacer la pagina de Nuvitec.pe con Angular y Spring Boot.

## Estructura

- `frontend`: aplicacion Angular con la pagina principal, chatbot visual y acceso de clientes.
- `backend`: API Spring Boot con Maven Wrapper para login, chatbot, contacto y portal de clientes.

## Ejecutar Angular

```bash
cd frontend
npm install
npm start
```

URL local: `http://127.0.0.1:4200`

## Ejecutar Spring Boot

```bash
cd backend
./mvnw spring-boot:run
```

En Windows:

```bash
cd backend
mvnw.cmd spring-boot:run
```

URL local: `http://127.0.0.1:8080`

## Base de datos SQL Server

La API usa SQL Server 2022 en la instancia `.\SQLEXPRESS` y la base `NuvitecPeDb`.

Para crear o recrear la base:

```bash
cd backend
sqlcmd -S .\SQLEXPRESS -E -f 65001 -v NUVITEC_DB_PASSWORD="tu_clave_segura" -i database\01-create-nuvitec-db.sql
```

El script crea:

- Base de datos `NuvitecPeDb`
- Tablas `app_users`, `customer_requests`, `contact_messages`
- Procedimientos `sp_auth_get_user_by_email`, `sp_customer_requests_by_email`, `sp_contact_create`
- Login SQL Server `nuvitec_app`

## Usuario demo

- Correo: `cliente@nuvitec.pe`
- Contrasena: `Nuvitec2026`

## Endpoints iniciales

- `POST /api/auth/login`
- `POST /api/chat`
- `POST /api/contact`
- `GET /api/portal/requests` con `Authorization: Bearer <token>`

## Chatbot con API de IA

El backend está preparado para llamar a la API de OpenAI Responses.

Configura tu API key antes de iniciar Spring:

```bash
set OPENAI_API_KEY=tu_api_key
mvnw.cmd spring-boot:run
```

También puedes cambiar el modelo:

```bash
set OPENAI_MODEL=gpt-4o-mini
```

Si no configuras `OPENAI_API_KEY` o la cuenta no tiene cuota, el chatbot responde con una base local de preguntas frecuentes sobre horarios, servicios, contacto, presupuesto, soporte técnico, soluciones TI, cámaras, construcción, electricidad, logística, cobertura y portal de clientes.

## Siguiente paso recomendado

Crear pantallas de administración para registrar clientes, solicitudes y mensajes de contacto.
