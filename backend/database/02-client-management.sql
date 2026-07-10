USE NuvitecPeDb;
GO

IF COL_LENGTH('dbo.app_users', 'company') IS NULL
    ALTER TABLE dbo.app_users ADD company NVARCHAR(160) NULL;
IF COL_LENGTH('dbo.app_users', 'phone') IS NULL
    ALTER TABLE dbo.app_users ADD phone NVARCHAR(40) NULL;
IF COL_LENGTH('dbo.customer_requests', 'description') IS NULL
    ALTER TABLE dbo.customer_requests ADD description NVARCHAR(MAX) NULL;
IF COL_LENGTH('dbo.customer_requests', 'service_type') IS NULL
    ALTER TABLE dbo.customer_requests ADD service_type NVARCHAR(120) NULL;
IF COL_LENGTH('dbo.customer_requests', 'updated_at') IS NULL
    ALTER TABLE dbo.customer_requests ADD updated_at DATETIME2 NULL;
GO

UPDATE dbo.customer_requests
SET
    description = COALESCE(description, title),
    service_type = COALESCE(service_type, N'Servicio general'),
    updated_at = COALESCE(updated_at, created_at);
GO

CREATE OR ALTER PROCEDURE dbo.sp_user_create
    @email NVARCHAR(160),
    @password_hash NVARCHAR(120),
    @full_name NVARCHAR(160),
    @company NVARCHAR(160) = NULL,
    @phone NVARCHAR(40) = NULL,
    @role_name NVARCHAR(40) = N'CLIENT'
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM dbo.app_users WHERE LOWER(email) = LOWER(@email))
        THROW 50001, 'El correo ya se encuentra registrado.', 1;

    INSERT INTO dbo.app_users (email, password_hash, full_name, company, phone, role_name, enabled)
    VALUES (LOWER(@email), @password_hash, @full_name, @company, @phone, @role_name, 1);

    SELECT CAST(SCOPE_IDENTITY() AS BIGINT) AS id;
END
GO

CREATE OR ALTER PROCEDURE dbo.sp_users_list
AS
BEGIN
    SET NOCOUNT ON;

    SELECT id, email, full_name, company, phone, role_name, enabled, created_at
    FROM dbo.app_users
    WHERE role_name = N'CLIENT'
    ORDER BY created_at DESC;
END
GO

CREATE OR ALTER PROCEDURE dbo.sp_user_update
    @id BIGINT,
    @email NVARCHAR(160),
    @full_name NVARCHAR(160),
    @company NVARCHAR(160) = NULL,
    @phone NVARCHAR(40) = NULL,
    @enabled BIT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM dbo.app_users WHERE LOWER(email) = LOWER(@email) AND id <> @id)
        THROW 50001, 'El correo ya se encuentra registrado.', 1;

    UPDATE dbo.app_users
    SET email = LOWER(@email), full_name = @full_name, company = @company, phone = @phone, enabled = @enabled
    WHERE id = @id AND role_name = N'CLIENT';

    IF @@ROWCOUNT = 0
        THROW 50002, 'Cliente no encontrado.', 1;
END
GO

CREATE OR ALTER PROCEDURE dbo.sp_user_delete
    @id BIGINT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    DELETE FROM dbo.customer_requests WHERE user_id = @id;
    DELETE FROM dbo.app_users WHERE id = @id AND role_name = N'CLIENT';

    IF @@ROWCOUNT = 0
    BEGIN
        ROLLBACK TRANSACTION;
        THROW 50002, 'Cliente no encontrado.', 1;
    END

    COMMIT TRANSACTION;
END
GO

CREATE OR ALTER PROCEDURE dbo.sp_customer_requests_by_email
    @email NVARCHAR(160)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        cr.id,
        cr.request_code,
        cr.title,
        cr.description,
        cr.service_type,
        cr.status,
        cr.created_at,
        cr.updated_at
    FROM dbo.customer_requests cr
    INNER JOIN dbo.app_users au ON au.id = cr.user_id
    WHERE LOWER(au.email) = LOWER(@email)
    ORDER BY cr.created_at DESC;
END
GO

CREATE OR ALTER PROCEDURE dbo.sp_customer_request_create
    @email NVARCHAR(160),
    @title NVARCHAR(180),
    @description NVARCHAR(MAX),
    @service_type NVARCHAR(120)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @user_id BIGINT = (
        SELECT TOP 1 id FROM dbo.app_users
        WHERE LOWER(email) = LOWER(@email) AND role_name = N'CLIENT' AND enabled = 1
    );

    IF @user_id IS NULL
        THROW 50002, 'Cliente no encontrado o inactivo.', 1;

    INSERT INTO dbo.customer_requests
        (user_id, request_code, title, description, service_type, status, updated_at)
    VALUES
        (
            @user_id,
            CONCAT(N'T-', LEFT(REPLACE(CONVERT(NVARCHAR(36), NEWID()), N'-', N''), 28)),
            @title,
            @description,
            @service_type,
            N'Recibida',
            SYSUTCDATETIME()
        );

    DECLARE @id BIGINT = SCOPE_IDENTITY();
    UPDATE dbo.customer_requests
    SET request_code = CONCAT(N'NV-', RIGHT(CONCAT(N'000000', @id), 6))
    WHERE id = @id;

    SELECT @id AS id;
END
GO

