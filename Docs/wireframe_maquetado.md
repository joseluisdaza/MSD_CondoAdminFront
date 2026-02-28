# Diagrama de Maquetado - Frontend Condo Admin

## Maquetado de Páginas Principal

```mermaid
flowchart LR
    subgraph APP["🏠 Aplicación Principal"]
        LOGIN[("🔐 Login Page<br/>- Campo Usuario<br/>- Campo Password<br/>- Botón Idioma<br/>- Botón Submit")]

        subgraph MAIN["📱 Landing Page (Main Layout)"]
            HEADER["🍔 Header Mobile<br/>- Hamburger Menu<br/>- Logo/Title"]

            subgraph SIDEBAR["🗂️ Sidebar Navigation"]
                NAV_INICIO["🏡 Inicio"]
                NAV_EXPENSAS["💰 Expensas"]
                NAV_PAGOS["💳 Pago Expensas"]
                NAV_CAT_EXP["📋 Categorías"]
                NAV_EXP_SERV["🔧 Expensas Servicio"]
                NAV_PAG_SERV["⚙️ Pagos Servicio"]
                NAV_TIPOS_SERV["🔨 Tipos Servicio"]
                NAV_PROPS["🏢 Propiedades"]
                NAV_TIPO_PROPS["🏗️ Tipo Propiedades"]
                NAV_USER["👤 Usuario"]
                NAV_USERS["👥 Usuarios"]
                NAV_OWNERS["🏠👤 Propietarios"]
                NAV_ROLES["🎭 Roles"]
                NAV_REPORTS["📊 Reportes"]
            end

            subgraph CONTENT["📄 Área de Contenido Principal"]
                INICIO_CONTENT["Dashboard Inicio"]
                MODULE_CONTENT["Contenido Módulos"]
            end
        end
    end

    LOGIN -->|Autenticación exitosa| MAIN
    MAIN -->|Logout| LOGIN

    NAV_INICIO -.-> INICIO_CONTENT
    NAV_EXPENSAS -.-> MODULE_CONTENT
    NAV_PAGOS -.-> MODULE_CONTENT
    NAV_CAT_EXP -.-> MODULE_CONTENT
    NAV_EXP_SERV -.-> MODULE_CONTENT
    NAV_PAG_SERV -.-> MODULE_CONTENT
    NAV_TIPOS_SERV -.-> MODULE_CONTENT
    NAV_PROPS -.-> MODULE_CONTENT
    NAV_TIPO_PROPS -.-> MODULE_CONTENT
    NAV_USER -.-> MODULE_CONTENT
    NAV_USERS -.-> MODULE_CONTENT
    NAV_OWNERS -.-> MODULE_CONTENT
    NAV_ROLES -.-> MODULE_CONTENT
    NAV_REPORTS -.-> MODULE_CONTENT

    classDef loginStyle fill:#e74c3c,stroke:#c0392b,stroke-width:2px,color:white
    classDef mainStyle fill:#3498db,stroke:#2980b9,stroke-width:2px,color:white
    classDef navStyle fill:#f39c12,stroke:#e67e22,stroke-width:2px,color:white
    classDef contentStyle fill:#27ae60,stroke:#229954,stroke-width:2px,color:white

    class LOGIN loginStyle
    class MAIN,HEADER mainStyle
    class SIDEBAR,NAV_INICIO,NAV_EXPENSAS,NAV_PAGOS,NAV_CAT_EXP,NAV_EXP_SERV,NAV_PAG_SERV,NAV_TIPOS_SERV,NAV_PROPS,NAV_TIPO_PROPS,NAV_USER,NAV_USERS,NAV_OWNERS,NAV_ROLES,NAV_REPORTS navStyle
    class CONTENT,INICIO_CONTENT,MODULE_CONTENT contentStyle
```

## Wireframe Detallado - Página de Login

