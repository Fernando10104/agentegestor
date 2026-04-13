import { API_BASE_URL } from '../../../js/config.js';
// Variable global para guardar todas las filas
let todasLasFilas = [];

export function cargarComisiones(campo = "Nombre_cliente", valor = "", page = 1, limit = 10, fecha_inicio = null, fecha_fin = null) {
  const url = new URL(`${API_BASE_URL}/comisiones`);

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
  if(rol) {
    url.searchParams.append("rol", rol);
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
        throw new Error("Error en la respuesta de la API");
      }
      return res.json();
    })
    .then(data => {
        
      const comisiones = data.comisiones ?? [];
      const total = data.total_pages ?? 0;
      const totalPages = total;

      // Guardar todas las filas para filtro local
      todasLasFilas = comisiones;

      // Sumar el monto de todos los desembolsados
      
      
      const totalDesembolsado = comisiones
        .filter(item => item.estado === 'DESEMBOLSADO')
        .reduce((sum, item) => sum + (parseFloat(item.monto_supervisor) || 0), 0);
      document.getElementById("total-gerente").innerText = `Total de comisiones del Supervisor: $ ${totalDesembolsado}`;
    
      
      
      

      const tbody = document.querySelector('.table-responsive tbody');
      if (!comisiones.length) {
        tbody.innerHTML = `<tr><td colspan="15" style="text-align:center;">Sin datos</td></tr>`;
      } else {
        tbody.innerHTML = comisiones.map(item => `
          <tr id="${item.id}" style="background-color: transparent;">
            <td>
              X X
              </td>
            <td>${item.id ?? ''}</td>
            <td>${item.fecha ? item.fecha.split('T')[0].split('-').reverse().join('-') : ''}</td>
            <td>${item.nombre_cliente ?? ''}</td>
            <td>${item.cedula ?? ''}</td>
            <td>${item.monto ?? ''}</td>
            <td>${item.porcentaje ?? ''}%</td>
            <td>${item.entidad ?? ''}</td>
            <td>${item.monto_asesor ?? ''}</td>
            <td>${item.monto_supervisor ?? ''}</td>
            <td>${item.supervisor ?? ''}</td>
            <td>${item.asesor ?? ''}</td>
            <td>${item.estado ?? ''}</td>
            <td>${item.calificacion ?? ''}</td>
            <td>${item.sucursal ?? ''}</td>
            <td>${item.obs ?? ''}</td>
          </tr>
        `).join('');
      }

      return { totalPages: totalPages };
    })
    .catch(err => {
      const tbody = document.querySelector('.table-responsive tbody');
      tbody.innerHTML = `<tr><td colspan="17" style="text-align:center;color:red;">Error al cargar datos</td></tr>`;
      console.error(err);
      if (err.message.includes("401")) {
        window.location.href = "login.html";
      }
      throw err;
    });
}

export function mostrarEliminarComisiones(id) {
  const modal = document.getElementById('modal-eliminar-comision');
  modal.classList.add('modal-confirmacion')
  
  if (modal) {
    modal.innerHTML = `
    <div>
      <h1>¿Desea eliminar la comisión?</h1>
      <p>El id de la comisión a eliminar es: ${id}</p>
      <div class="btns">
        <button class="btn-confirmar" id="btn-eliminar-confirmacion" onclick="EliminarComision(${id})">Eliminar</button>
        <button class="btn-cancelar" id="btn-cancelar-eliminar" onclick="cerrarEliminarComisiones()">Cancelar</button>
      </div>
    </div>
    `;
    modal.style.display = 'flex';
  }
}



