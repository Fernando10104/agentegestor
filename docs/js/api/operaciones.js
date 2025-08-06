import { API_BASE_URL } from '../config.js';
export function cargarClientes(campo = "nombre", valor = "", page = 1, limit = 10) {
  const url = new URL(`${API_BASE_URL}/clientes`);

  url.searchParams.append("page", page);
  url.searchParams.append("limit", limit);
  url.searchParams.append("campo", campo);

  if (valor) {
    url.searchParams.append("search", valor);
  }

  const token = localStorage.getItem("token");

  return fetch(url, {
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Error en la respuesta de la API");
      }
      return res.json();
    })
    .then(data => {
      const clientes = data.clientes ?? [];
      const total = data.total ?? 0; // Asumimos que la API devuelve el total
      const totalPages = Math.ceil(total / limit);

      const tbody = document.getElementById('tbody-clientes');
      if (!clientes.length) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;">Sin datos</td></tr>`;
      } else {
        tbody.innerHTML = clientes.map(cliente => `
          <tr id="${cliente.id_cliente}" style="background-color: transparent;">
            <td>
              <button class="btn-eliminar" style="background-color: transparent; border: none; border-radius: 15px; padding: 5px 5px;" onmouseover="this.style.backgroundColor='darkgray'" onmouseout="this.style.backgroundColor='transparent'"  data-id="${cliente.id_cliente}" title="Eliminar">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5V14a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5.5h-10zM6 0h4l1 1h4v2H1V1h4l1-1z"/>
              </svg>
              </button>
            </td>
            <td>
              <button class="btn-editar" style="background-color: transparent; border: none; border-radius: 15px; padding: 5px 5px;" onmouseover="this.style.backgroundColor='darkgray'" onmouseout="this.style.backgroundColor='transparent'" data-id="${cliente.id_cliente}" title="Editar">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-pencil" viewBox="0 0 16 16">
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
              </svg>
              </button>
            </td>
            <td>${cliente.id_cliente ?? ''}</td>
            <td>${cliente.nombre ?? ''}</td>
            <td>${cliente.documento ?? ''}</td>
            <td>${cliente.contacto ?? ''}</td>
            <td>${cliente.direccion ?? ''}</td>
            <td>${cliente.correo ?? ''}</td>
            <td>${cliente.faja_inforcomf ?? ''}</td>
            <td>${cliente.estado_cred ?? ''}</td>
            <td>${cliente.e_registro ?? ''}</td>
            <td>${(cliente.fecha_registro ?? '').split('T')[0]}</td>
          </tr>
        `).join('');
      }

      return {
        totalPages: totalPages
      };
    })
    .catch(err => {
      const tbody = document.getElementById('tbody-clientes');
      tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;color:red;">Error al cargar datos</td></tr>`;
      console.error(err);
      throw err; // Re-lanzamos el error para que se maneje en el .then
    });
}



let marcas = []; // Variable global para guardar los datos

export function cargarMarcas() {
  const url = new URL(`${API_BASE_URL}/marcas`);
  const token = localStorage.getItem("token");
  const nombre_usuario = localStorage.getItem("nombre_usuario");

  url.searchParams.append("nombre_usuario", nombre_usuario);

  return fetch(url, {
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Error en la respuesta de la API");
      }
      return res.json();
    })
    .then(data => {
      marcas = data.marcas ?? [];

      const marcaSelect = document.getElementById('marca');
      marcaSelect.innerHTML = marcas.map(marca => `
        <option value="${marca.marca}">${marca.marca}</option>
      `).join('');

      // Agregar listener para cuando se seleccione una marca
      marcaSelect.addEventListener('change', actualizarTipoComision);
       // ⚡ Llamamos a la función directamente para precargar la comisión de la primera marca
      if (marcas.length > 0) {
        actualizarTipoComision(); // carga comisiones por defecto
      }

    })
    .catch(err => {
      console.error(err);
      throw err;
    });
}

function actualizarTipoComision() {
  const marcaSeleccionada = document.getElementById('marca').value;
  const marcaObj = marcas.find(m => m.marca === marcaSeleccionada);

  const tipoComisionSelect = document.getElementById('tipo_comision');

  if (marcaObj) {
    tipoComisionSelect.innerHTML = `
      <option value="${marcaObj.comision_nuevo}">Nuevo - ${marcaObj.comision_nuevo}%</option>
      <option value="${marcaObj.comision_renovacion}">Renovación - ${marcaObj.comision_renovacion}%</option>
    `;
  } else {
    tipoComisionSelect.innerHTML = '<option>Seleccione una marca válida</option>';
  }
}

