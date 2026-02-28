# Diagrama C4 - Contexto del Sistema

## Sistema de Administración de Condominios - Diagrama de Contexto (Nivel 1)

```mermaid
flowchart LR
    %% Usuarios del Sistema
    Admin[👤 Administrador<br/>Acceso completo al sistema]
    Super[👑 Super Admin<br/>Permisos administrativos avanzados]
    Director[🎯 Director<br/>Supervisa operaciones del condominio]
    Habitante[🏠 Habitante<br/>Residente del condominio]
    Auxiliar[⚙️ Auxiliar<br/>Personal operativo]
    Seguridad[🔒 Seguridad<br/>Personal de seguridad con acceso limitado]

    %% Sistema Principal
    CondoSystem[🏢 Sistema de Administración de Condominios<br/>Plataforma web para gestionar condominios,<br/>expensas, pagos y propiedades]

    %% Relaciones
    Admin --> |Gestiona completamente| CondoSystem
    Super --> |Administra sistema| CondoSystem
    Director --> |Supervisa operaciones| CondoSystem
    Habitante --> |Consulta y paga expensas| CondoSystem
    Auxiliar --> |Realiza operaciones| CondoSystem
    Seguridad --> |Acceso básico| CondoSystem

    %% Estilos
    classDef systemStyle fill:#1168bd,stroke:#0d47a1,stroke-width:3px,color:#ffffff
    classDef adminStyle fill:#ff6b6b,stroke:#c92a2a,stroke-width:2px,color:#ffffff
    classDef superStyle fill:#845ec2,stroke:#5f3dc4,stroke-width:2px,color:#ffffff
    classDef directorStyle fill:#ffd93d,stroke:#fcc419,stroke-width:2px,color:#000000
    classDef auxiliarStyle fill:#51cf66,stroke:#37b24d,stroke-width:2px,color:#000000
    classDef habitanteStyle fill:#74c0fc,stroke:#1c7ed6,stroke-width:2px,color:#000000
    classDef seguridadStyle fill:#ced4da,stroke:#495057,stroke-width:2px,color:#000000

    class CondoSystem systemStyle
    class Admin adminStyle
    class Super superStyle
    class Director directorStyle
    class Auxiliar auxiliarStyle
    class Habitante habitanteStyle
    class Seguridad seguridadStyle
```

## Descripción

Este diagrama muestra la vista de contexto del sistema de administración de condominios, identificando:

### Usuarios del Sistema:

- **Administrador**: Acceso completo a todas las funcionalidades del sistema
- **Super Admin**: Permisos administrativos avanzados y configuración del sistema
- **Director**: Supervisa operaciones del condominio con permisos de gestión
- **Habitante**: Residentes que consultan y pagan sus expensas
- **Auxiliar**: Personal operativo con permisos para gestionar propiedades y expensas
- **Seguridad**: Personal de seguridad con acceso básico al sistema

### Sistema Principal:

- **Sistema de Administración de Condominios**: Plataforma web centralizada para la gestión integral de condominios, incluyendo expensas, pagos, propiedades y usuarios.

### Interacciones Principales:

Cada tipo de usuario interactúa con el sistema según su nivel de permisos y responsabilidades específicas.
