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
            return `
            <tr id="${item.num_operacion}" style="background-color: transparent;">
              <td>
              <button class="btn-eliminar" style="background-color: transparent; border: none; border-radius: 15px; padding: 5px 5px;" onmouseover="this.style.backgroundColor='darkgray'" onmouseout="this.style.backgroundColor='transparent'"  data-id="${item.num_operacion}" title="Eliminar">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5V14a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5.5h-10zM6 0h4l1 1h4v2H1V1h4l1-1z"/>
              </svg>
              </button>
              </td>
              <td>
              <button class="btn-editar" style="background-color: transparent; border: none; border-radius: 15px; padding: 5px 5px;" onmouseover="this.style.backgroundColor='darkgray'" onmouseout="this.style.backgroundColor='transparent'" data-id="${item.num_operacion}" title="Editar">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-pencil" viewBox="0 0 16 16">
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
              </svg>
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
              <td>${item.estado ?? ''}</td>
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
      <h1>¿Desea eliminar el historial de crédito?</h1>
      <p>El id de crédito a eliminar es: ${id}</p>
      <button class="btn-eliminar-confirmacion" id="btn-eliminar-confirmacion" onclick="EliminarHistorial(${id})">Eliminar</button>
      <button class="btn-cancelar" id="btn-cancelar-eliminar" onclick="cerrarEliminarHistorial()">Cancelar</button>
    `;
    modal.style.display = 'block';
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
      console.log("Actualización exitosa:", data);

      mostrarHistorial()
    })
    .catch(error => {
      console.error("Error al actualizar:", error);
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
      console.log("Eliminación exitosa:", data);
      mostrarHistorial(); // Actualizar la vista del historial
    })
    .catch(error => {
      console.error("Error al eliminar:", error);
    });
}
