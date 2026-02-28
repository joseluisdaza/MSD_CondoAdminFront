# Diagrama de Infraestructura y Deployment

## Infraestructura del Sistema de Administración de Condominios

```mermaid
graph TB
    %% Usuarios y dispositivos
    subgraph "👥 Usuarios"
        User1[👤 Administrador<br/>Web Browser]
        User2[🏠 Habitante<br/>Mobile/Web]
        User3[⚙️ Personal<br/>Tablet/Web]
    end

    %% Capa de Red y Seguridad
    subgraph "🌐 Internet"
        Internet[Internet]
    end

    subgraph "🔒 Seguridad y Load Balancing"
        LB[⚖️ Load Balancer<br/>NGINX/HAProxy]
        FW[🛡️ Firewall<br/>Web Application Firewall]
        SSL[🔐 SSL/TLS<br/>Certificado HTTPS]
    end

    %% Capa de Aplicación
    subgraph "🖥️ Servidor de Aplicaciones"
        subgraph "📱 Frontend Server"
            React1[⚛️ React App<br/>Instancia 1<br/>Port 3000]
            React2[⚛️ React App<br/>Instancia 2<br/>Port 3001]
        end

        subgraph "🚀 Backend API Servers"
            API1[🔗 ASP.NET Core API<br/>Instancia 1<br/>Port 7221]
            API2[🔗 ASP.NET Core API<br/>Instancia 2<br/>Port 7222]
        end
    end

    %% Capa de Datos
    subgraph "💾 Capa de Datos"
        subgraph "🗄️ Base de Datos"
            DBPrimary[🏛️ SQL Server Principal<br/>Puerto 1433]
            DBSecondary[🔄 SQL Server Réplica<br/>Failover/Read-Only]
        end

        subgraph "📦 Cache y Sesiones"
            Redis[⚡ Redis Cache<br/>Sesiones JWT<br/>Puerto 6379]
        end

        subgraph "📁 Almacenamiento"
            FileServer[📂 File Server<br/>Documentos y adjuntos]
        end
    end

    %% Servicios Externos
    subgraph "🌍 Servicios Externos"
        PaymentGW[💳 Pasarela de Pagos<br/>Stripe/PayPal/Local]
        EmailSvc[📧 Servicio de Email<br/>SMTP/SendGrid]
        SMSSvc[📱 Servicio SMS<br/>Twilio/Local]
    end

    %% Monitoreo y Logs
    subgraph "📊 Monitoreo y Logs"
        Monitor[📈 Application Insights<br/>Monitoring]
        Logs[📝 Log Management<br/>ELK Stack/Serilog]
    end

    %% Backup y Seguridad de Datos
    subgraph "🔐 Backup y Seguridad"
        Backup[💾 Backup Server<br/>Respaldos automáticos]
        Vault[🔑 Key Vault<br/>Secretos y certificados]
    end

    %% Conexiones
    User1 --> Internet
    User2 --> Internet
    User3 --> Internet

    Internet --> SSL
    SSL --> FW
    FW --> LB

    LB --> React1
    LB --> React2
    LB --> API1
    LB --> API2

    React1 -- "API Calls" --> API1
    React2 -- "API Calls" --> API2
    API1 -- "Cross-instance" --> API2

    API1 --> Redis
    API2 --> Redis
    API1 --> DBPrimary
    API2 --> DBPrimary

    DBPrimary -- "Replicación" --> DBSecondary

    API1 -- "File Upload/Download" --> FileServer
    API2 -- "File Upload/Download" --> FileServer

    API1 --> PaymentGW
    API1 --> EmailSvc
    API1 --> SMSSvc

    API1 --> Monitor
    API2 --> Monitor
    React1 --> Monitor

    API1 --> Logs
    API2 --> Logs

    DBPrimary --> Backup
    FileServer --> Backup

    API1 --> Vault
    API2 --> Vault

    %% Estilos
    classDef userStyle fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef securityStyle fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef appStyle fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef dataStyle fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef externalStyle fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef monitorStyle fill:#fff8e1,stroke:#fbc02d,stroke-width:2px

    class User1,User2,User3 userStyle
    class LB,FW,SSL securityStyle
    class React1,React2,API1,API2 appStyle
    class DBPrimary,DBSecondary,Redis,FileServer dataStyle
    class PaymentGW,EmailSvc,SMSSvc externalStyle
    class Monitor,Logs,Backup,Vault monitorStyle
```

## Descripción de la Infraestructura

### **👥 Capa de Usuario**

#### **Dispositivos Soportados**

- **Administradores**: Ordenadores con navegadores modernos
- **Habitantes**: Dispositivos móviles y web responsivo
- **Personal**: Tablets y computadoras para operaciones diarias

#### **Compatibilidad**

- **Navegadores**: Chrome, Firefox, Safari, Edge (últimas 2 versiones)
- **Dispositivos**: Desktop, tablet, móvil (responsive design)
- **Accesibilidad**: WCAG 2.1 AA compliance

---

### **🔒 Capa de Seguridad**

#### **SSL/TLS Termination**

- **Certificados**: Let's Encrypt o certificados comerciales
- **Protocolos**: TLS 1.2+ únicamente
- **Cipher Suites**: Solo algoritmos seguros (AES, ChaCha20)
- **HSTS**: HTTP Strict Transport Security habilitado

#### **Web Application Firewall (WAF)**

