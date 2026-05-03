# 📡 Documentación API - Historial de Créditos

## Endpoint Principal

```
GET /historial
```

---

## 📋 Query Parameters

### Filtros de Búsqueda (Obligatorios/Opcionales)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `campo` | string | Campo a filtrar en la búsqueda principal | `marca`, `documento`, `contacto`, `responsable` |
| `search` | string | Valor a buscar en el campo principal | `VISA`, `12345678` |
| `campo_segundo` | string | (Opcional) Segundo campo para filtro AND | `responsable` |
| `search_segundo` | string | (Opcional) Valor para el segundo filtro | `Juan` |
| `estado` | string | (Opcional) Filtrar por estado del crédito | `desembolsado`, `aprobado`, `ingresado`, `cancelado` |
| `fecha_inicio` | string | (Opcional) Fecha de inicio (YYYY-MM-DD) | `2026-04-01` |
| `fecha_fin` | string | (Opcional) Fecha de fin (YYYY-MM-DD) | `2026-05-30` |

### Paginación

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `page` | number | Número de página (inicia en 1) | `1` |
| `limit` | number | Registros por página | `10`, `25`, `50` |

### Autenticación y Usuario

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `id_usuario` | number | ID del usuario autenticado | `5` |
| `roles` | string | Rol del usuario | `asesor`, `supervisor`, `admin` |
| `nombre_usuario` | string | Nombre de usuario | `juan` |

**Header requerido:**
```
Authorization: Bearer <token>
```

---

## 📨 Ejemplos de Requests

### Ejemplo 1: Búsqueda Simple
```
GET /historial?page=1&limit=10&campo=num_operacion&id_usuario=5&roles=asesor&nombre_usuario=juan
```

### Ejemplo 2: Búsqueda con Filtro Doble + Estado
```
GET /historial?page=1&limit=10&campo=marca&search=VISA&campo_segundo=responsable&search_segundo=Juan&estado=desembolsado&id_usuario=5&roles=asesor&nombre_usuario=juan
```

### Ejemplo 3: Búsqueda con Rango de Fechas
```
GET /historial?page=1&limit=25&campo=documento&search=12345678&fecha_inicio=2026-04-01&fecha_fin=2026-05-30&id_usuario=5&roles=asesor&nombre_usuario=juan
```

### Ejemplo 4: Solo Estado
```
GET /historial?page=1&limit=10&campo=num_operacion&estado=aprobado&id_usuario=5&roles=asesor&nombre_usuario=juan
```

---

## 🔧 Implementación en Backend

### Lo que DEBE hacer tu API:

1. **Validar token** en el header Authorization
2. **Aceptar los parámetros** como query parameters (GET)
3. **Aplicar filtros AND** cuando hay dos filtros:
   - Si existe `campo_segundo` y `search_segundo`, filtrar AMBAS condiciones
   - Ejemplo: `marca = 'VISA' AND responsable = 'Juan'`

4. **Aplicar estado** como filtro adicional:
   - Si existe `estado`, filtrar por ese estado
   - Ejemplo: `estado = 'desembolsado'`

5. **Aplicar rango de fechas**:
   - Si existe `fecha_inicio`, usar `>=`
   - Si existe `fecha_fin`, usar `<=`

6. **Aplicar paginación**:
   - Usar `page` y `limit` para limitar resultados
   - Retornar `totalPages` en la respuesta

---

## 📤 Respuesta Esperada

```json
{
  "historial": [
    {
      "num_operacion": "OP001",
      "fecha": "2026-05-01T10:30:00",
      "documento": "12345678",
      "contacto": "Carlos",
      "marca": "VISA",
      "tipo": "Nuevo",
      "faja": "A",
      "categoria": "Premium",
      "importe": 1500.50,
      "responsable": "Juan",
      "comision": 150.50,
      "estado": "desembolsado",
      "obs": "Crédito procesado"
    }
  ],
  "totalPages": 5
}
```

---

## 🎯 Lógica de Filtros en el Backend

### Pseudocódigo:

```python
def get_historial():
    # 1. Obtener parámetros
    campo = request.args.get('campo', 'num_operacion')
    search = request.args.get('search', '')
    campo_segundo = request.args.get('campo_segundo', '')
    search_segundo = request.args.get('search_segundo', '')
    estado = request.args.get('estado', '')
    fecha_inicio = request.args.get('fecha_inicio', '')
    fecha_fin = request.args.get('fecha_fin', '')
    page = request.args.get('page', 1)
    limit = request.args.get('limit', 10)
    
    # 2. Validar autenticación
    token = request.headers.get('Authorization')
    usuario = validar_token(token)
    
    # 3. Construir query
    query = Historial.query
    
    # 4. Aplicar filtro 1
    if search:
        query = query.filter(getattr(Historial, campo).contains(search))
    
    # 5. Aplicar filtro 2 (AND)
    if campo_segundo and search_segundo:
        query = query.filter(getattr(Historial, campo_segundo).contains(search_segundo))
    
    # 6. Aplicar estado
    if estado:
        query = query.filter(Historial.estado == estado)
    
    # 7. Aplicar fechas
    if fecha_inicio:
        query = query.filter(Historial.fecha >= fecha_inicio)
    if fecha_fin:
        query = query.filter(Historial.fecha <= fecha_fin)
    
    # 8. Filtrar por usuario (si es asesor)
    if usuario.rol == 'asesor':
        query = query.filter(Historial.id_usuario == usuario.id)
    
    # 9. Aplicar paginación
    total_pages = (query.count() + limit - 1) // limit
    resultados = query.limit(limit).offset((page - 1) * limit).all()
    
    # 10. Retornar respuesta
    return {
        'historial': [r.to_dict() for r in resultados],
        'totalPages': total_pages
    }
```

---

## 🔍 Console.log para Debugging

Cuando se aplica un filtro, la consola mostrará:

```
🔍 FILTRO APLICADO
1° Filtro: {campo: "marca", valor: "VISA"}
2° Filtro: {campo: "responsable", valor: "Juan"}
Fechas: {fecha_inicio: "2026-04-01", fecha_fin: "2026-05-30"}
Estado: "desembolsado"
Paginación: {page: 1, limit: 10}

📡 ENVIANDO A API
URL Completa: https://api.ejemplo.com/historial?page=1&limit=10&campo=marca&search=VISA&campo_segundo=responsable&search_segundo=Juan&estado=desembolsado&...
Token: ✅ Presente
```

---

## ⚠️ Casos Especiales

### Cuando NO hay estado seleccionado
- El parámetro `estado` **NO se envía** a la API
- Se obtienen registros de TODOS los estados

### Cuando el segundo filtro está vacío
- Los parámetros `campo_segundo` y `search_segundo` **NO se envían**

### Cuando NO hay fechas
- Los parámetros `fecha_inicio` y `fecha_fin` **NO se envían**

---

## 🎨 Estados Válidos

```
- desembolsado
- aprobado
- ingresado
- cancelado
```

---

## 📝 Cambios Recientes

- **Toggle en botones**: Presiona el botón de estado → se activa (azul oscuro). Presiona de nuevo → se desactiva
- **Estilo mejorado**: Los botones activos tienen fondo más oscuro (#1a1f2e) con borde azul
- **Console.log mejorado**: Muestra exactamente qué se está filtrando y qué URL se envía
- **Sin búsqueda automática en estado**: Solo se aplica el estado cuando presionas "Buscar"