export function mostrarEditarComisiones(id){
  console.log(`Mostrando edición de comisión con ID: ${id}`);
  const modal = document.getElementById('modal-editar-comision');
  modal.classList.add('modal-crear');
  modal.style.display = 'flex';
  modal.innerHTML = `
    <div>
      <h2>Editar Comisión</h2>  
    </div>
    <form id="form-editar-comision" class="modal-form">
      <br>
      <div class="form-group">
        <label for="id">ID:</label>
        <input type="text" id="id" name="id" disabled />
      </div>
      <div class="form-group">
        <label for="nombre_cliente">Nombre Cliente:</label>
        <input type="text" id="nombre_cliente" name="nombre_cliente" />
      </div>
      <div class="form-group">
        <label for="cedula">Cédula:</label>
        <input type="text" id="cedula" name="cedula" />
      </div>
      <div class="form-group">
        <label for="monto">Monto:</label>
        <input type="number" id="monto" name="monto" />
      </div>
      <div class="form-group">
        <label for="porcentaje">Porcentaje:</label>
        <input type="number" id="porcentaje" name="porcentaje" />
      </div>
      <div class="form-group">
        <label for="entidad">Entidad:</label>
        <input type="text" id="entidad" name="entidad" />
      </div>
      <div class="form-group">
        <label for="comision_bruto">Comisión Bruto:</label>
        <input type="number" id="comision_bruto" name="comision_bruto" />
      </div>
      <div class="form-group">
        <label for="monto_asesor">Monto Asesor:</label>
        <input type="number" id="monto_asesor" name="monto_asesor" />
      </div>
      <div class="form-group">
        <label for="monto_supervisor">Monto Supervisor:</label>
        <input type="number" id="monto_supervisor" name="monto_supervisor" />
      </div>
      <div class="form-group">
        <label for="monto_gerente">Monto Gerente:</label>
        <input type="number" id="monto_gerente" name="monto_gerente" />
      </div>
      <div class="form-group">
        <label for="supervisor">Supervisor:</label>
        <input type="text" id="supervisor" name="supervisor" />
      </div>
      <div class="form-group">
        <label for="asesor">Asesor:</label>
        <input type="text" id="asesor" name="asesor" />
      </div>
      <div class="form-group">
        <label for="calificacion">Calificación:</label>
        <input type="text" id="calificacion" name="calificacion" />
      </div>
      <div class="form-group">
        <label for="observacion">Observación:</label>
        <textarea id="obs" name="observacion"></textarea>
      </div>
      <div class="modal-footer">
        <button type="submit" class="create-btn">Guardar</button>
        <button type="button" class="cancel-btn" onclick="cerrarEditarComisiones()">Cancelar</button>
      </div>
    </form>
  
  `;

  // Cargar datos al formulario a través de la API
  const token = localStorage.getItem("token");
  fetch(`${API_BASE_URL}/comisiones/${id}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Error al obtener los datos de la comisión");
      }
      return res.json();
    })
    .then(data => {
      const comision = data;
      console.log("Datos de la comisión:", comision);
      if (comision) {
        document.getElementById('id').value = comision.id ?? '';
        document.getElementById('nombre_cliente').value = comision.nombre_cliente ?? '';
        document.getElementById('cedula').value = comision.cedula ?? '';
        document.getElementById('monto').value = comision.monto ?? '';
        document.getElementById('porcentaje').value = comision.porcentaje ?? '';
        document.getElementById('entidad').value = comision.entidad ?? '';
        document.getElementById('comision_bruto').value = comision.comision_bruto ?? '';
        document.getElementById('monto_asesor').value = comision.monto_asesor ?? '';
        document.getElementById('monto_supervisor').value = comision.monto_supervisor ?? '';
        document.getElementById('monto_gerente').value = comision.monto_gerente ?? '';
        document.getElementById('supervisor').value = comision.supervisor ?? '';
        document.getElementById('asesor').value = comision.asesor ?? '';
        document.getElementById('calificacion').value = comision.calificacion ?? '';
        document.getElementById('obs').value = comision.obs ?? '';
      }
    })
    .catch(err => {
      console.error(err);
      alert("Error al cargar los datos de la comisión");
    });
}

export function GuardarCambiosComision() {
  const id = document.getElementById('id').value;
  const nombre_cliente = document.getElementById('nombre_cliente').value;
  const cedula = document.getElementById('cedula').value;
  const monto = document.getElementById('monto').value;
  const porcentaje = document.getElementById('porcentaje').value;
  const entidad = document.getElementById('entidad').value;
  const comision_bruto = document.getElementById('comision_bruto').value;
  const monto_asesor = document.getElementById('monto_asesor').value;
  const monto_supervisor = document.getElementById('monto_supervisor').value;
  const monto_gerente = document.getElementById('monto_gerente').value;
  const supervisor = document.getElementById('supervisor').value;
  const asesor = document.getElementById('asesor').value;
  const calificacion = document.getElementById('calificacion').value;
  const obs = document.getElementById('obs').value;

  const url = `${API_BASE_URL}/comisiones/${id}`;
  const token = localStorage.getItem("token");

  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id,
      nombre_cliente,
      cedula,
      monto,
      porcentaje,
      entidad,
      comision_bruto,
      monto_asesor,
      monto_supervisor,
      monto_gerente,
      supervisor,
      asesor,
      calificacion,
      obs
    }),
  })
  .then(res => {
    if (!res.ok) {
      throw new Error("Error al actualizar la comisión");
    }
    return res.json();
  }).then(data => {
    document.getElementById('modal-editar-comision').style.display = 'none';
    showDialog('success', 'Comisión actualizada correctamente');
    mostrarComisiones(); // Recargar las comisiones después de guardar
  })    
  .catch(err => {
    console.error(err);
    showDialog('error', 'Error al actualizar la comisión: ' + err.message);
  });
}

export function EliminarComision(id) {
  const url = `${API_BASE_URL}/comisiones/${id}`;
  const token = localStorage.getItem("token");

  return fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Error al eliminar la comisión");
      }
      return res.json();
    })
    .then(data => {
      console.log("Comisión eliminada:", data);
      showDialog('success', 'Comisión eliminada correctamente');
      mostrarComisiones(); // Recargar las comisiones después de eliminar
    })
    .catch(err => {
      console.error(err);
      showDialog('error', 'Error al eliminar la comisión: ' + err.message);
    });
}