```mermaid
flowchart TD
    subgraph LOGIN_LAYOUT["📱 Login Page Layout"]
        subgraph LOGIN_HEADER["Header (Centrado)"]
            LOGO["🏠 Logo Condominio"]
            TITLE["Sistema Administración<br/>Condominios"]
        end

        subgraph LOGIN_FORM["🔐 Formulario Login"]
            INPUT_USER["📧 Campo Usuario<br/>[Textbox]"]
            INPUT_PASS["🔒 Campo Password<br/>[Password Input]"]
            LANG_SELECT["🌐 Selector Idioma<br/>[Dropdown: ES/EN]"]
            SUBMIT_BTN["🚀 Botón Ingresar<br/>[Submit Button]"]
            ERROR_MSG["❌ Mensaje Error<br/>[Condicional]"]
            LOADING["⏳ Loading Indicator<br/>[Condicional]"]
        end

        subgraph LOGIN_FOOTER["Footer"]
            VERSION["versión 1.0"]
            COPYRIGHT["© 2024"]
        end
    end

    INPUT_USER --> INPUT_PASS
    INPUT_PASS --> LANG_SELECT
    LANG_SELECT --> SUBMIT_BTN
    SUBMIT_BTN -.-> ERROR_MSG
    SUBMIT_BTN -.-> LOADING

    classDef headerStyle fill:#34495e,stroke:#2c3e50,stroke-width:2px,color:white
    classDef formStyle fill:#3498db,stroke:#2980b9,stroke-width:2px,color:white
    classDef inputStyle fill:#ecf0f1,stroke:#bdc3c7,stroke-width:1px,color:black
    classDef buttonStyle fill:#e74c3c,stroke:#c0392b,stroke-width:2px,color:white
    classDef errorStyle fill:#e67e22,stroke:#d35400,stroke-width:2px,color:white

    class LOGO,TITLE headerStyle
    class LOGIN_FORM formStyle
    class INPUT_USER,INPUT_PASS,LANG_SELECT inputStyle
    class SUBMIT_BTN buttonStyle
    class ERROR_MSG,LOADING errorStyle
```

## Wireframe Detallado - Dashboard Principal

```mermaid
flowchart TD
    subgraph MAIN_LAYOUT["📱 Layout Principal - Landing Page"]
        subgraph MOBILE_HEADER["📱 Header Mobile"]
            HAMBURGER["🍔 Hamburger<br/>Button"]
            APP_TITLE["🏠 Admin Condos<br/>Title Bar"]
        end

        subgraph SIDEBAR_MENU["🗂️ Sidebar Menu (Plegable)"]
            subgraph MENU_SECTIONS["Secciones del Menú"]
                SECT_DASHBOARD["🏡 Dashboard"]
                SECT_EXPENSES["💰 Gestión Expensas<br/>├─ Expensas<br/>├─ Pagos<br/>└─ Categorías"]
                SECT_SERVICES["🔧 Servicios<br/>├─ Expensas Servicio<br/>├─ Pagos Servicio<br/>└─ Tipos Servicio"]
                SECT_PROPERTIES["🏢 Propiedades<br/>├─ Propiedades<br/>├─ Tipos<br/>└─ Propietarios"]
                SECT_USERS["👥 Usuarios<br/>├─ Mi Perfil<br/>├─ Usuarios<br/>└─ Roles"]
                SECT_REPORTS["📊 Reportes"]
            end
        end

        subgraph MAIN_CONTENT["📄 Área Contenido Principal"]
            subgraph CONTENT_TYPES["Tipos de Contenido"]
                DASHBOARD_VIEW["🎯 Vista Dashboard<br/>├─ Tarjetas Acceso Rápido<br/>├─ Deudas Pendientes<br/>└─ Anuncios"]

                MODULE_VIEW["📋 Vista Módulo<br/>├─ Barra Herramientas<br/>├─ Tabla/Lista Datos<br/>├─ Formularios Modal<br/>└─ Paginación"]
            end
        end
    end

    HAMBURGER -.->|Toggle| SIDEBAR_MENU

    SECT_DASHBOARD -.-> DASHBOARD_VIEW
    SECT_EXPENSES -.-> MODULE_VIEW
    SECT_SERVICES -.-> MODULE_VIEW
    SECT_PROPERTIES -.-> MODULE_VIEW
    SECT_USERS -.-> MODULE_VIEW
    SECT_REPORTS -.-> MODULE_VIEW

    classDef headerStyle fill:#34495e,stroke:#2c3e50,stroke-width:2px,color:white
    classDef sidebarStyle fill:#f39c12,stroke:#e67e22,stroke-width:2px,color:white
    classDef contentStyle fill:#27ae60,stroke:#229954,stroke-width:2px,color:white
    classDef moduleStyle fill:#9b59b6,stroke:#8e44ad,stroke-width:2px,color:white

    class MOBILE_HEADER,HAMBURGER,APP_TITLE headerStyle
    class SIDEBAR_MENU,MENU_SECTIONS,SECT_DASHBOARD,SECT_EXPENSES,SECT_SERVICES,SECT_PROPERTIES,SECT_USERS,SECT_REPORTS sidebarStyle
    class MAIN_CONTENT,CONTENT_TYPES contentStyle
    class DASHBOARD_VIEW,MODULE_VIEW moduleStyle
```

