# C4 Nivel 4: Diagrama de Clases - Frontend Condo Admin

## Visión General

Este diagrama de clases representa la arquitectura detallada del frontend de la aplicación Condo Admin a nivel de código (C4 Nivel 4). Muestra las clases principales, componentes React, hooks, servicios y modelos de datos con sus respectivas relaciones y dependencias.

## Diagrama

El diagrama de clases está disponible en formato draw.io: [11_frontend_class_diagram.drawio](./11_frontend_class_diagram.drawio)

Para visualizar el diagrama:

1. Abre el archivo `11_frontend_class_diagram.drawio` en [draw.io](https://app.diagrams.net/)
2. O utiliza la extensión de draw.io en VS Code para verlo directamente en el editor

### Colores del Diagrama:

- **Púrpura**: Componentes Principales (App, LoginPage, LandingPage)
- **Verde**: Componentes de Contenido (InicioContent, ExpensasContent, etc.)
- **Amarillo**: Hooks (UseUserRole)
- **Rojo**: Servicios (APIEndpoints, I18nResources)
- **Azul**: Modelos de Datos (User, Expense, Property, etc.)
- **Gris**: Enumeraciones (UserRole, SupportedLang)

## Componentes de la Arquitectura

### 1. Componentes Principales y Páginas

#### App

- **Responsabilidad**: Componente raíz de la aplicación
- **Estado**: Maneja el token de autenticación global
- **Funciones**: Controla el enrutamiento entre LoginPage y LandingPage

#### LoginPage

- **Responsabilidad**: Gestionar el proceso de autenticación
- **Estado**: login, password, error, loading, lang (idioma)
- **Funciones**: handleSubmit para autenticar usuarios
- **Dependencias**: APIEndpoints, I18nResources

#### LandingPage

- **Responsabilidad**: Dashboard principal de la aplicación
- **Estado**: debts, announcements, sidebarOpen, loading
- **Funciones**: Renderizar módulos específicos según permisos de usuario
- **Dependencias**: UseUserRole, APIEndpoints, múltiples componentes de contenido

### 2. Componentes de Contenido por Módulo

#### InicioContent

- **Responsabilidad**: Dashboard de inicio con navegación y resümenes
- **Funciones**: Mostrar tarjetas de navegación filtradas por rol
- **Dependencias**: UseUserRole, NavigationCard, Debt

#### ExpensasContent

- **Responsabilidad**: CRUD completo de expensas
- **Estado**: expenses, properties, expenseCategories, paymentStatuses
- **Funciones**: fetchExpenses, createExpense, updateExpense, deleteExpense
- **Dependencias**: APIEndpoints, múltiples modelos de datos

#### UsuariosContent

- **Responsabilidad**: Gestión de usuarios del sistema
- **Estado**: users, editingUser, formData, passwordData
- **Funciones**: CRUD de usuarios y cambio de contraseñas
- **Dependencias**: APIEndpoints, User

#### Otros Componentes de Contenido

- PropiedadesContent: Gestión de propiedades
- PagosContent: Gestión de pagos
- ReportesContent: Generación y visualización de reportes

### 3. Hooks Personalizados

#### UseUserRole

- **Responsabilidad**: Gestión de roles y permisos de usuario
- **Estado**: userRoles, userInfo, loading, error
- **Funciones**: hasRole, hasAnyRole, canViewModule
- **Funcionalidad**: Decodifica JWT para extraer información de usuario y roles

### 4. Servicios

#### APIEndpoints

- **Responsabilidad**: Centralizar todas las URLs de endpoints del API
- **Configuración**: API_BASE_URL y objeto ENDPOINTS con todas las rutas

#### I18nResources

- **Responsabilidad**: Manejo de internacionalización
- **Funciones**: t() para traducción de textos
- **Soporte**: Inglés y Español

### 5. Modelos de Datos (Interfaces/Types)

#### Entidades Principales

- **User**: Información básica del usuario
- **UserInfo**: Información del usuario con roles
- **Expense**: Expensa con toda su información financiera
- **Property**: Propiedad del condominio
- **ExpenseCategory**: Categoría de expensas
- **PaymentStatus**: Estado de pago

#### Tipos Auxiliares

- **Debt**: Deuda pendiente
- **NavigationCard**: Tarjeta de navegación del dashboard

#### Enumeraciones

- **UserRole**: admin, super, director, habitante, auxiliar, seguridad
- **SupportedLang**: en, es

## Patrones de Diseño Utilizados

### 1. **Component Pattern**

- Cada módulo funcional está encapsulado en su propio componente
- Separación clara entre presentación y lógica de negocio

### 2. **Hook Pattern**

- UseUserRole encapsula lógica reutilizable para manejo de roles
- Estado y efectos centralizados para autenticación y permisos

### 3. **Service Layer Pattern**

- APIEndpoints actúa como capa de servicio para comunicación con backend
- I18nResources como servicio de localización

### 4. **DTO Pattern**

- Interfaces bien definidas para todos los objetos de datos
- Tipado fuerte con TypeScript para validación en tiempo de compilación

## Flujo de Datos Principal

1. **Autenticación**: LoginPage → APIEndpoints → App (token storage)
2. **Autorización**: LandingPage → UseUserRole → JWT decode → Role validation
3. **Navegación**: InicioContent → NavigationCard → canViewModule → Conditional rendering
4. **CRUD Operations**: Content Components → APIEndpoints → Backend API

## Consideraciones de Seguridad

- **JWT Validation**: UseUserRole decodifica y valida tokens JWT
- **Role-based Access**: canViewModule controla acceso a módulos
- **Token Management**: App mantiene token de sesión de forma segura

## Tecnologías y Dependencias

- **React 18+**: Framework principal
- **TypeScript**: Tipado estático
- **React Router**: Navegación
- **JWT**: Autenticación y autorización
- **Fetch API**: Comunicación HTTP

## Escalabilidad y Mantenimiento

### Extensibilidad

- **Nuevos Módulos**: Crear nuevo componente Content e incluir en LandingPage
- **Nuevos Roles**: Agregar a enum UserRole y actualizar canViewModule
- **Nuevos Idiomas**: Extender SupportedLang y resources

### Mantenimiento

- **Separación de Responsabilidades**: Cada componente tiene una responsabilidad específica
- **Tipado Fuerte**: TypeScript previene errores en tiempo de compilación
- **Endpoints Centralizados**: Fácil actualización de URLs de API

---

_Este diagrama representa la arquitectura actual del frontend y debe actualizarse cuando se agreguen nuevos componentes o se modifique la estructura existente._
