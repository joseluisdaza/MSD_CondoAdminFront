# Proceso de Negocio - Gestión de Expensas

## Gestión Completa de Expensas - Workflow

```mermaid
flowchart TD
    %% Inicio del proceso
    Start([🏁 Inicio del Proceso de Expensas]) --> CheckRole{🔍 Verificar Rol de Usuario}

    %% Verificación de roles
    CheckRole -->|Admin/Auxiliar| CreateExpense[📝 Crear Nueva Expensa]
    CheckRole -->|Director| ReviewExpense[👁️ Revisar Expensas]
    CheckRole -->|Habitante| ViewOwnExpenses[🏠 Ver Mis Expensas]
    CheckRole -->|Sin permisos| AccessDenied[🚫 Acceso Denegado]

    %% Proceso de creación de expensas
    CreateExpense --> SelectCategory[🏷️ Seleccionar Categoría<br/>- Mantenimiento<br/>- Servicios<br/>- Limpieza<br/>- Seguridad]
    SelectCategory --> SelectProperty[🏢 Seleccionar Propiedades<br/>Afectadas]
    SelectProperty --> SetAmount[💰 Definir Monto y<br/>Fecha de Vencimiento]
    SetAmount --> SaveExpense[💾 Guardar Expensa]

    %% Validación y aprobación
    SaveExpense --> ValidateExpense{✅ Validar Datos}
    ValidateExpense -->|Válido| AutoAssign[🔄 Asignar Automáticamente<br/>a Propietarios]
    ValidateExpense -->|Inválido| ShowError[❌ Mostrar Errores<br/>de Validación]
    ShowError --> CreateExpense

    %% Asignación y notificación
    AutoAssign --> CalcIndividual[🧮 Calcular Monto<br/>Individual por Propiedad]
    CalcIndividual --> SendNotification[📧 Enviar Notificaciones<br/>a Propietarios]
    SendNotification --> ExpenseCreated[✅ Expensa Creada<br/>y Notificada]

    %% Proceso de pago por parte del habitante
    ViewOwnExpenses --> CheckBalance{💳 Consultar<br/>Expensas Pendientes}
    CheckBalance -->|Hay pendientes| ShowPending[📋 Mostrar Lista<br/>de Expensas Pendientes]
    CheckBalance -->|Sin pendientes| NothingPending[👍 Sin Expensas Pendientes]

    ShowPending --> SelectToPay[✅ Seleccionar Expensas<br/>a Pagar]
    SelectToPay --> ChoosePayment[💳 Elegir Método de Pago<br/>- Tarjeta de Crédito<br/>- Transferencia<br/>- Efectivo]
    ChoosePayment --> ProcessPayment[⚡ Procesar Pago]

    %% Validación del pago
    ProcessPayment --> PaymentResult{💰 Resultado del Pago}
    PaymentResult -->|Exitoso| UpdateStatus[✅ Actualizar Estado<br/>a "Pagado"]
    PaymentResult -->|Fallido| PaymentError[❌ Error en Pago<br/>- Fondos insuficientes<br/>- Error de red<br/>- Tarjeta vencida]
    PaymentResult -->|Pendiente| PaymentPending[⏳ Pago Pendiente<br/>de Confirmación]

    %% Confirmación y cierre
    UpdateStatus --> GenerateReceipt[🧾 Generar Recibo<br/>de Pago]
    GenerateReceipt --> SendConfirmation[📧 Enviar Confirmación<br/>al Propietario]
    SendConfirmation --> UpdateReports[📊 Actualizar Reportes<br/>y Estadísticas]
    UpdateReports --> ExpensePaid[✅ Proceso Completado]

    %% Manejo de errores y reintentos
    PaymentError --> RetryPayment{🔄 ¿Reintentar Pago?}
    RetryPayment -->|Sí| ChoosePayment
    RetryPayment -->|No| PaymentCanceled[❌ Pago Cancelado]

    PaymentPending --> CheckStatus[🔍 Verificar Estado<br/>con Pasarela]
    CheckStatus --> PaymentResult

    %% Supervisión y reportes
    ReviewExpense --> GenerateReport[📈 Generar Reporte<br/>de Expensas]
    GenerateReport --> ViewAnalytics[📊 Ver Análisis<br/>- Pagos recibidos<br/>- Morosidad<br/>- Tendencias]
    ViewAnalytics --> ExportData[📥 Exportar Datos<br/>Excel/PDF]

    %% Proceso de seguimiento
    ExpenseCreated --> FollowUp[📞 Seguimiento de Morosos<br/>después de vencimiento]
    FollowUp --> LateFeeCheck{⏰ ¿Aplicar Recargo<br/>por Mora?}
    LateFeeCheck -->|Sí| AddLateFee[💸 Agregar Recargo]
    LateFeeCheck -->|No| ContinueFollow[📞 Continuar Seguimiento]
    AddLateFee --> SendReminder[📧 Enviar Recordatorio<br/>de Pago]
    SendReminder --> ViewOwnExpenses

    %% Finales del proceso
    ExpensePaid --> End([🏁 Fin del Proceso])
    PaymentCanceled --> End
    AccessDenied --> End
    NothingPending --> End
    ExportData --> End

    %% Estilos por tipo de proceso
    classDef startEnd fill:#81c784,stroke:#4caf50,stroke-width:2px,color:#ffffff
    classDef process fill:#64b5f6,stroke:#2196f3,stroke-width:2px,color:#ffffff
    classDef decision fill:#ffb74d,stroke:#ff9800,stroke-width:2px,color:#000000
    classDef error fill:#e57373,stroke:#f44336,stroke-width:2px,color:#ffffff
    classDef success fill:#a5d6a7,stroke:#4caf50,stroke-width:2px,color:#000000
    classDef notification fill:#ce93d8,stroke:#9c27b0,stroke-width:2px,color:#ffffff

    class Start,End startEnd
    class CreateExpense,SelectCategory,SelectProperty,SetAmount,SaveExpense,CalcIndividual,ProcessPayment,UpdateStatus,GenerateReceipt process
    class CheckRole,ValidateExpense,CheckBalance,PaymentResult,LateFeeCheck,RetryPayment decision
    class ShowError,PaymentError,AccessDenied,PaymentCanceled error
    class ExpenseCreated,UpdateStatus,ExpensePaid,NothingPending success
    class SendNotification,SendConfirmation,SendReminder notification
```