## Wireframe Dashboard - Vista Inicio

```mermaid
flowchart TD
    subgraph DASHBOARD_LAYOUT["🎯 Dashboard Inicio - Contenido"]
        subgraph QUICK_ACCESS["🚀 Acceso Rápido"]
            subgraph CARDS_ROW1["Tarjetas Fila 1"]
                CARD_EXPENSES["💰 Expensas<br/>Ver/Gestionar<br/>Expensas"]
                CARD_PAYMENTS["💳 Pagos<br/>Pagar<br/>Pendientes"]
                CARD_CATEGORIES["📋 Categorías<br/>Gestionar<br/>Categorías"]
            end

            subgraph CARDS_ROW2["Tarjetas Fila 2"]
                CARD_SERVICES["🔧 Servicios<br/>Expensas de<br/>Servicio"]
                CARD_PROPERTIES["🏢 Propiedades<br/>Gestionar<br/>Propiedades"]
                CARD_USERS["👥 Usuarios<br/>Administrar<br/>Usuarios"]
            end

            subgraph CARDS_ROW3["Tarjetas Fila 3"]
                CARD_OWNERS["🏠👤 Propietarios<br/>Gestión de<br/>Propietarios"]
                CARD_ROLES["🎭 Roles<br/>Configurar<br/>Permisos"]
                CARD_REPORTS["📊 Reportes<br/>Ver<br/>Estadísticas"]
            end
        end

        subgraph SUMMARY_SECTION["📊 Sección Resumen"]
            subgraph DEBTS_PANEL["💳 Panel Deudas"]
                DEBTS_TITLE["📋 Deudas Pendientes"]
                DEBTS_LIST["├─ P001: $150.75<br/>├─ P002: $89.50<br/>└─ Total: $240.25"]
                PAY_BUTTON["💳 Pagar Ahora"]
            end

            subgraph ANNOUNCEMENTS["📢 Anuncios"]
                ANNOUNCE_TITLE["📣 Comunicados"]
                ANNOUNCE_LIST["├─ Corte agua viernes 10am<br/>├─ Junta sábado 5pm<br/>└─ Mantenimiento ascensor"]
            end
        end

        subgraph ROLE_BASED["🎭 Visibilidad por Roles"]
            ADMIN_VIEW["🔧 Admin: Ve todo"]
            DIRECTOR_VIEW["👔 Director: Aprobaciones"]
            HABITANTE_VIEW["🏠 Habitante: Sus datos"]
            AUX_VIEW["📝 Auxiliar: Operaciones"]
        end
    end

    CARD_EXPENSES -.-> |Click| QUICK_ACCESS
    CARD_PAYMENTS -.-> |Click| DEBTS_PANEL
    CARD_CATEGORIES -.-> |Click| QUICK_ACCESS
    CARD_SERVICES -.-> |Click| QUICK_ACCESS
    CARD_PROPERTIES -.-> |Click| QUICK_ACCESS
    CARD_USERS -.-> |Click| QUICK_ACCESS
    CARD_OWNERS -.-> |Click| QUICK_ACCESS
    CARD_ROLES -.-> |Click| ROLE_BASED
    CARD_REPORTS -.-> |Click| QUICK_ACCESS

    PAY_BUTTON -.-> |Navegar| CARD_PAYMENTS

    classDef cardStyle fill:#3498db,stroke:#2980b9,stroke-width:2px,color:white
    classDef summaryStyle fill:#e74c3c,stroke:#c0392b,stroke-width:2px,color:white
    classDef announceStyle fill:#f39c12,stroke:#e67e22,stroke-width:2px,color:white
    classDef roleStyle fill:#9b59b6,stroke:#8e44ad,stroke-width:2px,color:white

    class QUICK_ACCESS,CARDS_ROW1,CARDS_ROW2,CARDS_ROW3,CARD_EXPENSES,CARD_PAYMENTS,CARD_CATEGORIES,CARD_SERVICES,CARD_PROPERTIES,CARD_USERS,CARD_OWNERS,CARD_ROLES,CARD_REPORTS cardStyle
    class SUMMARY_SECTION,DEBTS_PANEL,DEBTS_TITLE,DEBTS_LIST,PAY_BUTTON summaryStyle
    class ANNOUNCEMENTS,ANNOUNCE_TITLE,ANNOUNCE_LIST announceStyle
    class ROLE_BASED,ADMIN_VIEW,DIRECTOR_VIEW,HABITANTE_VIEW,AUX_VIEW roleStyle
```