- **Protecciones**:
  - SQL Injection protection
  - XSS (Cross-Site Scripting) filtering
  - CSRF (Cross-Site Request Forgery) protection
  - Rate limiting por IP
  - Bot detection y mitigation
- **Reglas**: OWASP Core Rule Set

#### **Load Balancer**

- **Tecnología**: NGINX o HAProxy
- **Algoritmos**: Round-robin con health checks
- **Sticky Sessions**: Para aplicaciones con estado
- **SSL Offloading**: Terminación SSL en el balanceador

---

### **🖥️ Capa de Aplicación**

#### **Frontend Servers**

- **Tecnología**: React SPA servido por NGINX
- **Instancias**: 2+ para alta disponibilidad
- **Configuración**:
  - Gzip compression habilitado
  - Cache headers apropiados
  - Fallback a index.html para SPA routing
- **CDN**: CloudFlare o AWS CloudFront para assets estáticos

#### **Backend API Servers**

- **Tecnología**: ASP.NET Core en contenedores Docker
- **Instancias**: 2+ con auto-scaling
- **Configuración**:
  - Health check endpoints
  - Graceful shutdown handling
  - Connection pooling para base de datos
- **Runtime**: .NET 8.0+ con optimizaciones de performance

---

### **💾 Capa de Datos**

#### **Base de Datos Principal**

- **Tecnología**: SQL Server 2019+ o Azure SQL Database
- **Configuración**:
  - Always On Availability Groups para HA
  - Automatic failover configurado
  - Query optimization y indexing
  - Backup automatizado cada 15 minutos

#### **Base de Datos Secundaria**

- **Propósito**: Read-only replica para reportes
- **Configuración**:
  - Replicación asíncrona
  - Lag máximo de 5 segundos
  - Usado para consultas de solo lectura

#### **Cache Redis**

- **Uso**:
  - Sesiones de usuario (JWT blacklist)
  - Cache de consultas frecuentes
  - Rate limiting counters
- **Configuración**:
  - Cluster mode para alta disponibilidad
  - Persistencia RDB + AOF
  - Memoria: 4-8GB según carga

#### **File Server**

- **Propósito**: Almacenamiento de documentos y adjuntos
- **Tecnología**: MinIO (S3-compatible) o Azure Blob Storage
- **Características**:
  - Versioning habilitado
  - Lifecycle policies para archivos antiguos
  - Backup automático

---

### **🌍 Servicios Externos**

#### **Pasarela de Pagos**

- **Opciones**:
  - **Internacional**: Stripe, PayPal
  - **Local**: Integración con bancos locales
- **Características**:
  - PCI DSS compliance
  - Webhooks para confirmación de pagos
  - Retry logic para transacciones fallidas

#### **Servicio de Email**

- **Opciones**: SendGrid, AWS SES, SMTP local
- **Uso**:
  - Notificaciones de expensas
  - Recordatorios de pago
  - Confirmaciones de transacciones
- **Features**: Templates, tracking de entrega, bounce handling

#### **Servicio SMS**

- **Opciones**: Twilio, AWS SNS, proveedores locales
- **Uso**:
  - Verificación 2FA
  - Alertas críticas
  - Recordatorios de pago

---

### **📊 Monitoreo y Observabilidad**

#### **Application Performance Monitoring**

- **Herramientas**: Application Insights, New Relic, Datadog
- **Métricas**:
  - Response time por endpoint
  - Error rates y stack traces
  - Dependencias externas
  - User session analytics

#### **Log Management**

- **Stack**: ELK (Elasticsearch, Logstash, Kibana) o EFK (Fluentd)
- **Agregación**: Logs centralizados de todas las instancias
- **Retention**: 90 días para logs de aplicación, 1 año para logs de seguridad
- **Alertas**: Notificaciones automáticas por errores críticos

---

### **🔐 Backup y Disaster Recovery**

#### **Estrategia de Backup**

- **Base de Datos**:
  - Full backup diario
  - Differential backup cada 6 horas
  - Transaction log backup cada 15 minutos
- **Archivos**: Backup incremental diario
- **Configuración**: Backup semanal completo

#### **Disaster Recovery**

- **RTO (Recovery Time Objective)**: 4 horas
- **RPO (Recovery Point Objective)**: 15 minutos
- **Geo-redundancia**: Backups en región secundaria
- **Testing**: DR drills trimestrales

#### **Key Vault / Secrets Management**

- **Tecnología**: Azure Key Vault, HashiCorp Vault, AWS Secrets Manager
- **Almacenamiento seguro**:
  - Cadenas de conexión a BD
  - Claves API de servicios externos
  - Certificados SSL
- **Rotación automática**: Claves rotadas cada 90 días

---

### **🚀 Escalabilidad y Performance**

#### **Auto-scaling**

- **Métricas**: CPU, memoria, request count
- **Configuración**:
  - Scale out cuando CPU > 70%
  - Scale in cuando CPU < 30%
  - Mínimo 2 instancias, máximo 10

#### **Optimizaciones**

- **Database**: Connection pooling, query optimization
- **API**: Response caching, compression
- **Frontend**: Code splitting, lazy loading
- **CDN**: Static asset acceleration

#### **Capacity Planning**

- **Usuarios concurrentes**: 500-1000
- **Throughput**: 1000 requests/second
- **Storage**: 100GB inicial, crecimiento 20% anual
- **Bandwidth**: 10Mbps mínimo garantizado
