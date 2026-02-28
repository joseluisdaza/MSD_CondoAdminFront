# Diagrama C4 - Componentes del Backend

## Sistema de Administración de Condominios - Componentes del Backend API (Nivel 3)

```mermaid
flowchart LR
    %% Sistemas Externos
    SPA[🚀 Aplicación Web SPA<br/>React + TypeScript]
    DB[(🗄 Base de Datos<br/>SQL Server)]

    %% API Backend
    subgraph Backend ["API Backend - ASP.NET Core"]
        %% Controllers de Autenticación
        AuthController[🔐 Auth Controller<br/>ASP.NET Controller<br/><br/>Maneja login y<br/>autenticación JWT]
        HealthController[❤️ Health Controller<br/>ASP.NET Controller<br/><br/>Endpoints de salud<br/>del sistema]

        %% Controllers de Usuarios
        UsersController[👤 Users Controller<br/>ASP.NET Controller<br/><br/>CRUD de usuarios y<br/>gestión de perfiles]
        RoleController[🔑 Role Controller<br/>ASP.NET Controller<br/><br/>Gestión de roles<br/>y permisos]

        %% Controllers de Propiedades
        PropertyController[🏢 Property Controller<br/>ASP.NET Controller<br/><br/>CRUD de propiedades<br/>del condominio]
        PropertyTypeController[🏠 PropertyType Controller<br/>ASP.NET Controller<br/><br/>Gestión de tipos<br/>de propiedad]
        PropertyOwnersController[👥 PropertyOwners Controller<br/>ASP.NET Controller<br/><br/>Gestión de<br/>propietarios]

        %% Controllers Financieros
        ExpensesController[💰 Expenses Controller<br/>ASP.NET Controller<br/><br/>CRUD de expensas<br/>ordinarias]
        ExpenseCategoriesController[📊 ExpenseCategories Controller<br/>ASP.NET Controller<br/><br/>Gestión de categorías<br/>de expensas]
        ExpensePaymentsController[💳 ExpensePayments Controller<br/>ASP.NET Controller<br/><br/>Gestión de pagos<br/>de expensas]

        %% Controllers de Servicios
        ServiceExpensesController[🔧 ServiceExpenses Controller<br/>ASP.NET Controller<br/><br/>Gestión de expensas<br/>de servicios]
        ServicePaymentsController[💵 ServicePayments Controller<br/>ASP.NET Controller<br/><br/>Pagos de servicios<br/>específicos]
        ServiceTypesController[🚀 ServiceTypes Controller<br/>ASP.NET Controller<br/><br/>Tipos de servicios<br/>del condominio]

        %% Controller de Estados
        PaymentStatusController[📊 PaymentStatus Controller<br/>ASP.NET Controller<br/><br/>Estados de pagos]

        %% Servicios de Negocio
        JwtService[🔑 JWT Service<br/>C# Service<br/><br/>Generación y validación<br/>de tokens JWT]
        AuthorizationService[🔒 Authorization Service<br/>C# Service<br/><br/>Control de permisos<br/>basado en roles]
        DataContext[🗄 Data Context<br/>Entity Framework<br/><br/>Contexto de base de datos<br/>y mapeo ORM]
    end

    %% Conexiones SPA a Controllers
    SPA --> |POST /Auth/Login| AuthController
    SPA --> |GET /Health| HealthController
    SPA --> |GET,POST,PUT,DELETE /Users| UsersController
    SPA --> |GET,POST,PUT,DELETE /Property| PropertyController
    SPA --> |GET,POST,PUT,DELETE /Expenses| ExpensesController

    %% Conexiones de Autenticación
    AuthController --> |Genera tokens| JwtService
    AuthController --> |Valida credenciales| AuthorizationService

    %% Conexiones de Autorización
    UsersController --> |Verifica permisos| AuthorizationService
    PropertyController --> |Verifica permisos| AuthorizationService
    ExpensesController --> |Verifica permisos| AuthorizationService

    %% Conexiones a Data Context
    UsersController --> |Acceso a datos| DataContext
    PropertyController --> |Acceso a datos| DataContext
    ExpensesController --> |Acceso a datos| DataContext
    ServiceExpensesController --> |Acceso a datos| DataContext
    ExpenseCategoriesController --> |Acceso a datos| DataContext

    %% Conexión a Base de Datos
    DataContext --> |SQL Queries<br/>ADO.NET| DB

    %% Relaciones entre Controllers
    PropertyController -.-> |Relacionado| PropertyOwnersController
    ExpensesController -.-> |Categoriza| ExpenseCategoriesController
    ExpensesController -.-> |Genera pagos| ExpensePaymentsController
    ServiceExpensesController -.-> |Tipifica| ServiceTypesController

    %% Estilos
    classDef authStyle fill:#FF6B6B,stroke:#DC143C,stroke-width:2px,color:#ffffff
    classDef serviceStyle fill:#4ECDC4,stroke:#2E8B57,stroke-width:2px,color:#000000
    classDef authServiceStyle fill:#45B7D1,stroke:#1565C0,stroke-width:2px,color:#ffffff
    classDef dataStyle fill:#96CEB4,stroke:#388E3C,stroke-width:2px,color:#000000
    classDef controllerStyle fill:#87CEEB,stroke:#4682B4,stroke-width:2px,color:#000000
    classDef externalStyle fill:#DDA0DD,stroke:#9932CC,stroke-width:2px,color:#000000

    class AuthController authStyle
    class JwtService serviceStyle
    class AuthorizationService authServiceStyle
    class DataContext dataStyle
    class UsersController,RoleController,PropertyController,PropertyTypeController,PropertyOwnersController,ExpensesController,ExpenseCategoriesController,ExpensePaymentsController,ServiceExpensesController,ServicePaymentsController,ServiceTypesController,PaymentStatusController,HealthController controllerStyle
    class SPA,DB externalStyle
```

