# README — Cambios aplicados

Fecha: 06/09/2026
Ruta web: `C:\evolucionpy\agentegestor\docs`

## Problema

En el dashboard de ingresos (modo por grupo y sobre todo "Toda la empresa (Global)"), al existir muchos usuarios/elementos los gráficos se veían mal:

- El gráfico de barras horizontales quedaba aplastado: todas las barras cabían forzadas en ~300px, las etiquetas de usuarios se pisaban y las barras (2 por usuario: Logrado + Meta Personal) eran ilegibles.
- El gráfico de pie generaba una porción por usuario con una leyenda enorme a la derecha/abajo que desbordaba la tarjeta.
- El CSS global `canvas { max-height: 300px; }` limitaba el alto real de cualquier canvas aunque el JS pidiera más.

## Archivos modificados y qué se cambió

### 1. `estilos/admin_estile_mod.css` (panel admin)
- Bloque `canvas { max-height: 300px; }` → `canvas { max-height: none; }`
  - Ubicación: sección `/*---------------------------menu graficos inicio*/` (~línea 865).
  - Motivo: permitir que Chart.js use el alto que el JS indique sin ser recortado a 300px.

### 2. `estilos/gerente_estile_mod.css` (panel gerente)
- Mismo cambio idéntico que en `admin_estile_mod.css` (~línea 865).

### 3. `js/gerente.js` (función `cambiarGrupos`, ~líneas 388-535)
- **Altura dinámica del gráfico de barras** (~línea 391): antes de crear `barChart` se calcula
  `Math.max(400, empleados.length * 40)` y se asigna al canvas (`barCanvas.style.height`),
  de modo que con muchos usuarios el gráfico crece y scrollea la página en vez de aplastarse.
- **`barThickness: 18`** en los datasets "Logrado" y "Meta Personal" (~líneas 408 y 416):
  grosor fijo de barra para que no varíe según cantidad de usuarios.
- **Pie chart limitado a top-12 + "Otros"** (~líneas 482-501): se filtran los valores 0,
  se ordenan de mayor a menor y si hay más de 12 empleados se agrupa el resto en una sola
  porción "Otros (N)" de color gris (#6B7280). Se conserva la porción "Meta Restante" al final.
  (Requerido cambiar `const pieData` → `let pieData`.)
- **Leyenda del pie más compacta** (~líneas 529-533): `padding: 8`, `boxWidth: 12`
  (antes `padding: 20`), para que entren más ítems sin desbordar la tarjeta.

## Notas

- No se modificaron las vistas de asesor/supervisor ni sus CSS (`index.css`, `inicio.css`), ya que no usan estos gráficos.
- Con la altura dinámica, el contenido del panel scrollea verticalmente cuando hay muchos usuarios (comportamiento esperado).
- Los cambios son compatibles con el modo Global ("Toda la empresa (Global)") y con el filtrado de mes/año de `GET /metas` y `GET /resumen-global`.