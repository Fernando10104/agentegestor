import { API_BASE_URL } from '../config.js';

// Variable global para guardar todas las filas
let todasLasFilas = [];

/**
 * Obtiene y muestra datos históricos desde la API.
 *
 * @param {string} [campo="num_operacion"] - El campo por el cual filtrar los datos.
 * @param {string} [valor=""] - El valor a buscar en el campo especificado.
 * @param {number} [page=1] - El número de página a obtener.
 * @param {number} [limit=10] - La cantidad de registros a obtener por página.
 * @returns {Promise<{ totalPages: number }>} Una promesa que se resuelve con un objeto que contiene el número total de páginas.
 *
 * @throws {Error} Lanza un error si la respuesta de la API no es correcta o si hay un problema de red.
 *
 * @example
 * cargarHistorial("num_operacion", "12345", 1, 10)
 *   .then(data => console.log(data.totalPages))
 *   .catch(err => console.error(err));
 */
export function cargarHistorial(campo = "num_operacion", valor = "", page = 1, limit = 10, fecha_inicio = null, fecha_fin = null) {
  console.log("Cargando historial con los siguientes parámetros:");
  const url = new URL(`${API_BASE_URL}/historial`);

  url.searchParams.append("page", page);
  url.searchParams.append("limit", limit);
  url.searchParams.append("campo", campo);
  const id_usuario = localStorage.getItem("id_usuario");
  const rol = localStorage.getItem("rol");
  const nombre_usuario = localStorage.getItem("nombre_usuario");

  if (valor) {
    url.searchParams.append("search", valor);
  }

  if (fecha_inicio) {
    url.searchParams.append("fecha_inicio", fecha_inicio);
  }

  if (fecha_fin) {
    url.searchParams.append("fecha_fin", fecha_fin);
  }

  if (id_usuario) {
    url.searchParams.append("id_usuario", id_usuario);
  }

  if (rol) {
    url.searchParams.append("roles", rol);
  }

  if (nombre_usuario) {
    url.searchParams.append("nombre_usuario", nombre_usuario);
  }

  const token = localStorage.getItem("token");

  return fetch(url, {
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then(res => {
      if (!res.ok) {
        console.error("Error en la respuesta de la API:", res.status, res.statusText);  
        if (res.status === 401) {
          console.error("Token inválido o expirado. Redirigiendo a la página de inicio de sesión.");
          window.location.href = "login.html";
        throw new Error("Error en la respuesta de la API");
        
      }}
      return res.json();
    })
    .then(data => {
      console.log("Datos recibidos:", data);
      const historial = data.historial ?? [];
      const total = data.totalPages ?? 0;
      const totalPages = total;

      // Guardar todas las filas para filtro local
      todasLasFilas = historial;

      const tbody = document.querySelector('.table-responsive tbody');
      if (!historial.length) {
        tbody.innerHTML = `<tr><td colspan="13" style="text-align:center;">Sin datos</td></tr>`;
      } else {
        tbody.innerHTML = historial.map(item => {
          const fechaFormateada = item.fecha ? item.fecha.split('T')[0].split('-').reverse().join('/') : '';
          const estado = (item.estado ?? '').toLowerCase();

          const className = {
            desembolsado: 'estado-desembolsado',
            aprobado: 'estado-aprobado',
            ingresado: 'estado-ingresado',
            cancelado: 'estado-cancelado'
          }[estado] || '';
            return `
            <tr id="${item.num_operacion}" style="background-color: transparent;">
              <td>
              <button class="btn-eliminar" style="background-color: transparent; border: none; border-radius: 15px; padding: 5px 5px;" onmouseover="this.style.backgroundColor='darkgray'" onmouseout="this.style.backgroundColor='transparent'"  data-id="${item.num_operacion}" title="Eliminar">
              ${SVG_ELIMINAR}
              </button>
              
              <button class="btn-editar" style="background-color: transparent; border: none; border-radius: 15px; padding: 5px 5px;" onmouseover="this.style.backgroundColor='darkgray'" onmouseout="this.style.backgroundColor='transparent'" data-id="${item.num_operacion}" title="Editar">
              ${SVG_EDITAR}
              </button>
              </td>

              <td>${item.num_operacion ?? ''}</td>
              <td>${fechaFormateada}</td>
              <td>${item.documento ?? ''}</td>
              <td>${item.contacto ?? ''}</td>
              <td>${item.marca ?? ''}</td>
              <td>${item.tipo ?? ''}</td>
              <td>${item.faja ?? ''}</td>
              <td>${item.categoria ?? ''}</td>
              <td>${item.importe ? parseFloat(item.importe).toFixed(2).replace(/\.00$/, '') : ''}</td>
              <td>${item.responsable ?? ''}</td>
              <td>${item.comision ?? ''}</td>
              <td><button class="${className}">${item.estado ?? ''}</button></td>
              <td>${item.obs ?? ''}</td>
              
            </tr>
            `;
        }).join('');
      }

      return { totalPages: totalPages };
    })
    .catch(err => {
      const tbody = document.querySelector('.table-responsive tbody');
      tbody.innerHTML = `<tr><td colspan="15" style="text-align:center;color:red;">Error al cargar datos</td></tr>`;
      console.error(err,"este es el print");
      if (err.response.status === 401) {
        console.error("Token inválido o expirado. Redirigiendo a la página de inicio de sesión.");
        window.location.href = "login.html";
      }
      throw err;
    });
}

export function mostrarEliminarHistorial(id) {
  const modal = document.getElementById('modal-eliminar-historial');
  if (modal) {
    modal.innerHTML = `
      <div>
      <h1>¿Desea eliminar el historial de crédito?</h1>
      <p>El id de crédito a eliminar es: ${id}</p>
        <div class="btns">
          <button class="btn-confirmar" id="btn-eliminar-confirmacion" onclick="EliminarHistorial(${id})">Eliminar</button>
          <button class="btn-cancelar" id="btn-cancelar-eliminar" onclick="cerrarEliminarHistorial()">Cancelar</button>
        </div>
      </div>
    `;
    modal.style.display = 'flex';
  }
}

export function manejarClickOperacion(id) {
    // Aquí puedes manejar el evento de clic en la operación
    console.log("Operación clickeada para editar:", id);
    const token = localStorage.getItem("token");

    fetch(`${API_BASE_URL}/historial-id?num_operacion=${encodeURIComponent(id)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al obtener los datos del historial");
        }
        return response.json();
            })
            .then(data => {
        console.log("Datos del historial:", data);

        // Verificar si el historial contiene datos
        if (data.historial && data.historial.length > 0) {
          const historial = data.historial[0]; // Acceder al primer elemento del array

          // Cargar los datos en el formulario del modal
          document.getElementById("id").value = historial.num_operacion || "";
          document.getElementById("documento").value = historial.documento || "";
          document.getElementById("contacto").value = historial.contacto || "";
          document.getElementById("marca").value = historial.marca || "";
          document.getElementById("tipo").value = historial.tipo || "";
          document.getElementById("faja").value = historial.faja || "";
          document.getElementById("categoria").value = historial.categoria || "";
          document.getElementById("importe").value = historial.importe || "";
          document.getElementById("asesor").value = historial.responsable || "";
          document.getElementById("comision").value = historial.comision || "";
          document.getElementById("estado").value = historial.estado || "";
          document.getElementById("observaciones").value = historial.obs|| "";

          // Mostrar el modal
          const modal = document.getElementById("modal-editar-historial");
          modal.style.display = "flex";
        } else {
          console.error("No se encontraron datos en el historial.");
        }
            })
            .catch(error => {
        console.error("Error:", error);
            });
        }


export function guardarActualizacion() {
  const id = document.getElementById("id").value;
  const documento = document.getElementById("documento").value;
  const contacto = document.getElementById("contacto").value;
  const marca = document.getElementById("marca").value;
  const tipo = document.getElementById("tipo").value;
  const faja = document.getElementById("faja").value;
  const categoria = document.getElementById("categoria").value;
  const importe = document.getElementById("importe").value;
  const responsable = document.getElementById("asesor").value;
  const comision = document.getElementById("comision").value;
  const estado = document.getElementById("estado").value;
  const obs = document.getElementById("observaciones").value;

  const token = localStorage.getItem("token");

  fetch(`${API_BASE_URL}/historial/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      documento,
      contacto,
      marca,
      tipo,
      faja,
      categoria,
      importe,
      responsable,
      comision,
      estado,
      obs
    }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Error al actualizar el historial");
      }
      return response.json();
    })
    .then(data => {
      showDialog("success", "Crédito actualizado correctamente");

      mostrarHistorial()
    })
    .catch(error => {
      console.error("Error al actualizar:", error);
      showDialog("error", "Error al actualizar crédito: " + error.message);
    });
}


export function EliminarHistorial(id) {
  
  const token = localStorage.getItem("token");

  fetch(`${API_BASE_URL}/historial/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Error al eliminar el historial");
      }
      return response.json();
    })
    .then(data => {
      showDialog("success", "Crédito eliminado correctamente");
      mostrarHistorial(); // Actualizar la vista del historial
    })
    .catch(error => {
      console.error("Error al eliminar:", error);
      showDialog("error", "Error al eliminar crédito: " + error.message);
    });
}