## Descripción

Este diagrama muestra la arquitectura interna del API backend construido con ASP.NET Core:

### Controllers (Controladores REST):

#### **Autenticación y Seguridad:**

- **Auth Controller**: `/Auth/Login` - Manejo de autenticación
- **Health Controller**: `/Health` - Monitoreo de salud del sistema

#### **Gestión de Usuarios:**

- **Users Controller**: `/Users` - CRUD de usuarios
- **Role Controller**: `/Role` - Gestión de roles y permisos

#### **Gestión de Propiedades:**

- **Property Controller**: `/Property` - CRUD de propiedades
- **PropertyType Controller**: `/PropertyType` - Tipos de propiedad
- **PropertyOwners Controller**: `/PropertyOwners` - Gestión de propietarios

#### **Gestión Financiera:**

- **Expenses Controller**: `/Expenses` - Expensas ordinarias
- **ExpenseCategories Controller**: `/ExpenseCategories` - Categorización
- **ExpensePayments Controller**: `/ExpensePayments` - Pagos de expensas

#### **Servicios del Condominio:**

- **ServiceExpenses Controller**: `/ServiceExpenses` - Expensas de servicios
- **ServicePayments Controller**: `/ServicePayments` - Pagos de servicios
- **ServiceTypes Controller**: `/ServiceTypes` - Tipos de servicios

#### **Estados y Control:**

- **PaymentStatus Controller**: `/PaymentStatus` - Estados de pagos

### Servicios de Negocio:

#### **JWT Service**

- **Responsabilidad**: Generación y validación de tokens JWT
- **Funciones**:
  - Crear tokens con claims de usuario
  - Validar tokens entrantes
  - Gestionar expiración de sesiones

#### **Authorization Service**

- **Responsabilidad**: Control de permisos basado en roles
- **Funciones**:
  - Validar credenciales de usuario
  - Verificar permisos por endpoint
  - Control de acceso granular

#### **Data Context (Entity Framework)**

- **Responsabilidad**: Acceso a datos y mapeo ORM
- **Funciones**:
  - Mapeo objeto-relacional
  - Gestión de conexiones a BD
  - Transacciones y migraciones

### Patrones de Arquitectura Backend:

- **Arquitectura en capas**: Controllers → Services → Data Access
- **Inyección de dependencias**: Para servicios y contextos
- **Middleware de autenticación**: JWT Bearer Token
- **Validación de modelos**: Data Annotations y FluentValidation
- **Manejo centralizado de errores**: Exception middleware

### Endpoints Principales:

```

GET /Health - Health check
POST /Auth/Login - Autenticación
GET /Users/me - Perfil del usuario actual
GET /Property/ByUser - Propiedades del usuario
GET /Expenses - Lista de expensas
POST /ExpensePayments - Procesar pago

```

```

```