export function CargarCredito(){
  document.querySelector('.cargar-credito-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Evita que se recargue la página

    // Capturamos los datos del formulario
    const data = {
      cedula: document.getElementById('cedula').value.replace(/\D/g, ''),
      celular: parseInt(document.getElementById('celular').value.replace(/\D/g, '')),
      faja: document.getElementById('faja').value.replace(/\D/g, ''),
      categoria: document.getElementById('categoria').value,
      marca: document.getElementById('marca').value,
      tipo_comision: parseInt(document.getElementById('tipo_comision').value.replace(/\D/g, '')),
      tipo_credito: document.getElementById('tipo_credito').value,
      importe: parseFloat(document.getElementById('importe').value.replace(/\D/g, '')),
      obs: document.getElementById('obs').value,
      id_usuario: parseInt(localStorage.getItem('id_usuario')),
      nombre_usuario: localStorage.getItem('nombre_usuario'),
      superior: parseInt(localStorage.getItem('superior'))
    };
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/crear-credito`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token // se obtiene el token del localStorage
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Error al insertar crédito');

      const result = await response.json();
      alert('Crédito insertado correctamente');
      console.log(result);

      // Opcional: limpiar formulario o cerrar modal
      document.querySelector('.cargar-credito-form').reset();
      ocultarCargarCredito();

    } catch (error) {
      console.error(error);
      alert('Hubo un error al enviar los datos');
    }
  });


}


export function CrearClientes(){
  document.querySelector('.cargar-clientes-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Evita que se recargue la página

    // Capturamos los datos del formulario
    const data = {
      // datos del cliente
      documento: document.getElementById('documento').value.toString(),
      nombre: document.getElementById('Nombre').value,
      contacto: document.getElementById('Celular').value,
      direccion: document.getElementById('Direccion').value,
      correo: document.getElementById('correo').value,
      faja_inforcomf: document.getElementById('faja_inforcomf').value.toString(),

      // datos del registro
      id_usuario: parseInt(localStorage.getItem('id_usuario')),
      nombre_usuario: localStorage.getItem('nombre_usuario'),
    };
    console.log(data);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/crear-cliente`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token // se obtiene el token del localStorage
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Error al insertar cliente');

      const result = await response.json();
      alert('Cliente insertado correctamente');
      console.log(result);

      // Opcional: limpiar formulario o cerrar modal
      document.querySelector('.cargar-clientes-form').reset();
      ocultarCargarCliente();
      

    } catch (error) {
      console.error(error);
      alert('Hubo un error al enviar los datos');
    }
  });
}


//mostrarEliminarHistorial,mostrarEditarHistorial 



export function mostrarEditarCliente(id) {
  const modal = document.getElementById('modal-editar-clientes'); // ← Corregir ID
  const token = localStorage.getItem("token");

  if (modal) {
    modal.style.display = 'flex'; // ← Cambiar a 'flex' para mostrar correctamente

    fetch(`${API_BASE_URL}/cliente/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Error al obtener los datos del cliente");
        }
        return res.json();
      })
      .then(cliente => {
        if (cliente) {
          console.log(cliente);
          // Cargar los datos en el formulario del modal usando los IDs correctos
          document.getElementById("id").value = cliente.id_cliente || "";
          document.getElementById("nombre").value = cliente.nombre || "";
          document.getElementById("documento/1").value = cliente.documento || ""; // pongo /1 porque parece que hay conflicto con otro id
          document.getElementById("contacto").value = cliente.contacto || "";
          document.getElementById("direccion").value = cliente.direccion || "";
          document.getElementById("correo/1").value = cliente.correo || "";
          document.getElementById("faja-1").value = cliente.faja_inforcomf || "";
          document.getElementById("asesor").value = cliente.e_registro || "";
          document.getElementById("estado-1").value = cliente.estado_cred || "";
        } else {
          console.error("No se encontraron datos del cliente.");
          alert("Error: No se pudieron cargar los datos del cliente");
        }
      })
      .catch(err => {
        console.error("Error al cargar cliente:", err);
        alert("Error al cargar los datos del cliente");
        modal.style.display = 'none'; // Ocultar modal en caso de error
      });
  } else {
    console.error("Modal no encontrado");
  }
}

export function guardarActualizacionCliente() {
  const id = document.getElementById("id").value;
  const nombre = document.getElementById("nombre").value;
  const documento = document.getElementById("documento/1").value;
  const contacto = document.getElementById("contacto").value;
  const direccion = document.getElementById("direccion").value;
  const correo = document.getElementById("correo/1").value;
  const faja = document.getElementById("faja-1").value;
  const estado = document.getElementById("estado-1").value;

  const token = localStorage.getItem("token");

  fetch(`${API_BASE_URL}/cliente/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nombre,
      documento,
      contacto,
      direccion,
      correo,
      faja_inforcomf: faja,
      estado_cred: estado
    }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Error al actualizar el cliente");
      }
      return response.json();
    })
    .then(data => {
      console.log("Actualización exitosa:", data);
      alert("Cliente actualizado correctamente");
      mostrarCreditos();
      
      // Cerrar el modal
      const modal = document.getElementById("modal-editar-clientes");
      modal.style.display = "none";
      
      // Recargar la tabla de clientes
      
    })
    .catch(error => {
      console.error("Error al actualizar:", error);
      alert("Error al actualizar el cliente: " + error.message);
    });
}



export function mostrarEliminarCliente(id) {
  const modal = document.getElementById('modal-eliminar-cliente');
  if (modal) {
    modal.innerHTML = `
      <h1>¿Desea eliminar el cliente?</h1>
      <p>El id de cliente a eliminar es: ${id}</p>
      <button class="btn-eliminar-confirmacion" id="btn-eliminar-confirmacion" onclick="EliminarCliente(${id})">Eliminar</button>
      <button class="btn-cancelar" id="btn-cancelar-eliminar" onclick="cerrarEliminarCliente()">Cancelar</button>
    `;
    modal.style.display = 'block';
  }
}

export function EliminarCliente(id) {
  const token = localStorage.getItem("token");
  fetch(`${API_BASE_URL}/cliente/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Error al eliminar el cliente");
      }
      return response.json();
    })
    .then(data => {
      console.log("Eliminación exitosa:", data);
      alert("Cliente eliminado correctamente");
      mostrarCreditos(); // Recargar la lista de créditos para reflejar el cambio
      
      // Cerrar el modal
      const modal = document.getElementById("modal-eliminar-cliente");
      modal.style.display = "none";
      
    })
    .catch(error => {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar el cliente: " + error.message);
    });
}
















