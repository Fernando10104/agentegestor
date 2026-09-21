# Cambios de sesión — 20/09/2026

Resumen de los cambios realizados sobre el proyecto **Agentegestor**.

## 1. Cancelación automática de créditos vencidos

**Archivo:** `sistema_api.py`

- `cancelar_creditos_vencidos()` (~línea 429): la consulta ahora cancela créditos en estado **`INGRESADO`** además de **`APROBADO`** cuando llevan más de 31 días sin desembolso.
  - Antes: `WHERE estado = 'APROBADO' AND fecha < CURRENT_DATE - INTERVAL '31 days'`
  - Ahora: `WHERE estado IN ('APROBADO', 'INGRESADO') AND fecha < CURRENT_DATE - INTERVAL '31 days'`
- La tarea se ejecuta cada 24 h mediante `job_creditos_vencidos()`.

## 2. CRUD de usuarios: nuevo campo `fecha_ingreso`

**Backend (`sistema_api.py`)**
- Modelos `UsuarioCreate` y `UsuarioUpdate`: nuevo campo `fecha_ingreso: Optional[str] = None`.
- `crear_usuario`: los 2 INSERTs incluyen la columna `fecha_ingreso` con `COALESCE(%s, CURRENT_DATE)` (si no se envía, se usa la fecha actual).
- Columna de tipo `DATE`; los usuarios existentes quedan en `NULL`.

**Frontend**
- Tablas de usuarios: `docs/js/api_admin/usuario_api.js` y `docs/js/api_gerente/usuario_api.js`
  - Nueva celda "Fecha Ingreso" en `CargarUsuarios`, `colspan` ajustado a 10.
- Vistas de usuarios: `docs/js/com_admin/usuario.js` y `docs/js/com_gerente/usuario.js`
  - Nuevo encabezado "Fecha Ingreso" y input `fecha-ingreso` en el modal de crear.
  - New input `fecha-ingreso-editar` en el modal de editar (se carga en `BuscarUsuarioPorId`).
  - `guardarEditarUsuario` / `CrearUsuario`: envían la fecha solo si no está vacía (evita enviar `''` a la columna DATE).

> Nota: se sugirió el ALTER de BD `ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS fecha_ingreso DATE;` (ejecutado por el usuario).

## 3. Dashboard de Ingresos: filtro por rango de fechas

Permite visualizar ingresos por rango **Desde / Hasta** en formato **dd/mm/aaaa** (texto con máscara), en lugar de solo mes/año. El Balance mensual y las metas quedaron intactos (metas fijas del mes actual).

**Backend (`sistema_api.py`)**
- Nuevo helper `parse_fecha_dd_mm_aaaa(valor)` que convierte `dd/mm/aaaa` a `date` (400 → HTTPException con detalle claro).
- `resumen_grupo_mes` (`GET /grupos/{grupo_id}/resumen-mes`):
  - Nuevos query params `fecha_inicio` y `fecha_fin` (dd/mm/aaaa).
  - Si vienen, calcula `inicio_periodo`/`fin_periodo` y las 3 consultas internas lo usan; si no, conserva el fallback mes/año.
- `resumen_global` (`GET /resumen-global`): mismo tratamiento (params `fecha_inicio`/`fecha_fin`, `inicio_periodo`/`fin_periodo` en sus 3 consultas).
- `leer_metas` (`GET /metas`): nuevos params `fecha_inicio`/`fecha_fin`; si vienen, calcula `cantidad_operaciones` y totales sobre ese rango (fin inclusive, suma un día por el extremo excluyente de las consultas).

**Frontend**
- Nuevo archivo: `docs/js/componentes/mascaraFecha.js`
  - `mascaraFecha` (auto-formato dd/mm/aaaa), `fechaValida`, `formatearFecha`, `hoyFormateado`, `primerDiaMesFormateado`.
- `docs/js/admin.js`:
  - Cards "Mes"/"Año" reemplazadas por "Desde"/"Hasta" con inputs de texto (máscara `oninput`, `onchange` → `cambiarGrupos`).
  - Valores por defecto al renderizar: desde = 1 del mes actual, hasta = hoy.
  - `cambiarGrupos()` lee las fechas, valida formato y orden, y las pasa a las APIs.
  - `obtenerGrupoPorId(id, fechaInicio, fechaFin)` envía `fecha_inicio`/`fecha_fin` a la URL.
  - `buscarMetas(fechaInicio, fechaFin)` envía las fechas a `/metas`.
- `docs/js/gerente.js`: mismos cambios que admin.js, más `obtenerResumenGlobal(fechaInicio, fechaFin)`.

## 4. Corrección: carpeta/transacciones por asesor según la fecha

La cantidad de transacciones (carpetas) por asesor venía siempre del mes actual, sin respetar el rango elegido.

- **`sistema_api.py` → `leer_metas`**: ahora calcula `cantidad_operaciones` (COUNT) dentro del rango `fecha_inicio`/`fecha_fin` cuando se envía.
- **Frontend**: `buscarMetas(fechaInicio, fechaFin)` en `admin.js` y `gerente.js`; `cambiarGrupos` les pasa las fechas del filtro.

## 5. Corrección: total de página "undefined" en Historial de Créditos

**Archivo:** `docs/js/api/historial_api.js`

- `cargarHistorial()` retornaba `{ totalPages, totalDatos }`, pero `docs/js/componentes/historial.js` leía `pagination.totalItems`, que nunca existía → el "Total" de la paginación mostraba `undefined`.
- Se agregó la clave `totalItems` al retorno (se mantiene `totalDatos` para compatibilidad con el historial de supervisores).

---

## Archivos modificados/creados

| Archivo | Acción |
|---|---|
| `sistema_api.py` | Modificado (vencidos, fecha_ingreso, rango de fechas, metas) |
| `docs/js/componentes/mascaraFecha.js` | **Creado** |
| `docs/js/admin.js` | Modificado |
| `docs/js/gerente.js` | Modificado |
| `docs/js/api_admin/usuario_api.js` | Modificado |
| `docs/js/api_gerente/usuario_api.js` | Modificado |
| `docs/js/com_admin/usuario.js` | Modificado |
| `docs/js/com_gerente/usuario.js` | Modificado |
| `docs/js/api/historial_api.js` | Modificado |

## Verificaciones realizadas

- `python -m py_compile sistema_api.py` → OK.
- `node --check` sobre los JS modificados → OK.