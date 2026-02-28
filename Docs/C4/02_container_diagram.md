# Diagrama C4 - Contenedores del Sistema

## Sistema de Administración de Condominios - Diagrama de Contenedores (Nivel 2)

```mermaid
flowchart TB
    %% Usuarios
    Users[👥 Usuarios del Sistema<br/>Admin, Super Admin, Director,<br/>Habitante, Auxiliar, Seguridad]

    %% Sistemas Externos
    AuthSystem[🔐 Sistema de Autenticación<br/>JWT para autenticación y<br/>autorización basada en roles]

    %% Contenedores del Sistema Principal
    subgraph SystemBoundary ["Sistema de Administración de Condominios"]
        SPA[⚙️ Aplicación Web SPA<br/>React + TypeScript<br/><br/>Interfaz de usuario responsive<br/>para gestión de condominios]
        API[🚀 API Backend<br/>ASP.NET Core<br/><br/>Servicios REST para gestión<br/>de condominios, autenticación<br/>y autorización]
        DB[(🗄 Base de Datos<br/>SQL Server<br/><br/>Almacena información de usuarios,<br/>propiedades, expensas, pagos y<br/>configuración del sistema)]
    end

    %% Relaciones
    Users --> |Interactúa con<br/>HTTPS| SPA
    SPA --> |Realiza llamadas API<br/>JSON/HTTPS| API
    API --> |Lee y escribe datos<br/>ADO.NET/Entity Framework| DB
    API --> |Valida tokens<br/>JWT| AuthSystem

    %% Estilos
    classDef userStyle fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef frontendStyle fill:#63BEF2,stroke:#2196f3,stroke-width:2px,color:#ffffff
    classDef backendStyle fill:#85BBF0,stroke:#1976d2,stroke-width:2px,color:#ffffff
    classDef databaseStyle fill:#F5385D,stroke:#d32f2f,stroke-width:2px,color:#ffffff
    classDef externalStyle fill:#ffb74d,stroke:#f57600,stroke-width:2px,color:#000000

    class Users userStyle
    class SPA frontendStyle
    class API backendStyle
    class DB databaseStyle
    class AuthSystem,PaymentGW externalStyle
```

## Descripción

Este diagrama muestra los contenedores principales del sistema y cómo interactúan entre sí:

### Contenedores Principales:

#### **Frontend - Aplicación Web SPA**

- **Tecnología**: React + TypeScript
- **Responsabilidad**: Interfaz de usuario responsive
- **Puerto**: 3000 (desarrollo), 80/443 (producción)
- **Características**:
  - Single Page Application
  - Responsive design
  - Control de acceso basado en roles

#### **Backend - API REST**

- **Tecnología**: ASP.NET Core
- **Responsabilidad**: Servicios REST y lógica de negocio
- **Puerto**: 7221 (HTTPS)
- **Características**:
  - Autenticación JWT
  - Autorización basada en roles
  - Endpoints RESTful
  - Validación de datos

#### **Base de Datos**

- **Tecnología**: SQL Server
- **Responsabilidad**: Persistencia de datos
- **Puerto**: 1433
- **Datos almacenados**:
  - Usuarios y roles
  - Propiedades y propietarios
  - Expensas y pagos
  - Servicios y categorías
  - Configuración del sistema

### Sistemas Externos:

#### **Sistema de Autenticación JWT**

- Generación y validación de tokens
- Gestión de sesiones de usuario
- Control de expiración

#### **Pasarela de Pagos**

- Procesamiento de pagos de expensas
- Integración con bancos y tarjetas
- Confirmación de transacciones

### Protocolos de Comunicación:

- **HTTPS**: Para todas las comunicaciones web
- **JSON**: Formato de intercambio de datos
- **ADO.NET/Entity Framework**: Acceso a base de datos
