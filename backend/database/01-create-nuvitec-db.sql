IF DB_ID(N'NuvitecPeDb') IS NULL
BEGIN
    CREATE DATABASE NuvitecPeDb;
END
GO

USE NuvitecPeDb;
GO

IF OBJECT_ID(N'dbo.customer_requests', N'U') IS NOT NULL DROP TABLE dbo.customer_requests;
IF OBJECT_ID(N'dbo.contact_messages', N'U') IS NOT NULL DROP TABLE dbo.contact_messages;
IF OBJECT_ID(N'dbo.app_users', N'U') IS NOT NULL DROP TABLE dbo.app_users;
GO

CREATE TABLE dbo.app_users (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(160) NOT NULL UNIQUE,
    password_hash NVARCHAR(120) NOT NULL,
    full_name NVARCHAR(160) NOT NULL,
    role_name NVARCHAR(40) NOT NULL,
    enabled BIT NOT NULL CONSTRAINT DF_app_users_enabled DEFAULT 1,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_app_users_created_at DEFAULT SYSUTCDATETIME()
);

CREATE TABLE dbo.customer_requests (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    request_code NVARCHAR(30) NOT NULL UNIQUE,
    title NVARCHAR(180) NOT NULL,
    status NVARCHAR(60) NOT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_customer_requests_created_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_customer_requests_user FOREIGN KEY (user_id) REFERENCES dbo.app_users(id)
);

CREATE TABLE dbo.contact_messages (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(140) NOT NULL,
    company NVARCHAR(140) NULL,
    email NVARCHAR(160) NOT NULL,
    subject NVARCHAR(180) NULL,
    message NVARCHAR(MAX) NOT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_contact_messages_created_at DEFAULT SYSUTCDATETIME()
);
GO

INSERT INTO dbo.app_users (email, password_hash, full_name, role_name, enabled)
VALUES (
    N'cliente@nuvitec.pe',
    N'$2a$10$F9yapFmqON1cl8dZsFcE..H1bmAN9AMHivl0pTp1YMd63IYgna1Gi',
    N'Cliente Nuvitec',
    N'CLIENT',
    1
);

DECLARE @user_id BIGINT = SCOPE_IDENTITY();

INSERT INTO dbo.customer_requests (user_id, request_code, title, status)
VALUES
    (@user_id, N'NV-001', N'Presupuesto de soporte técnico', N'En revisión'),
    (@user_id, N'NV-002', N'Instalación de cámaras', N'Programado'),
    (@user_id, N'NV-003', N'Mantenimiento de red empresarial', N'Atendido');
GO

CREATE OR ALTER PROCEDURE dbo.sp_auth_get_user_by_email
    @email NVARCHAR(160)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        id,
        email,
        password_hash,
        full_name,
        role_name,
        enabled
    FROM dbo.app_users
    WHERE email = @email;
END
GO

CREATE OR ALTER PROCEDURE dbo.sp_customer_requests_by_email
    @email NVARCHAR(160)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        cr.request_code,
        cr.title,
        cr.status
    FROM dbo.customer_requests cr
    INNER JOIN dbo.app_users au ON au.id = cr.user_id
    WHERE au.email = @email
    ORDER BY cr.created_at DESC;
END
GO

CREATE OR ALTER PROCEDURE dbo.sp_contact_create
    @name NVARCHAR(140),
    @company NVARCHAR(140) = NULL,
    @email NVARCHAR(160),
    @subject NVARCHAR(180) = NULL,
    @message NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.contact_messages (name, company, email, subject, message)
    VALUES (@name, @company, @email, @subject, @message);

    SELECT CAST(SCOPE_IDENTITY() AS BIGINT) AS id;
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'nuvitec_app')
BEGIN
    CREATE LOGIN nuvitec_app WITH PASSWORD = '$(NUVITEC_DB_PASSWORD)', CHECK_POLICY = ON;
END
GO

USE NuvitecPeDb;
GO

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'nuvitec_app')
BEGIN
    CREATE USER nuvitec_app FOR LOGIN nuvitec_app;
END
GO

ALTER ROLE db_datareader ADD MEMBER nuvitec_app;
ALTER ROLE db_datawriter ADD MEMBER nuvitec_app;
GRANT EXECUTE TO nuvitec_app;
GO