CREATE OR ALTER PROCEDURE dbo.sp_admin_requests_list
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        cr.id,
        cr.request_code,
        cr.title,
        cr.description,
        cr.service_type,
        cr.status,
        cr.created_at,
        cr.updated_at,
        au.id AS user_id,
        au.full_name,
        au.email,
        au.company,
        au.phone
    FROM dbo.customer_requests cr
    INNER JOIN dbo.app_users au ON au.id = cr.user_id
    ORDER BY cr.created_at DESC;
END
GO

CREATE OR ALTER PROCEDURE dbo.sp_admin_request_create
    @user_id BIGINT,
    @title NVARCHAR(180),
    @description NVARCHAR(MAX),
    @service_type NVARCHAR(120),
    @status NVARCHAR(60)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM dbo.app_users WHERE id = @user_id AND role_name = N'CLIENT')
        THROW 50002, 'Cliente no encontrado.', 1;

    INSERT INTO dbo.customer_requests
        (user_id, request_code, title, description, service_type, status, updated_at)
    VALUES
        (
            @user_id,
            CONCAT(N'T-', LEFT(REPLACE(CONVERT(NVARCHAR(36), NEWID()), N'-', N''), 28)),
            @title,
            @description,
            @service_type,
            @status,
            SYSUTCDATETIME()
        );

    DECLARE @id BIGINT = SCOPE_IDENTITY();
    UPDATE dbo.customer_requests
    SET request_code = CONCAT(N'NV-', RIGHT(CONCAT(N'000000', @id), 6))
    WHERE id = @id;

    SELECT @id AS id;
END
GO

CREATE OR ALTER PROCEDURE dbo.sp_admin_request_update
    @id BIGINT,
    @user_id BIGINT,
    @title NVARCHAR(180),
    @description NVARCHAR(MAX),
    @service_type NVARCHAR(120),
    @status NVARCHAR(60)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.customer_requests
    SET
        user_id = @user_id,
        title = @title,
        description = @description,
        service_type = @service_type,
        status = @status,
        updated_at = SYSUTCDATETIME()
    WHERE id = @id;

    IF @@ROWCOUNT = 0
        THROW 50003, 'Solicitud no encontrada.', 1;
END
GO

CREATE OR ALTER PROCEDURE dbo.sp_admin_request_delete
    @id BIGINT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM dbo.customer_requests WHERE id = @id;

    IF @@ROWCOUNT = 0
        THROW 50003, 'Solicitud no encontrada.', 1;
END
GO

CREATE OR ALTER PROCEDURE dbo.sp_contact_messages_list
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        id,
        name,
        company,
        email,
        subject,
        message,
        created_at
    FROM dbo.contact_messages
    ORDER BY created_at DESC;
END
GO

DECLARE @demo_hash NVARCHAR(120) = N'$2a$10$F9yapFmqON1cl8dZsFcE..H1bmAN9AMHivl0pTp1YMd63IYgna1Gi';

IF NOT EXISTS (SELECT 1 FROM dbo.app_users WHERE email = N'admin@nuvitec.pe')
    INSERT INTO dbo.app_users (email, password_hash, full_name, company, phone, role_name, enabled)
    VALUES (N'admin@nuvitec.pe', @demo_hash, N'Administrador Nuvitec', N'Nuvitec', N'970 982 915', N'ADMIN', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.app_users WHERE email = N'operaciones@constructorasol.pe')
    INSERT INTO dbo.app_users (email, password_hash, full_name, company, phone, role_name, enabled)
    VALUES (N'operaciones@constructorasol.pe', @demo_hash, N'Carla Mendoza', N'Constructora Sol', N'987 654 321', N'CLIENT', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.app_users WHERE email = N'sistemas@comercialandina.pe')
    INSERT INTO dbo.app_users (email, password_hash, full_name, company, phone, role_name, enabled)
    VALUES (N'sistemas@comercialandina.pe', @demo_hash, N'Diego Salazar', N'Comercial Andina', N'986 123 456', N'CLIENT', 1);

DECLARE @client_one BIGINT = (SELECT id FROM dbo.app_users WHERE email = N'operaciones@constructorasol.pe');
DECLARE @client_two BIGINT = (SELECT id FROM dbo.app_users WHERE email = N'sistemas@comercialandina.pe');

IF NOT EXISTS (SELECT 1 FROM dbo.customer_requests WHERE request_code = N'NV-DEMO-01')
BEGIN
    INSERT INTO dbo.customer_requests
        (user_id, request_code, title, description, service_type, status, updated_at)
    VALUES
        (@client_one, N'NV-DEMO-01', N'Instalación de videovigilancia para almacén',
         N'Evaluación e instalación de ocho cámaras con acceso remoto.', N'Seguridad y cámaras',
         N'En revisión', SYSUTCDATETIME());
END

IF NOT EXISTS (SELECT 1 FROM dbo.customer_requests WHERE request_code = N'NV-DEMO-02')
BEGIN
    INSERT INTO dbo.customer_requests
        (user_id, request_code, title, description, service_type, status, updated_at)
    VALUES
        (@client_two, N'NV-DEMO-02', N'Mantenimiento preventivo de red',
         N'Revisión de switches, cableado estructurado y puntos de acceso.', N'Soluciones TI',
         N'Programada', SYSUTCDATETIME());
END
GO
