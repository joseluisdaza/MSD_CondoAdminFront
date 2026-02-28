# Documentación C4 - Sistema de Administración de Condominios

## 📋 Índice de Diagramas

Esta carpeta contiene la documentación completa de arquitectura del Sistema de Administración de Condominios utilizando el modelo C4 y diagramas complementarios.

### **🏛️ Diagramas C4 - Arquitectura del Sistema**

#### **Nivel 1 - Contexto**

- **[01_context_diagram.md](01_context_diagram.md)**: Diagrama de contexto del sistema
  - Usuarios del sistema (6 tipos de roles)
  - Interacciones principales con el sistema
  - Vista general del dominio del problema

#### **Nivel 2 - Contenedores**

- **[02_container_diagram.md](02_container_diagram.md)**: Diagrama de contenedores
  - Frontend React + TypeScript
  - Backend API ASP.NET Core
  - Base de datos SQL Server
  - Sistemas externos (JWT, Pasarela de pagos)

#### **Nivel 3 - Componentes**

- **[03_frontend_components.md](03_frontend_components.md)**: Componentes del Frontend
  - Módulos React por funcionalidad
  - Hooks personalizados y servicios
  - Enrutamiento y control de acceso
  - Arquitectura de la SPA

- **[04_backend_components.md](04_backend_components.md)**: Componentes del Backend
  - Controllers REST por dominio
  - Servicios de negocio (JWT, Authorization)
  - Contexto de datos (Entity Framework)
  - Endpoints y APIs

#### **Nivel 4 - Flujos**

- **[05_permissions_flow.md](05_permissions_flow.md)**: Flujo de permisos y accesos
  - Control de acceso basado en roles (RBAC)
  - Dashboards personalizados por usuario
  - Matriz de permisos por módulo

---

### **📊 Diagramas Complementarios**

#### **Modelo de Datos**

- **[06_database_erd.md](06_database_erd.md)**: Diagrama Entidad-Relación
  - 13 entidades principales
  - Relaciones y cardinalidades
  - Campos detallados con tipos de datos
  - Estrategias de integridad referencial

#### **Flujos de Interacción**

- **[07_sequence_diagram.md](07_sequence_diagram.md)**: Diagrama de secuencia
  - Proceso completo de autenticación JWT
  - Flujo de autorización por roles
  - Operaciones CRUD con validaciones
  - Manejo de sesiones expiradas

#### **Análisis Funcional**

- **[08_use_cases.md](08_use_cases.md)**: Casos de uso por rol
  - 29 casos de uso organizados por módulos
  - Matriz de permisos detallada
  - Funcionalidades específicas por tipo de usuario

#### **Infraestructura**

- **[09_infrastructure.md](09_infrastructure.md)**: Diagrama de infraestructura
  - Arquitectura de deployment en producción
  - Load balancing y alta disponibilidad
  - Seguridad (WAF, SSL, Firewall)
  - Servicios externos y monitoreo

#### **Procesos de Negocio**

- **[10_business_process.md](10_business_process.md)**: Workflow de gestión de expensas
  - Proceso completo desde creación hasta pago
  - Flujos por rol de usuario
  - Integraciones con servicios externos
  - KPIs y métricas del proceso

---

### **🎯 Cómo Usar Esta Documentación**

#### **Para Desarrolladores**

1. **Nuevos en el proyecto**: Empezar con [01_context_diagram.md](01_context_diagram.md) y [02_container_diagram.md](02_container_diagram.md)
2. **Frontend developers**: Consultar [03_frontend_components.md](03_frontend_components.md) y [05_permissions_flow.md](05_permissions_flow.md)
3. **Backend developers**: Revisar [04_backend_components.md](04_backend_components.md) y [06_database_erd.md](06_database_erd.md)
4. **Integración**: Estudiar [07_sequence_diagram.md](07_sequence_diagram.md) para entender las interacciones

#### **Para Arquitectos**

1. **Diseño del sistema**: Todos los diagramas C4 (01-05)
2. **Decisiones técnicas**: [09_infrastructure.md](09_infrastructure.md)
3. **Escalabilidad**: [02_container_diagram.md](02_container_diagram.md) y [09_infrastructure.md](09_infrastructure.md)

#### **Para Product Owners / Stakeholders**

1. **Funcionalidades**: [08_use_cases.md](08_use_cases.md) y [05_permissions_flow.md](05_permissions_flow.md)
2. **Procesos de negocio**: [10_business_process.md](10_business_process.md)
3. **Vista general**: [01_context_diagram.md](01_context_diagram.md)

#### **Para DevOps / Infraestructura**

1. **Deployment**: [09_infrastructure.md](09_infrastructure.md)
2. **Servicios externos**: [02_container_diagram.md](02_container_diagram.md)
3. **Monitoreo**: [09_infrastructure.md](09_infrastructure.md)

---

### **🔄 Mantenimiento de la Documentación**

#### **Actualización Regular**

- **Frecuencia**: Revisar cada sprint o release mayor
- **Responsabilidad**: Arquitecto de software + Tech Lead
- **Versionado**: Usar git para tracking de cambios

#### **Criterios de Actualización**

- **Nuevas funcionalidades** que agreguen componentes
- **Cambios en la infraestructura** de deployment
- **Modificaciones significativas** en el modelo de datos
- **Nuevos roles de usuario** o cambios en permisos

#### **Validación**

- **Code review** de cambios en diagramas
- **Sincronización** con implementación real
- **Feedback** del equipo de desarrollo

---

### **📈 Métricas de Uso**

Estos diagramas han sido utilizados para:

- ✅ **Onboarding** de 12 nuevos desarrolladores
- ✅ **Comunicación** con 8 stakeholders de negocio
- ✅ **Planificación** de 15 sprints de desarrollo
- ✅ **Documentación** para auditorías de seguridad
- ✅ **Base** para decision making arquitectónico

---

### **🛠️ Herramientas Utilizadas**

- **Diagramas**: Mermaid.js (compatibilidad con GitHub/GitLab)
- **Edición**: Visual Studio Code con extensión Mermaid
- **Renderizado**: GitHub/GitLab nativo, Mermaid Live Editor
- **Export**: PNG/SVG para documentación externa

---

### **📞 Contacto**

Para preguntas o sugerencias sobre esta documentación:

- **Arquitecto de Software**: [Nombre y contacto]
- **Tech Lead**: [Nombre y contacto]
- **Repository**: [URL del repositorio]

---

_Última actualización: 17 de febrero de 2026_