## Descripción del Proceso de Negocio

### **🎯 Objetivo del Proceso**

Gestionar el ciclo completo de las expensas del condominio, desde su creación hasta el pago y seguimiento, garantizando transparencia, eficiencia y control financiero.

---

### **👤 Actores Involucrados**

#### **🏢 Personal Administrativo**

- **Admin/Auxiliar**: Crean y gestionan expensas
- **Director**: Supervisa y genera reportes

#### **🏠 Residentes**

- **Habitantes**: Consultan y pagan sus expensas

#### **🤖 Sistema**

- **Notificaciones automáticas**
- **Cálculos de distribución**
- **Integración con pasarela de pagos**

---

### **📊 Fases del Proceso**

#### **1. 📝 Creación de Expensas**

**Responsable**: Administrador/Auxiliar

**Pasos**:

1. **Categorización**: Selección del tipo de expensa
   - Mantenimiento (reparaciones, mejoras)
   - Servicios (agua, luz, gas común)
   - Limpieza (personal, productos)
   - Seguridad (vigilancia, sistemas)

2. **Asignación de Propiedades**:
   - Selección manual de propiedades afectadas
   - Aplicación masiva a todas las propiedades
   - Exclusiones específicas si aplica

3. **Configuración Financiera**:
   - Monto total de la expensa
   - Fecha de vencimiento
   - Método de distribución (por área, por unidad, personalizado)

**Validaciones**:

- Monto mayor a cero
- Fecha de vencimiento futura
- Al menos una propiedad seleccionada
- Categoría válida asignada

#### **2. 🔄 Asignación Automática**

**Proceso del Sistema**:

1. **Cálculo Individual**:
   - Distribución proporcional según área de propiedad
   - Aplicación de factores de ajuste si existen
   - Redondeo a 2 decimales

2. **Creación de Registros**:
   - Generación de expensa individual por propiedad
   - Asignación a propietarios correspondientes
   - Estado inicial: "Pendiente"

3. **Notificaciones**:
   - Email automático a cada propietario
   - SMS opcional para recordatorios
   - Notificación in-app en el sistema

#### **3. 👁️ Consulta y Gestión (Habitantes)**

**Funcionalidades para Residentes**:

1. **Dashboard Personalizado**:
   - Resumen de expensas pendientes
   - Total adeudado
   - Próximas fechas de vencimiento

