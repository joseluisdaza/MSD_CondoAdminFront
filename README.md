# 🏢 MSD_CondoAdminFront

**Frontend Web para Sistema de Administración de Condominios**

Una aplicación web moderna y responsiva para la gestión integral de condominios construida con React 19, TypeScript y Vite.

> **📚 DOCUMENTACIÓN COMPLETA**: La documentación técnica detallada está disponible en la **[Wiki del Proyecto](https://github.com/joseluisdaza/MSD_CondoAdminFront/wiki)**. Este README proporciona un resumen rápido.

## 📋 Tabla de Contenidos

- [🚀 Inicio Rápido](#-inicio-rápido)
- [📚 Documentación Completa](#-documentación-completa)
- [✨ Características](#-características)
- [🛠️ Tecnologías](#️-tecnologías)
- [📋 Requisitos](#-requisitos)
- [💻 Desarrollo](#-desarrollo)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🤝 Contribución](#-contribución)
- [📚 Recursos Útiles](#-recursos-útiles)
- [📄 Licencia](#-licencia)

## ✨ Características

- **Gestión de Residentes**: Administración de usuarios con roles diferenciados (6 roles)
- **Dashboard Interactivo**: Panel de control con estadísticas y visualización de datos
- **Gestión de Gastos**: Registro, categorización y seguimiento de gastos del condominio
- **Sistema de Pagos**: Visualización y estado de pagos realizados
- **Administración de Recursos**: Gestión de espacios compartidos (salones, canchas) con reservas
- **Reportes de Incidentes**: Reporte y seguimiento de incidentes reportados
- **Navegación Inteligente**: Rutas protegidas basadas en roles y permisos
- **Diseño Responsivo**: Interfaz adaptada para desktop, tablet y móvil
- **Autenticación JWT**: Integración segura con API backend
- **Validación de Formularios**: Validación en tiempo real con feedback visual
- **TypeScript**: Tipado estricto para mayor seguridad en el código
- **Vite**: Build rápido con Hot Module Replacement (HMR)

## 🚀 Inicio Rápido

### Setup Local (3 minutos)

```bash
# 1. Clonar repositorio
git clone https://github.com/joseluisdaza/MSD_CondoAdminFront.git
cd MSD_CondoAdminFront/CondoFE

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (si es necesario)
cp .env.example .env

# 4. Iniciar servidor de desarrollo
npm run dev
```

**Aplicación disponible en**: `http://localhost:5173`

---

## 📚 Documentación Completa

La **Wiki del proyecto** contiene documentación técnica completa, guías de navegación y ejemplos:

### 📖 Fundamentos

- **[01 - Frontend Overview](https://github.com/joseluisdaza/MSD_CondoAdminFront/wiki/01-FRONTEND-OVERVIEW)** - Visión general, tech stack, arquitectura general
- **[03 - Estructura de Módulos](https://github.com/joseluisdaza/MSD_CondoAdminFront/wiki/03-ESTRUCTURA-MODULOS)** - Estructura de carpetas, componentes, hooks personalizados

### 🗺️ Navegación y Rutas

- **[02 - Rutas y Navegación](https://github.com/joseluisdaza/MSD_CondoAdminFront/wiki/02-RUTAS-Y-NAVEGACION)** - 17 rutas principales, navegación entre módulos
- **[05 - Flujo de Navegación](https://github.com/joseluisdaza/MSD_CondoAdminFront/wiki/05-FLUJO-NAVEGACION)** - Diagramas de flujo de navegación entre pantallas
- **[06 - Mapa Visual de Navegación](https://github.com/joseluisdaza/MSD_CondoAdminFront/wiki/06-MAPA-VISUAL-NAVEGACION)** - Wireframes y maquetas visuales de navegación

### 🔐 Seguridad y Roles

- **[04 - Sistema de Roles y Permisos](https://github.com/joseluisdaza/MSD_CondoAdminFront/wiki/04-SISTEMA-ROLES-PERMISOS)** - 6 roles, matriz de permisos, control de acceso por módulo

### 📡 Integración Backend

- **[07 - Endpoints de API](https://github.com/joseluisdaza/MSD_CondoAdminFront/wiki/07-API-ENDPOINTS)** - Integración con endpoints del backend, ejemplos de consumo

### 🎥 Demostraciones

- **[Home - Wiki](https://github.com/joseluisdaza/MSD_CondoAdminFront/wiki/Home)** - Índice de Wiki con 13 videos de demostración por feature

---

## 🛠️ Tecnologías

### **Core**

- **Framework**: React 19.1.0
- **Lenguaje**: TypeScript 5.8.3
- **Build Tool**: Vite 7.0.4
- **Package Manager**: npm

### **Enrutamiento y Estado**

- **React Router**: v6 para navegación entre vistas
- **Hooks**: useState, useContext, useEffect para gestión de estado

### **Estilos**

- **CSS3**: Estilos modulares y responsivos
- **Responsive Design**: Mobile-first, Tablet, Desktop

### **Validación y Formularios**

- **Validación en tiempo real**: Feedback visual inmediato
- **DTOs**: Tipado con TypeScript para requests/responses

### **Seguridad**

- **JWT**: Integración con autenticación backend
- **localStorage**: Almacenamiento seguro de tokens
- **Rutas Protegidas**: Control de acceso basado en roles

### **Desarrollo**

- **ESLint**: v9.30.1 para calidad de código
- **TypeScript Strict**: Verificación de tipos en tiempo de compilación

### **Versión del Proyecto**

- **Versión Actual**: v1.0
- **Última Actualización**: Julio 2025

## 📋 Requisitos

Asegúrate de tener instalado lo siguiente en tu sistema:

- **Node.js** (versión 18.0 o superior)
- **npm** (versión 8.0 o superior)
- **Git** (para control de versiones)
- **Backend API** ejecutándose en `https://localhost:7221` o en Render

Verificar instalaciones:

```bash
node --version
npm --version
git --version
```

## 💻 Desarrollo

### **Instalación**

```bash
# 1. Clonar repositorio
git clone https://github.com/joseluisdaza/MSD_CondoAdminFront.git
cd MSD_CondoAdminFront/CondoFE

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (opcional)
# Copiar .env.example a .env si existe
cp .env.example .env 2>/dev/null || true

# 4. Iniciar servidor de desarrollo
npm run dev
```

**URL de desarrollo**: `http://localhost:5173`

### **Scripts Disponibles**

| Script            | Descripción                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Inicia servidor de desarrollo            |
| `npm run build`   | Compila para producción                  |
| `npm run lint`    | Ejecuta ESLint para verificar código     |
| `npm run preview` | Visualiza build de producción localmente |

### **Variables de Entorno**

Crear archivo `.env` en `CondoFE/`:

```env
# API Backend
VITE_API_URL=https://localhost:7221/api

# Configuración de Aplicación
VITE_APP_NAME=CondoAdmin
VITE_APP_VERSION=1.0.0
```

**Para configuración detallada**, ver: [Frontend Overview](https://github.com/joseluisdaza/MSD_CondoAdminFront/wiki/01-FRONTEND-OVERVIEW)

## 📁 Estructura del Proyecto

```
MSD_CondoAdminFront/
├── README.md                        # Este archivo
├── Docs/                            # Documentación adicional
│   ├── component_class_diagram.drawio
│   ├── system_architecture_diagram.drawio
│   ├── wireframe_maquetado.md
│   └── C4/                          # Diagramas C4
│
├── MSD_CondoAdminFront.wiki/        # Wiki con documentación
│   ├── 01-FRONTEND-OVERVIEW.md
│   ├── 02-RUTAS-Y-NAVEGACION.md
│   ├── 03-ESTRUCTURA-MODULOS.md
│   ├── 04-SISTEMA-ROLES-PERMISOS.md
│   ├── 05-FLUJO-NAVEGACION.md
│   ├── 06-MAPA-VISUAL-NAVEGACION.md
│   ├── 07-API-ENDPOINTS.md
│   └── Home.md (con 13 videos de demostración)
│
└── CondoFE/                         # Aplicación React
    ├── public/                      # Archivos estáticos
    │   └── assets/
    │
    ├── src/                         # Código fuente
    │   ├── components/              # Componentes reutilizables
    │   │   ├── Common/              # Header, Navbar, Footer
    │   │   ├── Dashboard/           # Componentes del dashboard
    │   │   ├── Forms/               # Formularios reutilizables
    │   │   └── Layout/              # Componentes de layout
    │   │
    │   ├── pages/                   # Páginas/vistas principales
    │   │   ├── Dashboard.tsx
    │   │   ├── Users/               # Gestión de usuarios
    │   │   ├── Properties/          # Gestión de propiedades
    │   │   ├── Expenses/            # Gestión de gastos
    │   │   ├── Payments/            # Gestión de pagos
    │   │   ├── Resources/           # Gestión de recursos
    │   │   ├── Incidents/           # Reportes de incidentes
    │   │   ├── Reports/             # Visualización de reportes
    │   │   └── Auth/                # Login, logout
    │   │
    │   ├── hooks/                   # Custom React Hooks
    │   │   ├── useAuth.ts           # Hook de autenticación
    │   │   ├── useApi.ts            # Hook para llamadas API
    │   │   └── useRoles.ts          # Hook de control de roles
    │   │
    │   ├── services/                # Servicios de API
    │   │   ├── authService.ts       # Autenticación
    │   │   ├── apiClient.ts         # Cliente HTTP
    │   │   └── endpoints.ts         # Configuración de endpoints
    │   │
    │   ├── types/                   # Tipos TypeScript
    │   │   ├── models.ts            # Tipos de modelos
    │   │   ├── api.ts               # Tipos de respuestas API
    │   │   └── auth.ts              # Tipos de autenticación
    │   │
    │   ├── utils/                   # Utilidades
    │   │   ├── validators.ts        # Validadores de formularios
    │   │   ├── formatters.ts        # Formateadores de datos
    │   │   └── permissions.ts       # Control de permisos
    │   │
    │   ├── App.tsx                  # Componente raíz
    │   ├── main.tsx                 # Punto de entrada
    │   ├── App.css                  # Estilos principales
    │   └── index.css                # Estilos globales
    │
    ├── eslint.config.js             # Configuración ESLint
    ├── vite.config.ts               # Configuración Vite
    ├── tsconfig.json                # Configuración TypeScript
    ├── tsconfig.app.json            # TS específico de app
    ├── tsconfig.node.json           # TS para scripts de build
    ├── package.json                 # Dependencias
    ├── index.html                   # HTML principal
    └── README.md                    # Documentación CondoFE
```

**Para detalles de estructura de componentes:**
→ **[03 - Estructura de Módulos](https://github.com/joseluisdaza/MSD_CondoAdminFront/wiki/03-ESTRUCTURA-MODULOS)**

**Para detalles de rutas y navegación:**
→ **[02 - Rutas y Navegación](https://github.com/joseluisdaza/MSD_CondoAdminFront/wiki/02-RUTAS-Y-NAVEGACION)**

## 🤝 Contribución

1. **Fork** el proyecto
2. **Clone** tu fork: `git clone https://github.com/tu-usuario/MSD_CondoAdminFront.git`
3. **Crea una rama** para tu feature: `git checkout -b feature/amazing-feature`
4. **Commit** tus cambios: `git commit -m 'Add: amazing feature'`
5. **Push** a tu fork: `git push origin feature/amazing-feature`
6. **Abre un Pull Request** describiendo los cambios

### **Guías de Contribución**

- ✅ Sigue la estructura de carpetas establecida
- ✅ Usa TypeScript con tipos explícitos
- ✅ Mantén componentes pequeños y reutilizables
- ✅ Valida en el cliente antes de enviar al servidor
- ✅ Documenta funciones complejas
- ✅ Respeta las rutas protegidas por rol

---

## 📚 Recursos Útiles

### **Documentación**

- 📖 [Wiki Completa](https://github.com/joseluisdaza/MSD_CondoAdminFront/wiki) - Documentación técnica completa
- 📊 [Wireframes y Maquetas](https://github.com/joseluisdaza/MSD_CondoAdminFront/tree/main/Docs)
- 📈 [Diagramas C4](https://github.com/joseluisdaza/MSD_CondoAdminFront/tree/main/Docs/C4)

### **Guías de Navegación**

- 🗺️ [Rutas y Navegación](https://github.com/joseluisdaza/MSD_CondoAdminFront/wiki/02-RUTAS-Y-NAVEGACION) - Todas las rutas disponibles
- 🔐 [Roles y Permisos](https://github.com/joseluisdaza/MSD_CondoAdminFront/wiki/04-SISTEMA-ROLES-PERMISOS) - Control de acceso por módulo
- 📱 [Mapa Visual](https://github.com/joseluisdaza/MSD_CondoAdminFront/wiki/06-MAPA-VISUAL-NAVEGACION) - Visualización de navegación

### **Videos de Demostración**

- 🎥 [13 Videos Tutoriales](https://github.com/joseluisdaza/MSD_CondoAdminFront/wiki/Home) - Demostraciones por feature en la Wiki

### **Backend Relacionado**

- 🔗 [Backend API](https://github.com/joseluisdaza/MSD_CondoAdminBE)
- 📡 [API Reference](https://github.com/joseluisdaza/MSD_CondoAdminFront/wiki/07-API-ENDPOINTS)
- 🔐 [Backend Auth](https://github.com/joseluisdaza/MSD_CondoAdminBE/wiki/06-AUTENTICACION-AUTORIZACION)

### **Testing**

- 📋 [Test Cases](./CASOS_PRUEBA_EVIDENCIAS.md)

---

## 📄 Licencia

Este proyecto está bajo licencia **MIT**. Ver archivo de licencia para detalles.

---

## 👨‍💻 Autor

**Jose Luis Daza** - [GitHub](https://github.com/joseluisdaza)

Este proyecto es parte del programa **Maestría Fullstack**.

---

## 🎯 Próximos Pasos

- [ ] Implementar tests automatizados (Jest + React Testing Library)
- [ ] Mejorar accesibilidad (WCAG 2.1)
- [ ] Agregar soporte para temas oscuro/claro
- [ ] Optimizar performance con Code Splitting
- [ ] Integrar notificaciones en tiempo real (WebSockets)
- [ ] Exportar datos a PDF/Excel

---

**Desarrollado con ❤️ para la gestión eficiente de condominios**

[![Built with React](https://img.shields.io/badge/built%20with-React%2019-61DAFB?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/language-TypeScript%205.8-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/build-Vite%207-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

⭐ Si este proyecto te fue útil, ¡no olvides darle una estrella!