## Wireframe Módulo CRUD - Vista de Expensas

```mermaid
flowchart TD
    subgraph MODULE_LAYOUT["📋 Layout Módulo CRUD - Expensas"]
        subgraph TOOLBAR["🔧 Barra de Herramientas"]
            TITLE_MODULE["💰 Gestión de Expensas"]
            ACTION_BUTTONS["➕ Nueva | 🔄 Actualizar | 📤 Exportar"]
            SEARCH_BAR["🔍 Buscar expensas..."]
            FILTER_OPTIONS["🎯 Filtros: Estado | Categoría | Fecha"]
        end

        subgraph DATA_TABLE["📊 Tabla de Datos"]
            TABLE_HEADER["🏷️ Headers<br/>├─ ID<br/>├─ Categoría<br/>├─ Propiedad<br/>├─ Monto<br/>├─ Estado<br/>├─ Fecha Límite<br/>└─ Acciones"]

            subgraph TABLE_ROWS["🗂️ Filas de Datos"]
                ROW1["📄 Fila 1: Exp001 | Mantenimiento | P001 | $150 | Pendiente | 15/03"]
                ROW2["📄 Fila 2: Exp002 | Limpieza | P002 | $89 | Pagada | 10/03"]
                ROW3["📄 Fila 3: Exp003 | Seguridad | P003 | $120 | Vencida | 05/03"]
            end

            TABLE_ACTIONS["⚙️ Acciones por Fila<br/>👁️ Ver | ✏️ Editar | 🗑️ Eliminar"]
        end

        subgraph PAGINATION["📄 Paginación"]
            PAGE_INFO["Mostrando 1-10 de 250 registros"]
            PAGE_CONTROLS["⬅️ Anterior | 1 2 3 ... 25 | Siguiente ➡️"]
            PAGE_SIZE["Mostrar: 10 | 25 | 50 por página"]
        end

        subgraph MODAL_FORMS["📝 Formularios Modal"]
            subgraph CREATE_FORM["➕ Modal Crear"]
                FORM_TITLE_C["Nueva Expensa"]
                FORM_FIELDS_C["📋 Campos:<br/>├─ Categoría [Select]<br/>├─ Propiedad [Select]<br/>├─ Monto [Number]<br/>├─ Descripción [Text]<br/>├─ Fecha Inicio [Date]<br/>├─ Fecha Límite [Date]<br/>└─ Estado [Select]"]
                FORM_ACTIONS_C["💾 Guardar | ❌ Cancelar"]
            end

            subgraph EDIT_FORM["✏️ Modal Editar"]
                FORM_TITLE_E["Editar Expensa #123"]
                FORM_FIELDS_E["📋 Campos Pre-llenados"]
                FORM_ACTIONS_E["💾 Actualizar | ❌ Cancelar"]
            end

            subgraph VIEW_MODAL["👁️ Modal Ver Detalles"]
                DETAIL_TITLE["Detalle Expensa #123"]
                DETAIL_INFO["📊 Información Completa<br/>├─ Fecha Creación<br/>├─ Usuario Creador<br/>├─ Historial Pagos<br/>├─ Intereses Calculados<br/>└─ Observaciones"]
                DETAIL_ACTIONS["✏️ Editar | 🗑️ Eliminar | ❌ Cerrar"]
            end
        end
    end

    ACTION_BUTTONS -.->|➕ Nueva| CREATE_FORM
    TABLE_ACTIONS -.->|✏️ Editar| EDIT_FORM
    TABLE_ACTIONS -.->|👁️ Ver| VIEW_MODAL
    SEARCH_BAR -.-> TABLE_ROWS
    FILTER_OPTIONS -.-> TABLE_ROWS
    PAGE_CONTROLS -.-> TABLE_ROWS

    classDef toolbarStyle fill:#34495e,stroke:#2c3e50,stroke-width:2px,color:white
    classDef tableStyle fill:#3498db,stroke:#2980b9,stroke-width:2px,color:white
    classDef paginationStyle fill:#95a5a6,stroke:#7f8c8d,stroke-width:2px,color:white
    classDef modalStyle fill:#e74c3c,stroke:#c0392b,stroke-width:2px,color:white
    classDef formStyle fill:#27ae60,stroke:#229954,stroke-width:2px,color:white

    class TOOLBAR,TITLE_MODULE,ACTION_BUTTONS,SEARCH_BAR,FILTER_OPTIONS toolbarStyle
    class DATA_TABLE,TABLE_HEADER,TABLE_ROWS,ROW1,ROW2,ROW3,TABLE_ACTIONS tableStyle
    class PAGINATION,PAGE_INFO,PAGE_CONTROLS,PAGE_SIZE paginationStyle
    class MODAL_FORMS,CREATE_FORM,EDIT_FORM,VIEW_MODAL modalStyle
    class FORM_TITLE_C,FORM_FIELDS_C,FORM_ACTIONS_C,FORM_TITLE_E,FORM_FIELDS_E,FORM_ACTIONS_E,DETAIL_TITLE,DETAIL_INFO,DETAIL_ACTIONS formStyle
```