2. **Historial Completo**:
   - Expensas pagadas
   - Fechas de pago
   - Recibos descargables

3. **Filtros y Búsquedas**:
   - Por fechas
   - Por categorías
   - Por estado de pago

#### **4. 💳 Proceso de Pago**

**Métodos Disponibles**:

- **Tarjeta de Crédito/Débito**: Procesamiento inmediato
- **Transferencia Bancaria**: Confirmación en 24-48 horas
- **Pago en Efectivo**: Registro manual por administración

**Flujo de Pago Digital**:

1. **Selección**: Usuario elige expensas a pagar
2. **Método**: Selección de forma de pago
3. **Confirmación**: Revisión de datos y montos
4. **Procesamiento**: Integración con pasarela
5. **Validación**: Confirmación de transacción
6. **Recibo**: Generación automática

**Estados de Pago**:

- **Pendiente**: Pago iniciado, esperando confirmación
- **Exitoso**: Transacción completada
- **Fallido**: Error en procesamiento
- **Cancelado**: Usuario canceló el proceso

#### **5. 📈 Supervisión y Reportes (Director)**

**Reportes Disponibles**:

1. **Estado de Cobranza**:
   - Pagos recibidos vs pendientes
   - Análisis de morosidad por período
   - Identificación de morosos recurrentes

2. **Análisis Financiero**:
   - Flujo de caja mensual
   - Categorías de gasto más frecuentes
   - Tendencias de pago

3. **Reportes Operativos**:
   - Eficiencia de cobranza
   - Métodos de pago preferidos
   - Tiempos promedio de pago

**Exportación**:

- PDF para presentación
- Excel para análisis detallado
- CSV para integración con otros sistemas

#### **6. 📞 Seguimiento de Morosos**

**Proceso Automático**:

1. **Detección**: Sistema identifica pagos vencidos
2. **Recordatorios**: Envío automático de notificaciones
3. **Escalación**: Notificaciones cada 7 días de retraso
4. **Recargos**: Aplicación automática de multas por mora

**Gestión Manual**:

- **Casos Especiales**: Gestión individual de situaciones complejas
- **Planes de Pago**: Configuración de acuerdos de pago
- **Exenciones**: Aplicación de excepciones justificadas

---

### **🔧 Integraciones Técnicas**

#### **Pasarela de Pagos**

- **Webhooks**: Confirmaciones automáticas de transacciones
- **Retry Logic**: Reintentos automáticos para pagos fallidos
- **Reconciliación**: Verificación diaria de transacciones

#### **Sistema de Notificaciones**

- **Email**: Confirmaciones y recordatorios
- **SMS**: Alertas críticas
- **Push**: Notificaciones in-app

#### **Base de Datos**

- **Transacciones**: Garantía de consistencia en pagos
- **Auditoría**: Log completo de todas las operaciones
- **Backup**: Respaldos automáticos cada 15 minutos

---

### **📊 KPIs del Proceso**

#### **Eficiencia Operativa**

- **Tiempo de creación de expensa**: < 5 minutos
- **Tiempo de asignación automática**: < 30 segundos
- **Disponibilidad del sistema**: > 99.5%

#### **Satisfacción del Usuario**

- **Tiempo de procesamiento de pago**: < 2 minutos
- **Éxito en primer intento de pago**: > 95%
- **Tiempo de respuesta de consultas**: < 3 segundos

#### **Gestión Financiera**

- **Tasa de cobranza**: > 90% en fecha de vencimiento
- **Morosidad promedio**: < 15% mensual
- **Tiempo promedio de pago**: < 20 días desde creación

#### **Automatización**

- **Notificaciones automáticas**: 100%
- **Cálculos automáticos**: 100%
- **Generación de recibos**: 100%

---

### **🛡️ Controles de Seguridad**

#### **Integridad de Datos**

- **Validaciones**: En frontend y backend
- **Checksums**: Verificación de integridad en pagos
- **Auditoría**: Registro completo de modificaciones

#### **Acceso y Autorización**

- **RBAC**: Control granular por roles
- **JWT**: Tokens con expiración
- **Logs**: Registro de todos los accesos

#### **Cumplimiento**

- **PCI DSS**: Para manejo de datos de tarjetas
- **GDPR**: Protección de datos personales
- **SOX**: Controles financieros (si aplica)
