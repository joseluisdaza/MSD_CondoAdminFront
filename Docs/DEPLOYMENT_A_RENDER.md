# Deploy del Frontend (CondoFE) en Render

Este documento describe los pasos detallados para desplegar el frontend en un host online para pruebas, usando **Render** (alineado con tu backend ya desplegado en Render).

## 1. Objetivo

Publicar el frontend de `CondoFE` en una URL pública y conectarlo al backend desplegado en Render.

## 2. Prerrequisitos

1. Repositorio del frontend en GitHub/GitLab.
2. Cuenta en Render.
3. URL pública del backend (ejemplo):
   - `https://tu-backend.onrender.com/api`
4. Node.js 20+ instalado localmente (recomendado) para validar build.

## 3. Preparar el frontend para producción

### 3.1 Parametrizar la URL del backend (importante)

Actualmente, el proyecto usa una URL fija local en `CondoFE/src/api/endpoints.ts`:

```ts
export const API_BASE_URL = "https://localhost:7221/api";
```

Para que funcione en producción, cámbialo por variable de entorno de Vite:

```ts
// src/api/endpoints.ts
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:7221/api";
```

Con eso, en Render podrás definir `VITE_API_BASE_URL` con la URL real del backend.

### 3.2 Crear archivos de entorno

En la carpeta `CondoFE`, crea:

- `.env.development`
- `.env.production`

Contenido sugerido:

```bash
# CondoFE/.env.development
VITE_API_BASE_URL=https://localhost:7221/api
```

```bash
# CondoFE/.env.production
VITE_API_BASE_URL=https://tu-backend.onrender.com/api
```

> Nota: en Render también vas a configurar esta variable desde el panel (se recomienda).

### 3.3 Validar build local

Desde `CondoFE`:

```bash
npm install
npm run build
npm run preview
```

Verifica en navegador que:

1. La app carga.
2. Login funciona.
3. Las llamadas API van a la URL esperada.

## 4. Desplegar en Render (Static Site)

### 4.1 Crear servicio en Render

1. Entra a Render Dashboard.
2. Click en **New +** -> **Static Site**.
3. Conecta tu repositorio.
4. Selecciona la rama a desplegar (ejemplo: `main`).

### 4.2 Configuración recomendada

Si el repo raíz es `MSD_CondoAdminFront` y el frontend está en `CondoFE`:

- **Root Directory**: `CondoFE`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

Variables de entorno en Render:

- `VITE_API_BASE_URL` = `https://tu-backend.onrender.com/api`
- (Opcional) `NODE_VERSION` = `20`

### 4.3 Deploy inicial

1. Guarda la configuración.
2. Ejecuta el primer deploy.
3. Espera estado **Live**.
4. Abre la URL pública generada por Render.

## 5. Configuración necesaria en backend (CORS)

Para que el frontend en Render consuma el backend, habilita CORS en tu API backend para el dominio del frontend.

Debes permitir:

1. Origin: `https://tu-frontend.onrender.com`
2. Métodos: `GET, POST, PUT, DELETE, OPTIONS`
3. Headers: `Authorization, Content-Type`

Si no se habilita CORS, verás errores en consola del navegador aunque el frontend esté desplegado correctamente.

## 6. Verificación post-deploy

Checklist rápida:

1. La URL pública carga sin error 404.
2. Login devuelve respuesta correcta.
3. Pantallas que consultan API cargan datos.
4. No hay errores de CORS en DevTools.
5. No hay llamadas a `localhost` en producción.

## 7. Actualizaciones futuras

Cada push a la rama conectada en Render dispara deploy automático.

Recomendación:

1. Usar rama `develop` para pruebas.
2. Usar rama `main` para versión estable.

## 8. Troubleshooting rápido

### Error: Build failed

1. Verifica `Root Directory` = `CondoFE`.
2. Verifica comando `npm install && npm run build`.
3. Revisa logs de build en Render.

### Error: Frontend carga pero API falla

1. Revisa `VITE_API_BASE_URL` en Render.
2. Confirma que backend responde en esa URL.
3. Revisa CORS en backend.

### Error: Sigue pegando a localhost

1. Confirma que `endpoints.ts` usa `import.meta.env.VITE_API_BASE_URL`.
2. Revisa variable en Render y relanza deploy.
3. Limpia cache del navegador y vuelve a probar.

---

Con estos pasos, el frontend queda desplegado en Render y conectado al backend online para pruebas end-to-end.