## Estados Responsivos - Móvil vs Desktop

```mermaid
flowchart LR
    subgraph MOBILE["📱 Vista Mobile"]
        subgraph MOB_HEADER["Header Mobile"]
            MOB_HAMBURGER["🍔"]
            MOB_TITLE["Admin Condos"]
        end

        subgraph MOB_SIDEBAR["Sidebar (Overlay)"]
            MOB_MENU["📋 Menú<br/>Ocupa 70% ancho<br/>Overlay modal"]
        end

        subgraph MOB_CONTENT["Contenido"]
            MOB_MAIN["📄 100% ancho<br/>Scroll vertical<br/>Cards apiladas"]
        end
    end

    subgraph DESKTOP["💻 Vista Desktop"]
        subgraph DESK_HEADER["Header Desktop"]
            DESK_HAMBURGER["🍔"]
            DESK_TITLE["Sistema Administración Condominios"]
        end

        subgraph DESK_SIDEBAR["Sidebar Fijo"]
            DESK_MENU["📋 200px ancho<br/>Siempre visible<br/>en pantallas grandes"]
        end

        subgraph DESK_CONTENT["Contenido"]
            DESK_MAIN["📄 Resto del ancho<br/>Grid layout<br/>Cards en filas"]
        end
    end

    MOB_HAMBURGER -.-> MOB_SIDEBAR
    DESK_HAMBURGER -.-> DESK_SIDEBAR

    classDef mobileStyle fill:#e74c3c,stroke:#c0392b,stroke-width:2px,color:white
    classDef desktopStyle fill:#27ae60,stroke:#229954,stroke-width:2px,color:white

    class MOBILE,MOB_HEADER,MOB_SIDEBAR,MOB_CONTENT,MOB_HAMBURGER,MOB_TITLE,MOB_MENU,MOB_MAIN mobileStyle
    class DESKTOP,DESK_HEADER,DESK_SIDEBAR,DESK_CONTENT,DESK_HAMBURGER,DESK_TITLE,DESK_MENU,DESK_MAIN desktopStyle
```

## Flujo de Navegación y Estados

```mermaid
flowchart TD
    START([Inicio de Aplicación]) --> LOGIN[Login Page]

    LOGIN -->|Credenciales Válidas| DASHBOARD[Dashboard Principal]
    LOGIN -->|Error de Autenticación| LOGIN

    DASHBOARD --> INICIO[Inicio Content]

    subgraph DASH_FLOW["Dashboard Navigation"]
        INICIO --> |Click Tarjeta/Menú| MODULES[Module Content]
        MODULES --> |Click Inicio| INICIO

        subgraph MODULE_STATES["Module CRUD States"]
            MODULES --> LIST_VIEW[Lista/Tabla]
            LIST_VIEW --> |Crear Nuevo| CREATE_FORM[Formulario Crear]
            LIST_VIEW --> |Editar| EDIT_FORM[Formulario Editar]
            LIST_VIEW --> |Ver Detalle| DETAIL_VIEW[Vista Detalle]

            CREATE_FORM --> |Guardar| LIST_VIEW
            CREATE_FORM --> |Cancelar| LIST_VIEW
            EDIT_FORM --> |Actualizar| DETAIL_VIEW
            EDIT_FORM --> |Cancelar| LIST_VIEW
            DETAIL_VIEW --> |Editar| EDIT_FORM
            DETAIL_VIEW --> |Cerrar| LIST_VIEW
        end
    end

    DASHBOARD -->|Logout| LOGIN
    DASHBOARD -->|Refresh Token| DASHBOARD

    classDef startStyle fill:#e74c3c,stroke:#c0392b,stroke-width:2px,color:white
    classDef loginStyle fill:#f39c12,stroke:#e67e22,stroke-width:2px,color:white
    classDef dashStyle fill:#3498db,stroke:#2980b9,stroke-width:2px,color:white
    classDef moduleStyle fill:#27ae60,stroke:#229954,stroke-width:2px,color:white
    classDef crudStyle fill:#9b59b6,stroke:#8e44ad,stroke-width:2px,color:white

    class START startStyle
    class LOGIN loginStyle
    class DASHBOARD,INICIO dashStyle
    class MODULES moduleStyle
    class LIST_VIEW,CREATE_FORM,EDIT_FORM,DETAIL_VIEW crudStyle
```

