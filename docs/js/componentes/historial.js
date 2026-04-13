import { cargarHistorial,manejarClickOperacion,guardarActualizacion,mostrarEliminarHistorial,EliminarHistorial} from "../api/historial_api.js";

export function mostrarHistorial() {
  document.getElementById('contenido').innerHTML = `
    <div class="header">
      <h1>Historial de Créditos</h1>
    </div>
    <!-- ------------------------Controles de filtro y búsqueda------------------------------------------------------->
    <div class="controls">
      <div class="control-filtros">
        <label for="filter_by">Filtrar por:</label>
        <select id="filtros-historial-select" name="filter_by">
          <option value="num_operacion">ID</option>
          <option value="documento">DOCUMENTO</option>
          <option value="contacto">CONTACTO</option>
          <option value="marca">MARCA</option>
          <option value="tipo">TIPO</option>
          <option value="faja">FAJA</option>
          <option value="categoria">CATEGORIA</option>
          <option value="importe">IMPORTE</option>
          <option value="responsable">ASESOR</option>
          <option value="comision">COMISION</option>
        </select>
        <input type="text" id="filtros-historial-busqueda" placeholder="Buscar por ..." />
      
          <label for="fecha_inicio">Inicio:</label>
          <input type="date" id="fecha_inicio" value="">
          <label for="fecha_fin">Fin:</label>
          <input type="date" id="fecha_fin" value="">
          <button class="boton-buscar-historial" id="boton-buscar-historial">Buscar</button>
          <button class="limpiar-filtros" id="limpiar-filtros">Limpiar Filtros</button>
          <label for="limitador">Limitar a:</label>
          <select id="limitador" name="limitador">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

    <!-- ------------------------Tabla de historial------------------------------------------------------->
    <div class="table-responsive">
      <table id="tabla">
        <thead>
          <tr>
           
            <th>Acciones</th>
            <th>ID</th>
            <th>FECHA</th>
            <th>DOCUMENTO</th>
            <th>CONTACTO</th>
            <th>MARCA</th>
            <th>TIPO</th>
            <th>FAJA</th>
            <th>CATEGORIA</th>
            <th>IMPORTE</th>
            <th>ASESOR</th>
            <th>COMISION</th>
            <th>ESTADO</th>
            <th>OBSERVACIONES</th>
          </tr>
        </thead>
        <tbody id="tbody-operaciones">
          
        </tbody>
      </table>
      <!-- ------------------------Formulario para editar historial------------------------------------------------------->
      <div class="modal-crear" id="modal-editar-historial" style="display: none;"> 
        <div class="modal-header">
          <h2>Editar Historial</h2>
        </div>
        <form class="modal-form" id="form-editar-historial">
          <div class="form-group">
            <label for="id">ID:</label>
            <input type="text" id="id" name="id" disabled />
          </div>
          <div class="form-group">
            <label for="documento">Documento:</label>
            <input type="text" id="documento" name="documento" />
          </div>
          <div class="form-group">
            <label for="contacto">Contacto:</label>
            <input type="text" id="contacto" name="contacto" />
          </div>
          <div class="form-group">
            <label for="marca">Marca:</label>
            <input type="text" id="marca" name="marca" />
          </div>
          <div class="form-group">
            <label for="tipo">Tipo:</label>
            <input type="text" id="tipo" name="tipo" />
          </div>
          <div class="form-group">
            <label for="faja">Faja:</label>
            <input type="text" id="faja" name="faja" />
          </div>
          <div class="form-group">
            <label for="categoria">Categoría:</label>
            <input type="text" id="categoria" name="categoria" />
          </div>
          <div class="form-group">
            <label for="importe">Importe:</label>
            <input type="number" id="importe" name="importe" />
          </div>
          <div class="form-group">
            <label for="asesor">Asesor:</label>
            <input type="text" id="asesor" name="asesor" />
          </div>
          <div class="form-group">
            <label for="comision">Comisión:</label>
            <input type="number" id="comision" name="comision" />
          </div>
          <div class="form-group">
            <label for="estado">Estado:</label>
            <select id="estado" name="estado">
              <option value="CANCELADO">Cancelado</option>
              <option value="INGRESADO">Ingresado</option>
              <option value="APROBADO">Aprobado</option>
              <option value="DESEMBOLSADO">Desembolsado</option>
            </select>
          </div>
          <div class="form-group">
            <label for="observaciones">Observaciones:</label>
            <textarea id="observaciones" name="observaciones"></textarea>
          </div>
          <div class="modal-footer">
            <button type="submit" class="create-btn">Guardar</button>
            <button type="button" class="cancel-btn" onclick="cerrarModificarHistorial()">Cancelar</button>
          </div>
        </form>
      </div>
      <!-- ------------------------Fin del formulario de edición------------------------------------------------------->
      <div class="modal-confirmacion" id="modal-eliminar-historial">
       
      </div>
      <!-- ------------------------Botones de paginación y exportación------------------------------------------------------->
    </div>
    <div class="pagination">
      <button id="cancelado" 
              style="background-color: red; color: white;" 
              onclick="filtrarPorEstado('cancelado')">
        Cancelado
      </button>

      <button id="ingresado" 
              style="background-color: orange; color: white;" 
              onclick="filtrarPorEstado('ingresado')">
        Ingresado
      </button>

      <button id="aprobado" 
              style="background-color: blue; color: white;" 
              onclick="filtrarPorEstado('aprobado')">
        Aprobado
      </button>

      <button id="desembolsado" 
              style="background-color: green; color: white;" 
              onclick="filtrarPorEstado('desembolsado')">
        Desembolsado
      </button>
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

  // Variables de paginación y referencias DOM
  let currentPage = 1;
  let limit = 10;

  
  let totalPages = 1;
  const limitadorSelect = document.getElementById("limitador");
  // Referencias a los elementos del DOM
  const inputBusqueda = document.getElementById("filtros-historial-busqueda");
  const selectCampo = document.getElementById("filtros-historial-select");
  const fechaInicioInput = document.getElementById("fecha_inicio");
  const fechaFinInput = document.getElementById("fecha_fin");
  const botonBuscarHistorial = document.getElementById("boton-buscar-historial");
  
  const btnAnterior = document.getElementById("btn-anterior");
  const btnSiguiente = document.getElementById("btn-siguiente");
  const pageNumberSpan = document.getElementById("page-number");
  //---------------------------------------------------------------------------------------------
  const tbody = document.getElementById("tbody-operaciones");

  tbody.addEventListener("click", function (event) {
    const btnEditar = event.target.closest(".btn-editar");
    const btnEliminar = event.target.closest(".btn-eliminar");

    const tr = event.target.closest("tr");
    if (!tr || !tr.id) return;

    const operacionId = tr.id;

    if (btnEditar) {
      manejarClickOperacion(operacionId);
    } else if (btnEliminar) {
      mostrarEliminarHistorial(operacionId);
    }
  });

  // Agregar esto después de las referencias DOM (línea ~158)
  const formEditarHistorial = document.getElementById("form-editar-historial");

  // Event listener para el formulario de edición
  formEditarHistorial.addEventListener("submit", function(e) {
    e.preventDefault(); // ← Esto evita que se recargue la página
    guardarActualizacion(); // Llamar a tu función
  });




  //---------------------------------------------------------------------------------------------


  window.guardarActualizacion = guardarActualizacion;
  window.exportarExcel = exportarExcel;
  window.EliminarHistorial = EliminarHistorial;
  //--------------------------------------------------------------------------------------------------
  function exportarExcel() {
    const tabla = document.getElementById("tabla");
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



  function updatePaginationButtons() {
    if (totalPages < 1) totalPages = 1;
    btnAnterior.disabled = currentPage <= 1;
    btnSiguiente.disabled = currentPage >= totalPages;
    pageNumberSpan.textContent = `Página ${currentPage} de ${totalPages}`;
  }

  function aplicarFiltro(campoManual = null, valorManual = null, fechaInicio = null, fechaFin = null) {
    currentPage = 1;
    const campo = campoManual || selectCampo.value;
    const valor = valorManual || inputBusqueda.value.trim();
    const valorTexto = String(valor);
    const fechaInicioTexto = fechaInicio || fechaInicioInput.value;
    const fechaFinTexto = fechaFin || fechaFinInput.value;

    cargarHistorial(campo, valorTexto, currentPage, limit, fechaInicioTexto, fechaFinTexto)
      .then(pagination => {
        totalPages = pagination.totalPages;
        updatePaginationButtons();
      });
  }

  function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    const campo = selectCampo.value;
    const valor = inputBusqueda.value.trim();
    const valorTexto = String(valor);
    const fechaInicioTexto = fechaInicioInput.value;
    const fechaFinTexto = fechaFinInput.value;

    cargarHistorial(campo, valorTexto, currentPage, limit, fechaInicioTexto, fechaFinTexto)
      .then(pagination => {

        totalPages = pagination.totalPages;
        updatePaginationButtons();
      });
  }


  botonBuscarHistorial.addEventListener("click", (e) => {
    e.preventDefault();
    aplicarFiltro();
  });
  inputBusqueda.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      aplicarFiltro();
    }
  });



  btnAnterior.addEventListener("click", () => {
    goToPage(currentPage - 1);
  });

  btnSiguiente.addEventListener("click", () => {
    goToPage(currentPage + 1);
  });

  function filtrarPorEstado(estado) {
    aplicarFiltro("estado", estado);
  }

  window.filtrarPorEstado = filtrarPorEstado;

  // Cargar inicialmente sin filtro
  cargarHistorial("num_operacion", "", currentPage, limit, null, null)
    .then(pagination => {
      console.log("Respuesta paginación:", pagination);
      totalPages = pagination.totalPages;
      updatePaginationButtons();
    });


    document.getElementById('limpiar-filtros').addEventListener('click', (e) => {

      e.preventDefault();
      inputBusqueda.value = null;
      selectCampo.value = "num_operacion";
      fechaInicioInput.value = null;
      fechaFinInput.value = null;
      cargarHistorial("num_operacion", "", currentPage, limit, null, null)
        .then(pagination => {
          totalPages = pagination.totalPages;
          updatePaginationButtons();
        });
    });


    limitadorSelect.addEventListener("change", (e) => {
      limit = parseInt(e.target.value);
      currentPage = 1;
      aplicarFiltro();
    });


}





