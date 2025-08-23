import { cargarComisiones, mostrarEditarComisiones, GuardarCambiosComision, EliminarComision, mostrarEliminarComisiones } from "../comisiones/comisiones_api.js";
window.mostrarEditarComisiones = mostrarEditarComisiones;
window.GuardarCambiosComision = GuardarCambiosComision;
window.EliminarComision = EliminarComision;
window.mostrarEliminarComisiones = mostrarEliminarComisiones;



export function mostrarComisiones() {
  document.getElementById('contenido').innerHTML = `
    
              <div class="header">
                <h1>Comisiones</h1>
              </div>

              <!-- Controles para filtrar y buscar -->

              <div class="controls">
                <div class="control-filtros">
                  <label for="filtro-select">Filtrar por:</label>
                  <select id="filtro-select">
                  <option value="nombre_cliente">Nombre</option>
                    <option value="asesor">Asesor</option>
                    <option value="cedula">CI</option>
                    <option value="entidad">Entidad</option>
                  </select>
                  <input type="text" id="filtro-input" placeholder="Buscar...">
                  <label for="fecha_inicio">Inicio:</label>
                  <input type="date" id="fecha_inicio" value="">
                  <label for="fecha_fin">Fin:</label>
                  <input type="date" id="fecha_fin" value="">
                  <button class="buscar-comisiones">Buscar</button>
                  <label for="limitador">Limitar a:</label>
                  <select id="limitador" name="limitador">
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                </div>
              </div>

              
              <!-- ---------------------------------------------------------------------------------------------------------------- -->


              <!-- Tabla de comisiones -->
              <div class="table-responsive">
                <table id="tabla-comisiones" >
                  <thead>
                    <tr>
                      <th>Acciones</th>
                      <th>ID</th>
                      <th>Fecha</th>
                      <th>Nombre cliente</th>
                      <th>CI</th>
                      <th>Monto</th>
                      <th>%</th>
                      <th>Entidad</th>
                      <th>Comision bruto</th>
                      <th>Pagado</th>
                      <th>Comision Asesor</th>
                      <th>Supervisor</th>
                      <th>Asesor</th>
                      <th>Estado</th>
                      <th>Calificacion</th>
                      <th>Sucursal</th>
                      <th>Observacion</th>
                    </tr>
                  </thead>
                  <tbody id="tbody-comisiones">
                    <tr><td colspan="15" style="text-align:center;">Cargando...</td></tr>
                  </tbody>
                </table>
              </div>
              <!-- ---------------------------------------------------------------------------------------------------------------- -->
              <div id="modal-editar-comision" ">
                
              </div>

              <div class="modal-confirmacion" id="modal-eliminar-comision" >
               
              </div>
              <div class="pagination">
                <button id="btn-anterior" disabled>Anterior</button>
                <span id="page-number">Página 1</span>
                <button id="btn-siguiente">Siguiente</button>
              </div>

              <div class="footer-buttons">
                <button onclick="exportarExcel()" class="export-excel">Exportar a excel</button>
              </div>
            
  `;

  // Variables de paginación
  let currentPage = 1;
  let limit = 10;
  let totalPages = 1;
  const limitadorSelect = document.getElementById("limitador");

  // Referencias a elementos DOM
  const btnAnterior = document.getElementById('btn-anterior');
  const btnSiguiente = document.getElementById('btn-siguiente');
  const pageNumberSpan = document.getElementById('page-number');
  const filtroSelect = document.getElementById('filtro-select');
  const filtroInput = document.getElementById('filtro-input');
  const botonBuscarComisiones = document.querySelector('.buscar-comisiones');
  const formEditarcomisiones = document.getElementById("modal-editar-comision");


  const tbody = document.getElementById("tbody-comisiones");

  tbody.addEventListener("click", function (event) {
    const btnEditar = event.target.closest(".btn-editar");
    const btnEliminar = event.target.closest(".btn-eliminar");

    const tr = event.target.closest("tr");
    if (!tr || !tr.id) return;

    const operacionId = tr.id;

    if (btnEditar) {
      mostrarEditarComisiones(operacionId);
    } else if (btnEliminar) {
      mostrarEliminarComisiones(operacionId);
    }
  });
  //--------------------------------------------------------------------------------------------------
  function exportarExcel() {
    const tabla = document.getElementById("tabla-comisiones");
    let csv = "";

    for (let fila of tabla.rows) {
      // Recorremos las celdas de cada fila correctamente
      let celdas = [...fila.cells].map(td => `${td.innerText}`).join(";");
      csv += celdas + "\n";
    }

    // Agregamos el BOM para que Excel o LibreOffice lo lean con acentos
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tabla_exportada.csv";
    link.click();
  }

  formEditarcomisiones.addEventListener("submit", function (e) {
    e.preventDefault(); // ← Esto evita que se recargue la página
    GuardarCambiosComision(); // Llamar a tu función
  });
  window.exportarExcel = exportarExcel;
  // Función para actualizar botones de paginación
  function updatePaginationButtons() {
    if (totalPages < 1) totalPages = 1;
    btnAnterior.disabled = currentPage <= 1;
    btnSiguiente.disabled = currentPage >= totalPages;
    pageNumberSpan.textContent = `Página ${currentPage} de ${totalPages}`;
  }

  // Función para aplicar filtros
  function aplicarFiltro(campoManual = null, valorManual = null, fechaInicio = null, fechaFin = null) {
    currentPage = 1;
    const campoFiltro = campoManual || filtroSelect.value;
    const valorFiltro = valorManual || filtroInput.value.trim();
    const fechaInicioFiltro = fechaInicio || document.getElementById('fecha_inicio').value;
    const fechaFinFiltro = fechaFin || document.getElementById('fecha_fin').value;

    cargarComisiones(campoFiltro, valorFiltro, currentPage, limit, fechaInicioFiltro, fechaFinFiltro)
      .then(pagination => {
        totalPages = pagination.totalPages;
        updatePaginationButtons();
      })
      .catch(error => {
        console.error("Error al aplicar filtro:", error);
      });
  }

  // Función para ir a una página específica
  function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    const campo = filtroSelect.value;
    const valor = filtroInput.value.trim();
    const fechaInicioTexto = document.getElementById('fecha_inicio').value;
    const fechaFinTexto = document.getElementById('fecha_fin').value;

    cargarComisiones(campo, valor, currentPage, limit, fechaInicioTexto, fechaFinTexto)
      .then(pagination => {
        totalPages = pagination.totalPages;
        updatePaginationButtons();
      })
      .catch(error => {
        console.error("Error al cargar página:", error);
      });
  }
  botonBuscarComisiones.addEventListener("click", (e) => {
    e.preventDefault();
    aplicarFiltro();
  });


  filtroInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      aplicarFiltro();
    }
  });



  btnAnterior.addEventListener('click', () => {
    goToPage(currentPage - 1);
  });

  btnSiguiente.addEventListener('click', () => {
    goToPage(currentPage + 1);
  });

  // Cargar comisiones inicialmente
  cargarComisiones("nombre_cliente", "", currentPage, limit)
    .then(pagination => {
      totalPages = pagination.totalPages;
      updatePaginationButtons();
      console.log("Comisiones cargadas:", pagination);
    })
    .catch(error => {
      console.error("Error al cargar comisiones:", error);
    });

  limitadorSelect.addEventListener("change", (e) => {
    limit = parseInt(e.target.value);
    currentPage = 1;
    aplicarFiltro();
  });

}
