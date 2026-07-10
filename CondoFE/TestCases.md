# Test Cases - Sistema de Administración de Condominios (Frontend)

**Fecha:** 2026-07-09  
**Proyecto:** MSD_CondoAdminFront  
**Versión:** 1.0

---

## Tabla de Contenidos

1. [Authentication & Login](#authentication--login)
2. [Navigation & Sidebar](#navigation--sidebar)
3. [Dashboard / Inicio](#dashboard--inicio)
4. [Expensas (Gastos Comunes)](#expensas-gastos-comunes)
5. [Pagos](#pagos)
6. [Propiedades](#propiedades)
7. [Usuarios](#usuarios)
8. [Recursos](#recursos)
9. [Reservas](#reservas)
10. [Incidentes](#incidentes)
11. [Reportes](#reportes)
12. [Configuración](#configuración)

---

## Authentication & Login

### TC-AUTH-001: Login con credenciales válidas

**Título:** Autenticación exitosa con email y contraseña válidos

**Pasos:**

1. Navegar a la página de login
2. Ingresar email válido en el campo "Login"
3. Ingresar contraseña válida en el campo "Password"
4. Hacer clic en el botón "Entrar"

**Resultado Esperado:**

- La aplicación realiza una petición POST a `/api/login`
- Se recibe un token de autenticación
- El token se almacena en localStorage
- El usuario es redirigido a la página principal (Dashboard)
- Se visualiza el nombre del usuario en la interfaz

---

### TC-AUTH-002: Login con credenciales inválidas

**Título:** Mensaje de error al ingresar credenciales incorrectas

**Pasos:**

1. Navegar a la página de login
2. Ingresar email/login incorrecto
3. Ingresar contraseña incorrecta
4. Hacer clic en el botón "Entrar"

**Resultado Esperado:**

- La petición POST retorna error (401 Unauthorized)
- Se muestra mensaje de error en rojo: "Credenciales inválidas"
- El usuario permanece en la página de login
- No se almacena ningún token
- Los campos de entrada no se limpian

---

### TC-AUTH-003: Login sin completar campos

**Título:** Validación de campos vacíos en el login

**Pasos:**

1. Navegar a la página de login
2. Dejar campos de email y contraseña vacíos
3. Hacer clic en el botón "Entrar"

**Resultado Esperado:**

- Aparece mensaje de validación: "Por favor complete todos los campos"
- No se realiza petición al servidor
- El usuario permanece en la página de login

---

### TC-AUTH-004: Cambio de idioma en login

**Título:** Cambiar idioma de la interfaz de login

**Pasos:**

1. Estar en la página de login
2. Hacer clic en el botón de idioma (EN / ES)
3. Seleccionar idioma diferente al actual

**Resultado Esperado:**

- Todos los textos de la página cambian al idioma seleccionado
- El cambio persiste hasta que se cierre la sesión
- Los botones y labels se actualizan correctamente

---

### TC-AUTH-005: Session persistence - Token guardado

**Título:** Mantener sesión al recargar la página

**Pasos:**

1. Realizar login exitosamente
2. Presionar F5 para recargar la página
3. Esperar a que cargue la aplicación

**Resultado Esperado:**

- El token se recupera de localStorage
- El usuario permanece autenticado
- No es necesario hacer login nuevamente
- La página principal se carga correctamente

---

### TC-AUTH-006: Logout

**Título:** Cerrar sesión y limpiar datos

**Pasos:**

1. Estar logueado en la aplicación
2. Hacer clic en la opción "Cerrar Sesión" o "Logout"
3. Confirmar la acción

**Resultado Esperado:**

- El token se elimina de localStorage
- Se redirige a la página de login
- Los datos de sesión se limpian
- Es necesario hacer login nuevamente para acceder

---

## Navigation & Sidebar

### TC-NAV-001: Visualización de sidebar con roles

**Título:** Mostrar opciones de menú según el rol del usuario

**Pasos:**

1. Loguearse como usuario con rol "admin"
2. Observar el menú lateral
3. Loguearse como usuario con rol "habitante"
4. Observar el menú lateral nuevamente

**Resultado Esperado:**

- Usuario admin ve todas las opciones del menú (18+ opciones)
- Usuario habitante solo ve opciones permitidas (Dashboard, Mi Perfil, Mis Propiedades)
- Las opciones se cargan según los permisos del rol
- No aparecen opciones para las cuales el usuario no tiene acceso

---

### TC-NAV-002: Abrir y cerrar hamburger menu

**Título:** Toggle del menú hamburguesa en dispositivos móviles

**Pasos:**

1. Acceder en dispositivo mobile o viewport pequeño (< 768px)
2. Hacer clic en el botón hamburguesa (☰)
3. Verificar que el menú se abre
4. Hacer clic en el botón nuevamente

**Resultado Esperado:**

- El menú se abre mostrando todos los enlaces
- El menú se cierra al hacer clic nuevamente
- El contenido se desplaza o se sobrepone correctamente
- Los enlaces son accesibles

---

### TC-NAV-003: Navegación entre secciones

**Título:** Cambiar entre diferentes secciones del sistema

**Pasos:**

1. Estar en la página de Dashboard
2. Hacer clic en "Expensas" del menú
3. Esperar a que cargue la página
4. Hacer clic en "Usuarios" del menú

**Resultado Esperado:**

- Cada clic cambia la URL correctamente
- El contenido se actualiza sin recargar completamente
- El menú marca la opción activa
- No hay errores de consola (console.error)

---

### TC-NAV-004: Links del menú funcionan correctamente

**Título:** Todos los links de navegación son accesibles

**Pasos:**

1. Para cada opción en el menú lateral
2. Hacer clic en el link
3. Verificar que se carga la página

**Resultado Esperado:**

- Cada link funciona y redirige correctamente
- No hay links rotos (404)
- Las páginas cargan sin errores
- Se muestra el contenido esperado

---

## Dashboard / Inicio

### TC-DASH-001: Carga del dashboard

**Título:** Dashboard carga correctamente al entrar

**Pasos:**

1. Loguearse exitosamente
2. Se redirige automáticamente al Dashboard
3. Esperar a que cargue completamente

**Resultado Esperado:**

- Se muestra título "Bienvenida" o "Dashboard"
- Se visualizan las tarjetas de navegación principales
- Los datos se cargan sin errores
- No hay spinner o loading infinito

---

### TC-DASH-002: Visualizar tarjetas de navegación

**Título:** Mostrar cards con resumen de información

**Pasos:**

1. Estar en el Dashboard
2. Verificar cada tarjeta visible
3. Hacer clic en una tarjeta

**Resultado Esperado:**

- Se muestran tarjetas para: Expensas, Pagos, Propiedades, etc.
- Cada tarjeta muestra un ícono y título
- Al hacer clic, navega a la sección correspondiente
- La tarjeta tiene efecto hover

---

### TC-DASH-003: Roles del usuario cargados

**Título:** Mostrar roles del usuario en el dashboard

**Pasos:**

1. Loguearse como usuario
2. Ir al Dashboard
3. Buscar información de roles

**Resultado Esperado:**

- Se obtienen correctamente los roles del usuario
- Se usan para filtrar opciones de menú
- El usuario solo ve funcionalidades permitidas
- Se ejecuta el hook useUserRole correctamente

---

## Expensas (Gastos Comunes)

### TC-EXP-001: Listar expensas

**Título:** Mostrar tabla de expensas

**Pasos:**

1. Loguearse y navegar a "Expensas"
2. Esperar a que cargue la tabla
3. Verificar los datos mostrados

**Resultado Esperado:**

- Se muestra una tabla con las expensas
- Las columnas incluyen: ID, Descripción, Monto, Fecha, Estado
- Se visualizan al menos 10 registros
- La tabla tiene paginación si hay más registros

---

### TC-EXP-002: Filtrar expensas por fecha

**Título:** Aplicar filtros a la tabla de expensas

**Pasos:**

1. Estar en la página de Expensas
2. Hacer clic en el campo de filtro "Fecha Inicio"
3. Seleccionar una fecha
4. Hacer clic en "Aplicar Filtro"

**Resultado Esperado:**

- La tabla se actualiza mostrando solo expensas de la fecha seleccionada
- La petición GET se realiza con los parámetros correctos
- Se muestra mensaje si no hay resultados
- El filtro se puede limpiar

---

### TC-EXP-003: Crear nueva expensa

**Título:** Agregar una nueva expensa al sistema

**Pasos:**

1. Estar en la página de Expensas
2. Hacer clic en botón "+ Nueva Expensa"
3. Completar el formulario:
   - Descripción: "Mantenimiento"
   - Monto: "5000"
   - Categoría: "Servicios"
4. Hacer clic en "Guardar"

**Resultado Esperado:**

- Se abre un modal o formulario
- Se realiza POST a `/api/expensas`
- Se muestra mensaje de éxito
- La tabla se actualiza con la nueva expensa
- El modal se cierra

---

### TC-EXP-004: Editar expensa existente

**Título:** Modificar datos de una expensa

**Pasos:**

1. Estar en la tabla de Expensas
2. Hacer clic en el botón "Editar" de una expensa
3. Cambiar el monto
4. Hacer clic en "Guardar"

**Resultado Esperado:**

- Se abre modal con los datos pre-cargados
- Se puede modificar cualquier campo
- Se realiza PUT a `/api/expensas/{id}`
- La tabla se actualiza con los nuevos datos
- Se muestra confirmación de éxito

---

### TC-EXP-005: Eliminar expensa

**Título:** Borrar una expensa del sistema

**Pasos:**

1. Estar en la tabla de Expensas
2. Hacer clic en botón "Eliminar" de una expensa
3. Confirmar la eliminación en el modal

**Resultado Esperado:**

- Aparece modal de confirmación
- Se realiza DELETE a `/api/expensas/{id}`
- La expensa se elimina de la tabla
- Se muestra mensaje de confirmación
- La tabla se actualiza automáticamente

---

## Pagos

### TC-PAG-001: Listar pagos realizados

**Título:** Mostrar historial de pagos

**Pasos:**

1. Loguearse y navegar a "Pagos"
2. Esperar a que cargue la página
3. Verificar la tabla de pagos

**Resultado Esperado:**

- Se muestra tabla con pagos realizados
- Columnas: ID, Propiedad, Monto, Fecha, Método de Pago, Estado
- Se visualizan registros con información completa
- Hay paginación si hay muchos registros

---

### TC-PAG-002: Registrar nuevo pago

**Título:** Crear un nuevo pago

**Pasos:**

1. Estar en la página de Pagos
2. Hacer clic en "+ Nuevo Pago"
3. Seleccionar propiedad
4. Ingresar monto
5. Seleccionar método de pago (Transferencia/Efectivo/Tarjeta)
6. Hacer clic en "Guardar"

**Resultado Esperado:**

- Se abre formulario de pago
- Se realiza POST a `/api/pagos`
- Se muestra confirmación de pago exitoso
- Se genera comprobante o referencia
- La tabla se actualiza

---

### TC-PAG-003: Ver detalles de pago

**Título:** Visualizar información detallada de un pago

**Pasos:**

1. Estar en la tabla de Pagos
2. Hacer clic en un registro de pago
3. Se abre modal o página de detalles

**Resultado Esperado:**

- Se muestran todos los datos del pago
- Incluye: Propiedad, Monto, Fecha, Referencia, Comprobante
- Se puede descargar el comprobante (PDF)
- Se puede imprimir

---

## Propiedades

### TC-PROP-001: Listar propiedades

**Título:** Mostrar tabla de propiedades del condominio

**Pasos:**

1. Loguearse y navegar a "Propiedades"
2. Esperar carga de datos
3. Verificar tabla

**Resultado Esperado:**

- Se muestra tabla con todas las propiedades
- Columnas: ID, Dirección, Tipo, Dueño, Estado, Acciones
- Se visualizan mínimo 10 propiedades
- Hay opción de búsqueda/filtro

---

### TC-PROP-002: Crear nueva propiedad

**Título:** Agregar una nueva propiedad

**Pasos:**

1. Estar en página de Propiedades
2. Hacer clic en "+ Nueva Propiedad"
3. Completar formulario:
   - Dirección: "Apt 101"
   - Tipo: "Departamento"
   - Piso: "1"
4. Hacer clic en "Guardar"

**Resultado Esperado:**

- Se abre formulario modal
- Se realiza POST a `/api/propiedades`
- Se validan campos requeridos
- Se muestra error si falta información
- Nueva propiedad aparece en tabla

---

### TC-PROP-003: Asignar dueño a propiedad

**Título:** Vincular propietario a una propiedad

**Pasos:**

1. Estar en página de Propiedades
2. Hacer clic en "Asignar Dueño" en una propiedad
3. Buscar/seleccionar dueño de lista
4. Hacer clic en "Asignar"

**Resultado Esperado:**

- Se abre modal con lista de dueños disponibles
- Se puede buscar por nombre
- Se selecciona el dueño
- Se realiza PUT/POST a `/api/propiedades/{id}/dueno`
- Se muestra confirmación

---

## Usuarios

### TC-USU-001: Listar usuarios

**Título:** Mostrar tabla de usuarios del sistema

**Pasos:**

1. Loguearse como admin
2. Navegar a "Usuarios"
3. Esperar carga de datos

**Resultado Esperado:**

- Se muestra tabla de usuarios
- Columnas: ID, Nombre, Email, Rol, Estado, Acciones
- Se visualizan todos los usuarios registrados
- Se puede buscar por nombre/email

---

### TC-USU-002: Crear nuevo usuario

**Título:** Registrar un nuevo usuario en el sistema

**Pasos:**

1. Estar en página de Usuarios
2. Hacer clic en "+ Nuevo Usuario"
3. Completar formulario:
   - Nombre: "Juan Pérez"
   - Email: "juan@example.com"
   - Rol: "Habitante"
   - Contraseña: "segura123"
4. Hacer clic en "Guardar"

**Resultado Esperado:**

- Se abre formulario modal
- Se valida email único
- Se valida contraseña (mín. 8 caracteres)
- Se realiza POST a `/api/usuarios`
- Usuario aparece en tabla
- Usuario recibe email de bienvenida

---

### TC-USU-003: Asignar rol a usuario

**Título:** Cambiar rol de un usuario

**Pasos:**

1. Estar en tabla de Usuarios
2. Hacer clic en "Editar" de un usuario
3. Cambiar rol a "Director"
4. Hacer clic en "Guardar"

**Resultado Esperado:**

- Se abre formulario de edición
- Se muestra dropdown con roles disponibles
- Se realiza PUT a `/api/usuarios/{id}`
- Rol se actualiza inmediatamente
- Usuario puede acceder a nuevas opciones según rol

---

### TC-USU-004: Eliminar usuario

**Título:** Dar de baja un usuario

**Pasos:**

1. Estar en tabla de Usuarios
2. Hacer clic en "Eliminar" de un usuario
3. Confirmar eliminación

**Resultado Esperado:**

- Se muestra modal de confirmación
- Se realiza DELETE a `/api/usuarios/{id}`
- Usuario se elimina de tabla
- Usuario no puede volver a loguearse
- Se muestra confirmación

---

## Recursos

### TC-REC-001: Listar recursos disponibles

**Título:** Mostrar tabla de recursos del condominio

**Pasos:**

1. Loguearse y navegar a "Recursos"
2. Esperar carga de datos
3. Verificar tabla

**Resultado Esperado:**

- Se muestra tabla de recursos (salón, cancha, etc.)
- Columnas: ID, Nombre, Descripción, Costo, Disponibilidad
- Se visualiza foto/imagen de recurso
- Se muestra disponibilidad actual

---

### TC-REC-002: Crear nuevo recurso

**Título:** Agregar un nuevo recurso

**Pasos:**

1. Estar en página de Recursos
2. Hacer clic en "+ Nuevo Recurso"
3. Completar formulario:
   - Nombre: "Salón de Eventos"
   - Descripción: "Capacidad 100 personas"
   - Costo por hora: "50"
4. Subir foto
5. Hacer clic en "Guardar"

**Resultado Esperado:**

- Se abre formulario modal
- Se puede subir imagen/foto
- Se realiza POST a `/api/recursos` con imagen
- Validación de campos requeridos
- Recurso aparece en tabla con imagen

---

## Reservas

### TC-RES-001: Listar reservas

**Título:** Mostrar calendario/tabla de reservas

**Pasos:**

1. Loguearse y navegar a "Reservas"
2. Esperar carga de datos
3. Verificar disponibilidad

**Resultado Esperado:**

- Se muestra calendario o tabla de reservas
- Se visualizan reservas próximas
- Se muestra estado: Confirmada/Pendiente/Cancelada
- Hay opción de filtrar por recurso

---

### TC-RES-002: Realizar una reserva

**Título:** Crear una nueva reserva de recurso

**Pasos:**

1. Estar en página de Reservas
2. Hacer clic en "+ Nueva Reserva" o en fecha disponible
3. Completar formulario:
   - Recurso: "Salón de Eventos"
   - Fecha: "2026-07-15"
   - Hora inicio: "14:00"
   - Hora fin: "16:00"
   - Propósito: "Reunión condominal"
4. Hacer clic en "Guardar"

**Resultado Esperado:**

- Se abre formulario de reserva
- Se muestran solo horarios disponibles
- Se calcula automáticamente el costo
- Se realiza POST a `/api/reservas`
- Se muestra confirmación con referencia
- Aparece en calendario

---

### TC-RES-003: Cancelar una reserva

**Título:** Cancelar una reserva existente

**Pasos:**

1. Estar en tabla/calendario de reservas
2. Hacer clic en una reserva confirmada
3. Hacer clic en botón "Cancelar"
4. Confirmar cancelación

**Resultado Esperado:**

- Se muestra modal de confirmación
- Se realiza DELETE/PUT a `/api/reservas/{id}`
- Reserva cambia estado a "Cancelada"
- Horario queda disponible nuevamente
- Se muestra confirmación

---

## Incidentes

### TC-INC-001: Listar incidentes

**Título:** Mostrar tabla de incidentes reportados

**Pasos:**

1. Loguearse y navegar a "Incidentes"
2. Esperar carga de datos
3. Verificar tabla

**Resultado Esperado:**

- Se muestra tabla de incidentes
- Columnas: ID, Tipo, Descripción, Propiedad, Fecha, Estado, Prioridad
- Se visualizan colores según prioridad (Rojo/Amarillo/Verde)
- Hay filtro por estado (Abierto/Cerrado/En Proceso)

---

### TC-INC-002: Reportar nuevo incidente

**Título:** Crear reporte de incidente

**Pasos:**

1. Estar en página de Incidentes
2. Hacer clic en "+ Nuevo Incidente"
3. Completar formulario:
   - Tipo: "Daño en infraestructura"
   - Descripción: "Goteras en el techo"
   - Ubicación: "Apt 301"
   - Prioridad: "Alta"
   - Fotos: Subir imagen
4. Hacer clic en "Guardar"

**Resultado Esperado:**

- Se abre formulario modal
- Se puede subir fotos del problema
- Se realiza POST a `/api/incidentes`
- Se asigna referencia/ticket
- Se muestra en tabla con estado "Abierto"
- Se envía notificación a administrador

---

### TC-INC-003: Cambiar estado de incidente

**Título:** Actualizar estado de un incidente

**Pasos:**

1. Estar en tabla de Incidentes
2. Hacer clic en un incidente
3. Cambiar estado a "En Proceso"
4. Agregar comentario: "Iniciamos reparación"
5. Guardar

**Resultado Esperado:**

- Se abre detalles del incidente
- Se puede cambiar estado
- Se puede agregar comentarios
- Se realiza PUT a `/api/incidentes/{id}`
- Cambio se refleja en tabla
- Se notifica al reportante

---

## Reportes

### TC-REP-001: Generar reporte de expensas

**Título:** Crear reporte de gastos comunes

**Pasos:**

1. Loguearse y navegar a "Reportes"
2. Seleccionar tipo: "Expensas"
3. Seleccionar período: "Último mes"
4. Hacer clic en "Generar Reporte"

**Resultado Esperado:**

- Se genera reporte en formato tabla
- Se muestra resumen: Total, Promedio, Mayor gasto
- Hay opción de exportar a PDF
- Hay opción de imprimir
- Se muestra gráfico de distribución

---

### TC-REP-002: Generar reporte de pagos

**Título:** Crear reporte de pagos realizados

**Pasos:**

1. Estar en página de Reportes
2. Seleccionar tipo: "Pagos"
3. Seleccionar rango de fechas
4. Hacer clic en "Generar"

**Resultado Esperado:**

- Se genera tabla con pagos del período
- Se muestra total recaudado
- Se identifica pagos atrasados
- Se exporta a Excel/PDF
- Se muestra gráfico de tendencia

---

### TC-REP-003: Descargar reporte en PDF

**Título:** Exportar reporte a PDF

**Pasos:**

1. Generar un reporte
2. Hacer clic en botón "Descargar PDF"
3. Esperar descarga

**Resultado Esperado:**

- Se genera archivo PDF con reporte
- El archivo se descarga correctamente
- PDF contiene toda la información
- Formato es profesional y legible
- Se puede imprimir sin problemas

---

## Configuración

### TC-CONF-001: Ver perfil de usuario

**Título:** Visualizar datos del perfil del usuario logueado

**Pasos:**

1. Estar logueado
2. Hacer clic en "Mi Perfil" o avatar del usuario
3. Se abre página de perfil

**Resultado Esperado:**

- Se muestran datos personales: Nombre, Email, Teléfono
- Se muestra foto de perfil
- Se muestra rol del usuario
- Se muestra fecha de registro

---

### TC-CONF-002: Editar perfil

**Título:** Cambiar datos personales

**Pasos:**

1. Estar en página de perfil
2. Hacer clic en "Editar Perfil"
3. Cambiar teléfono
4. Hacer clic en "Guardar"

**Resultado Esperado:**

- Se abre formulario de edición
- Se pueden cambiar: Teléfono, Foto, Contraseña
- Se realiza PUT a `/api/usuario/perfil`
- Se muestra confirmación
- Cambios se reflejan inmediatamente

---

### TC-CONF-003: Cambiar contraseña

**Título:** Actualizar contraseña del usuario

**Pasos:**

1. Estar en página de perfil
2. Hacer clic en "Cambiar Contraseña"
3. Ingresar contraseña actual
4. Ingresar contraseña nueva (2 veces)
5. Hacer clic en "Guardar"

**Resultado Esperado:**

- Se valida contraseña actual
- Se valida que nuevas contraseñas coincidan
- Contraseña nueva cumple requisitos (8+ caracteres, mayúscula, número)
- Se realiza PUT a `/api/usuario/cambiar-contrasena`
- Se muestra confirmación
- Se requiere login nuevamente (opcional)

---

## Test Cases de Integración

### TC-INT-001: Flujo completo de pago de expensas

**Título:** Ciclo completo: Ver expensa → Registrar pago → Generar reporte

**Pasos:**

1. Loguearse como habitante
2. Ir a Dashboard, ver deuda en tarjeta "Expensas"
3. Navegar a "Pagos"
4. Registrar pago de expensas (monto visible en dashboard)
5. Navegar a "Reportes"
6. Generar reporte de últimos 30 días

**Resultado Esperado:**

- El monto de pago coincide con la expensa
- El pago se registra correctamente
- El reporte muestra la transacción
- No hay discrepancias en montos
- Toda la información es consistente

---

### TC-INT-002: Flujo de reserva y gestión

**Título:** Reservar recurso → Cancelar → Verificar disponibilidad

**Pasos:**

1. Loguearse como residente
2. Navegar a "Recursos"
3. Seleccionar un recurso
4. Navegar a "Reservas"
5. Realizar una reserva para mañana
6. Luego cancelar la reserva
7. Verificar que la fecha está disponible nuevamente

**Resultado Esperado:**

- Se crea la reserva exitosamente
- Se muestra confirmación con referencia
- Al cancelar, el horario se libera
- Otro usuario puede reservar ese horario
- No hay conflictos de disponibilidad

---

### TC-INT-003: Ciclo de incidente

**Título:** Reportar incidente → Asignar → Resolver

**Pasos:**

1. Loguearse como residente
2. Reportar incidente en "Incidentes"
3. Cerrar sesión
4. Loguearse como admin
5. Ver incidente nuevo
6. Cambiar estado a "En Proceso"
7. Cambiar estado a "Resuelto"
8. Hacer logout

**Resultado Esperado:**

- Incidente se crea con estado "Abierto"
- Admin puede verlo en dashboard
- Estados se cambian correctamente
- Residente puede ver el progreso
- Historial queda registrado

---

## Test Cases de Validación

### TC-VAL-001: Validación de campos en formularios

**Título:** Verificar que los formularios validan correctamente

**Pasos:**

1. Intentar crear una expensa sin llenar campos
2. Intentar ingresar monto negativo
3. Dejar campo descripción vacío
4. Hacer clic en Guardar

**Resultado Esperado:**

- Se muestra error para campo vacío: "Campo requerido"
- Se valida que monto sea positivo: "Monto debe ser mayor a 0"
- Se previene el envío del formulario
- Los errores se muestran en rojo
- Se enfatiza el campo con error

---

### TC-VAL-002: Validación de email único

**Título:** Sistema valida que no existan emails duplicados

**Pasos:**

1. Crear usuario con email "juan@example.com"
2. Intentar crear otro usuario con el mismo email
3. Hacer clic en Guardar

**Resultado Esperado:**

- Se muestra error: "Email ya está registrado"
- No se puede completar el formulario
- Se sugiere recuperar contraseña
- No se realiza POST al servidor

---

### TC-VAL-003: Validación de roles disponibles

**Título:** Solo se pueden asignar roles válidos

**Pasos:**

1. Estar en formulario de usuario
2. Hacer clic en dropdown de roles
3. Verificar opciones disponibles

**Resultado Esperado:**

- Solo se muestran roles válidos: Admin, Director, Habitante, Auxiliar, Seguridad, Super
- No hay opciones inválidas
- Se puede seleccionar cualquier rol permitido
- El sistema valida el rol antes de guardar

---

## Test Cases de Performance

### TC-PERF-001: Carga de tabla grande

**Título:** Tabla con 1000+ registros carga sin freezing

**Pasos:**

1. Navegar a una sección con muchos registros (Expensas)
2. Esperar carga inicial
3. Interactuar con tabla (scroll, búsqueda)
4. Cambiar página

**Resultado Esperado:**

- Tabla carga en menos de 3 segundos
- No hay freezing o lag al hacer scroll
- Búsqueda funciona sin demoras
- Paginación es fluida
- Uso de memoria es razonable

---

### TC-PERF-002: Búsqueda y filtrado rápido

**Título:** Búsqueda en tiempo real es responsiva

**Pasos:**

1. Estar en tabla de usuarios
2. Empezar a escribir en buscador: "juan"
3. Continuar escribiendo: "juan.perez"
4. Limpiar búsqueda

**Resultado Esperado:**

- Resultados se actualizan en tiempo real
- No hay demora perceptible
- Se filtran correctamente mientras escribes
- Limpiar busca muestra todos los resultados nuevamente
- No hay múltiples peticiones simultáneas

---

## Test Cases de Seguridad

### TC-SEC-001: Prevención de acceso sin autenticación

**Título:** No se puede acceder a páginas protegidas sin token

**Pasos:**

1. Limpiar localStorage (eliminar token)
2. Escribir URL directa: `/expensas`
3. Intentar acceder

**Resultado Esperado:**

- Se redirige automáticamente a login
- Se muestra mensaje: "Debe iniciar sesión"
- No se carga contenido protegido
- La URL cambia a `/login`

---

### TC-SEC-002: Token inválido

**Título:** Token expirado o inválido redirige a login

**Pasos:**

1. Modificar manualmente el token en localStorage
2. Hacer refresh de página
3. Intentar acceder a cualquier sección

**Resultado Esperado:**

- Sistema detecta token inválido
- Se redirige a página de login
- Se muestra mensaje: "Sesión expirada"
- Se borra el token inválido

---

### TC-SEC-003: Validación de permisos por rol

**Título:** Usuario solo accede a funciones de su rol

**Pasos:**

1. Loguearse como "habitante"
2. Intentar acceder a URL: `/usuarios`
3. Intentar acceder a `/roles`

**Resultado Esperado:**

- Se redirige a "Acceso Denegado" (AccessDeniedPage)
- Se muestra mensaje: "No tiene permiso para acceder"
- No se carga el contenido
- Se mantiene sesión activa

---

## Test Cases de Compatibilidad

### TC-COMPAT-001: Funciona en Chrome

**Título:** Aplicación funciona en Google Chrome

**Pasos:**

1. Abrir aplicación en Chrome versión actual
2. Realizar login
3. Navegar por varias secciones
4. Realizar CRUD básico

**Resultado Esperado:**

- Aplicación carga completamente
- Todos los estilos se aplican correctamente
- No hay errores de consola
- Funcionalidad es completa

---

### TC-COMPAT-002: Funciona en Firefox

**Título:** Aplicación funciona en Mozilla Firefox

**Pasos:**

1. Abrir aplicación en Firefox versión actual
2. Realizar login
3. Navegar por varias secciones
4. Realizar CRUD básico

**Resultado Esperado:**

- Aplicación carga completamente
- Todos los estilos se aplican correctamente
- No hay errores de consola
- Funcionalidad es completa

---

### TC-COMPAT-003: Responsive en dispositivos móviles

**Título:** Interfaz se adapta correctamente en móviles

**Pasos:**

1. Abrir en dispositivo mobile (iPhone/Android)
2. O usar modo responsive (F12) con viewport 375x667
3. Navegar por la aplicación
4. Usar menú hamburguesa

**Resultado Esperado:**

- Interfaz se adapta correctamente
- Texto es legible
- Botones son tocables (tamaño mínimo 44px)
- No hay overflow horizontal
- Menú funciona correctamente

---

## Resumen de Test Cases

| Categoría          | Cantidad | Estado        |
| ------------------ | -------- | ------------- |
| **Autenticación**  | 6        | Pendiente     |
| **Navegación**     | 4        | Pendiente     |
| **Dashboard**      | 3        | Pendiente     |
| **Expensas**       | 5        | Pendiente     |
| **Pagos**          | 3        | Pendiente     |
| **Propiedades**    | 3        | Pendiente     |
| **Usuarios**       | 4        | Pendiente     |
| **Recursos**       | 2        | Pendiente     |
| **Reservas**       | 3        | Pendiente     |
| **Incidentes**     | 3        | Pendiente     |
| **Reportes**       | 3        | Pendiente     |
| **Configuración**  | 3        | Pendiente     |
| **Integración**    | 3        | Pendiente     |
| **Validación**     | 3        | Pendiente     |
| **Performance**    | 2        | Pendiente     |
| **Seguridad**      | 3        | Pendiente     |
| **Compatibilidad** | 3        | Pendiente     |
| **TOTAL**          | **58**   | **Pendiente** |

---

**Documento generado:** 2026-07-09  
**Última actualización:** 2026-07-09  
**Versión:** 1.0