### Estados y Comportamientos por Componente

#### 🔐 **Login Page**

- **Loading**: Durante validación de credenciales
- **Error**: Mensaje de error por credenciales inválidas
- **Form Validation**: Validación en tiempo real de campos

#### 🏠 **Dashboard - Inicio**

- **Role-based**: Contenido adaptado según rol de usuario
- **Quick Access**: Tarjetas de navegación rápida
- **Summary**: Panel de deudas y anuncios

#### 📋 **Módulos CRUD**

- **List View**: Tabla con paginación, búsqueda y filtros
- **Create Form**: Modal/página para crear nuevos registros
- **Edit Form**: Modal/página para editar registros existentes
- **Detail View**: Vista completa de un registro específico

#### 🔄 **Estados Globales**

- **Authentication**: Control de sesión y tokens JWT
- **Loading**: Indicadores de carga durante operaciones
- **Error Handling**: Manejo centralizado de errores
- **Role Management**: Control de permisos y visibilidad

### **🏗️ Arquitectura del Frontend**

**Estructura Principal:**

1. **App.tsx**: Componente raíz que maneja autenticación y routing
2. **LoginPage**: Página de inicio de sesión con validación
3. **LandingPage**: Layout principal con sidebar y área de contenido
4. **Componentes de Módulo**: Cada funcionalidad tiene su componente dedicado

### **📱 Layout Responsivo**

**Desktop:**

- Sidebar fijo de 200px de ancho
- Área de contenido que ocupa el resto del espacio
- Navegación siempre visible

**Mobile:**

- Hamburger menu que muestra/oculta sidebar
- Sidebar overlay que ocupa 70% del ancho de pantalla
- Contenido a 100% de ancho con padding superior
- Transiciones suaves para mejor UX

### **🔐 Sistema de Roles**

**Control de Acceso:**

- **Admin**: Acceso completo a todos los módulos
- **Director**: Gestión y aprobaciones
- **Auxiliar**: Operaciones CRUD básicas
- **Habitante**: Solo sus datos personales
- **Seguridad**: Módulos específicos de vigilancia

**Visibilidad Dinámica:**

- Menú se adapta según roles del usuario
- Componentes se muestran/ocultan según permisos
- Validación tanto en frontend como backend

### **🎯 Módulos Principales**

**Gestión de Expensas:**

- CRUD completo de expensas
- Categorización y filtrado
- Seguimiento de estados de pago
- Cálculo de intereses

**Gestión de Propiedades:**

- Administración de unidades
- Tipos de propiedades
- Gestión de propietarios

**Sistema de Usuarios:**

- Perfiles de usuario
- Asignación de roles
- Gestión de permisos

### **⚙️ Funcionalidades Técnicas**

**Estado Global:**

- Manejo de autenticación con JWT
- Context para roles de usuario
- Estados de loading y error

**Comunicación API:**

- Headers de autorización en todas las requests
- Manejo de tokens expirados
- Refresh automático de sesión

**UX/UI:**

- Feedback visual inmediato
- Modales para formularios
- Paginación en tablas grandes
- Búsqueda y filtrado en tiempo real

### **🚀 Instrucciones para Draw.io**

1. **Importar los diagramas Mermaid:**
   - Copia el código de cada diagrama Mermaid
   - En Draw.io, ve a "Insertar" → "Advanced" → "Mermaid"
   - Pega el código y ajusta el estilo

2. **Personalizar el diseño:**
   - Cambiar colores de las cajas según tu paleta
   - Ajustar tamaños y espaciado
   - Agregar iconos personalizados

3. **Crear vistas adicionales:**
   - Layout específico para cada módulo
   - Flujos de usuario detallados
   - Wireframes de formularios complejos

**¿Te gustaría que modifique alguna parte específica del diagrama o que agregue más detalles a alguna sección en particular?**
