import { mostrarEliminarCliente, EliminarCliente, cargarClientes, cargarMarcas, CargarCredito, CrearClientes, mostrarEditarCliente, guardarActualizacionCliente } from "../operaciones/operaciones_api.js";
import {
  mostrarCargarCredito,
  ocultarCargarCredito,
  mostrarCargarCliente,
  ocultarCargarCliente
} from "../../../js/componentes/modales.js";
window.EliminarCliente = EliminarCliente;
window.mostrarCargarCredito = mostrarCargarCredito;
window.ocultarCargarCredito = ocultarCargarCredito;
window.mostrarCargarCliente = mostrarCargarCliente;
window.ocultarCargarCliente = ocultarCargarCliente;
window.guardarActualizacionCliente = guardarActualizacionCliente;
window.mostrarEditarCliente = mostrarEditarCliente;
window.mostrarEliminarCliente = mostrarEliminarCliente;
window.cargarClientes = cargarClientes;
window.cargarMarcas = cargarMarcas;
window.CargarCredito = CargarCredito;
window.CrearClientes = CrearClientes;

export function mostrarCreditos() {
  document.getElementById('contenido').innerHTML = `
    <div class="header">
      <h1>Registro Clientes</h1>
    </div>
    <div class="controls">
      <div class="control-filtros">
        <label for="filter_by">Filtrar Clientes:</label>
        <select id="filter_by" name="filter_by">
          <option value="nombre">Nombre</option>
          <option value="documento">Documento</option>
          <option value="contacto">Contacto</option>
          <option value="direccion">Dirección</option>
          <option value="correo">Correo</option>
          <option value="e_registro">Asesor</option>
        </select>
      
        <input type="text" id="input-busqueda-clientes" placeholder="Buscar por ..." />
        <button id="btn-buscar-clientes">Buscar</button>

        <button onclick="mostrarCargarCliente()">CARGAR CLIENTES</button>
        <button onclick="mostrarCargarCredito() style="display: none; ">CARGAR CREDITO</button>
        <div class="limit-records" style="display: none;">
          <input type="checkbox" id="limit_records" name="limit_records">
          <label for="limit_records">Limitar 50 registros</label>
        </div>
        <label for="limitador">Limitar a:</label>
            <select id="limitador" name="limitador">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
      </div>
    </div>
    <div class="table-responsive">
      <table id="tabla-clientes" >
        <thead>
          <tr>
            
            <th>Acciones</th>
            <th>Id</th>
            <th>Nombre</th>
            <th>Documento</th>
            <th>Contacto</th>
            <th>Direccion</th>
            <th>Correo</th>
            <th>Faja Inforcomf</th>
            <th>Asesor</th>
            <th>Fecha Registro</th>
          </tr>
        </thead>
        <tbody id="tbody-clientes">
          <tr><td colspan="10" style="text-align:center;">Cargando...</td></tr>
        </tbody>
      </table>
    </div>
    
    <div class="pagination">
      <button id="cancelado" onclick="filtrarPorEstado('cancelado')">Cancelado</button>
      <button id="ingresado" onclick="filtrarPorEstado('ingresado')">Ingresado</button>
      <button id="aprobado" onclick="filtrarPorEstado('aprobado')">Aprobado</button>
      <button id="desembolsado" onclick="filtrarPorEstado('desembolsado')">Desembolsado</button>
    </div>

    <div class="pagination">
      <button id="btn-anterior" disabled>Anterior</button>
      <span id="page-number">Página 1</span>
      <button id="btn-siguiente">Siguiente</button>
    </div>

        <div class="modal-crear" id="cargar-credito" style="display: none;">
          <div class="modal-header">
            <h2>Cargar Crédito</h2>
          </div>
          <form class="modal-form" id="cargar-credito-form">
            <div class="form-group">
              <label for="cedula">Cédula:</label>
              <input type="text" id="cedula" name="cedula">
            </div>
            <div class="form-group">
              <label for="celular">Celular:</label>
              <input type="text" id="celular" name="celular">
            </div>
            <div class="form-group">
              <label for="faja">Faja:</label>
              <input type="text" id="faja" name="faja">
            </div>
            <div class="form-group">
              <label for="categoria">Categoría:</label>
              <select id="categoria" name="categoria">
                <option value="ASALARIADO CON IPS">ASALARIADO CON IPS</option>
                <option value="ASALARIADO CON IVA">ASALARIADO CON IVA</option>
                <option value="COMERCIANTE">COMERCIANTE</option>
                <option value="FUNCIONARIO BANCARIO">FUNCIONARIO BANCARIO</option>
                <option value="FUNCIONARIO PUBLICO CONTRATADO">FUNCIONARIO PUBLICO CONTRATADO</option>
                <option value="FUNCIONARIO PUBLICO PERMANENTE">FUNCIONARIO PUBLICO PERMANENTE</option>
                <option value="INFORMAL">INFORMAL</option>

              </select>
            </div>
            <div class="form-group">
              <label for="marca">Marca:</label>
              <select id="marca" name="marca">
              </select>
            </div>
            <div class="form-group">
              <label for="tipo_comision">Tipo de Comisión:</label>
              <select id="tipo_comision" name="tipo_comision">
                <option value="nuevo">Nuevo</option>
                <option value="renovacion">Renovación</option>
              </select>
            </div>
            <div class="form-group">
              <label for="tipo_credito">Tipo de Crédito:</label>
              <select id="tipo_credito" name="tipo_credito">
                <option value="Ventanilla">Ventanilla</option>
                <option value="Debito">Debito</option>
                <option value="Credito">Credito</option>
              </select>
            </div>
            <div class="form-group">
              <label for="importe">Importe:</label>
              <input type="text" id="importe" name="importe">
            </div>
            <div class="form-group">
              <label for="obs">Obs:</label>
              <textarea id="obs" name="obs"></textarea>
            </div>
            <div class="modal-footer">
              <button type="submit" class="create-btn">Insertar Crédito</button>
              <button type="button" class="cancel-btn " style="background-color: red;" onclick="ocultarCargarCredito()">Cerrar</button>

            </div>
          
          </form>

        </div>

        <div class="modal-crear" id="cargar-cliente" style="display: none;">
          <div class="modal-header">
              <h2>Cargar Cliente</h2>
          </div>
          <form class="modal-form" id="cargar-clientes-form">
              <div style="padding: 1.5rem; overflow-y: auto;">
                  <h3 style="margin: 0 0 1rem 0; font-size: 1rem; color: #b3b3b3;">Datos del Cliente</h3>
                  <div class="form-group">
                      <label for="documento">Cédula:</label>
                      <input type="text" id="documento" name="cedula" required>
                  </div>
                  <div class="form-group">
                      <label for="Nombre">Nombre:</label>
                      <input type="text" id="Nombre" name="Nombre" required>
                  </div>
                  <div class="form-group">
                      <label for="Celular">Celular:</label>
                      <input type="text" id="Celular" name="Celular">
                  </div>
                  <div class="form-group">
                      <label for="Direccion">Dirección:</label>
                      <input type="text" id="Direccion" name="Direccion">
                  </div>
                  <div class="form-group">
                      <label for="correo">Correo:</label>
                      <input type="email" id="correo" name="correo">
                  </div>
                  <div class="form-group">
                      <label for="faja_inforcomf">Faja:</label>
                      <input type="text" id="faja_inforcomf" name="faja">
                  </div>

                  <h3 style="margin: 1.5rem 0 1rem 0; font-size: 1rem; color: #b3b3b3;">Datos del Crédito (Opcional)</h3>
                  <div class="form-group">
                      <label for="cliente_categoria">Categoría:</label>
                      <select id="cliente_categoria" name="categoria">
                          <option value="">-- Seleccionar --</option>
                          <option value="ASALARIADO CON IPS">ASALARIADO CON IPS</option>
                          <option value="ASALARIADO CON IVA">ASALARIADO CON IVA</option>
                          <option value="COMERCIANTE">COMERCIANTE</option>
                          <option value="FUNCIONARIO BANCARIO">FUNCIONARIO BANCARIO</option>
                          <option value="FUNCIONARIO PUBLICO CONTRATADO">FUNCIONARIO PUBLICO CONTRATADO</option>
                          <option value="FUNCIONARIO PUBLICO PERMANENTE">FUNCIONARIO PUBLICO PERMANENTE</option>
                          <option value="INFORMAL">INFORMAL</option>
                      </select>
                  </div>
                  <div class="form-group">
                      <label for="cliente_marca">Marca:</label>
                      <select id="cliente_marca" name="marca">
                          <option value="">-- Seleccionar --</option>
                      </select>
                  </div>
                  <div class="form-group">
                      <label for="cliente_tipo_comision">Tipo de Comisión:</label>
                      <select id="cliente_tipo_comision" name="tipo_comision">
                          <option value="">-- Seleccionar marca primero --</option>
                      </select>
                  </div>
                  <div class="form-group">
                      <label for="cliente_tipo_credito">Tipo de Crédito:</label>
                      <select id="cliente_tipo_credito" name="tipo_credito">
                          <option value="">-- Seleccionar --</option>
                          <option value="Ventanilla">Ventanilla</option>
                          <option value="Debito">Débito</option>
                          <option value="Credito">Crédito</option>
                      </select>
                  </div>
                  <div class="form-group">
                      <label for="cliente_importe">Importe:</label>
                      <input type="text" id="cliente_importe" name="importe" placeholder="Dejar vacío si no desea crear crédito">
                  </div>
                  <div class="form-group">
                      <label for="cliente_obs">Observaciones:</label>
                      <textarea id="cliente_obs" name="obs" placeholder="Observaciones del crédito (opcional)"></textarea>
                  </div>
              </div>
              <div class="modal-footer">
                  <button type="submit" class="create-btn">Insertar Cliente</button>
                  <button type="button" class="cancel-btn" style="background-color: red;" onclick="ocultarCargarCliente()">Cerrar</button>
              </div>
          </form>
        </div>

       

        <!-- ------------------------Formulario para editar historial------------------------------------------------------->
        <div class="modal-crear" id="modal-editar-clientes" style="display: none;">
    <div class="modal-header">
        <h2>Editar Cliente</h2>
    </div>
    <form class="modal-form" id="form-editar-clientes">
        <div class="form-group">
            <label for="id">ID:</label>
            <input type="text" id="id" name="id" disabled />
        </div>
        <div class="form-group">
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" />
        </div>
        <div class="form-group">
            <label for="documento/1">Documento:</label>
            <input type="text" id="documento/1" name="documento" disabled />
        </div>
        <div class="form-group">
            <label for="contacto">Contacto:</label>
            <input type="text" id="contacto" name="contacto" />
        </div>
        <div class="form-group">
            <label for="direccion">Dirección:</label>
            <input type="text" id="direccion" name="direccion" />
        </div>
        <div class="form-group">
            <label for="correo/1">Correo:</label>
            <input type="email" id="correo/1" name="correo" />
        </div>
        <div class="form-group">
            <label for="faja-1">Faja:</label>
            <input type="text" id="faja-1" name="faja" />
        </div>
        <div class="form-group">
            <label for="asesor">Asesor:</label>
            <input type="text" id="asesor" name="asesor" disabled/>
        </div>
        <div class="modal-footer">
            <button type="submit" class="create-btn">Guardar</button>
            <button type="button" class="cancel-btn" onclick="cerrarModificarCliente()">Cancelar</button>
        </div>
    </form>
</div>
        <!-- ------------------------Fin del formulario de edición------------------------------------------------------->
        <div class="modal-confirmacion" id="modal-eliminar-cliente">
        </div>


        <div class="footer-buttons" >
          <button onclick="exportarExcel()" class="export-excel">Exportar a excel</button>
        </div>

        <dialog id="errorDialog" closedby="any">
          <h3>❌ ERROR</h3>
          <p>Cliente ya existe</p>
          <form method="dialog">
            <button id="closeDialog">Cerrar</button>
          </form>
        </dialog>
  `;

  let currentPage = 1;
  let limit = 10;
  let totalPages = 1; // Inicializamos totalPages
  const limitadorSelect = document.getElementById("limitador");
  const inputBusqueda = document.getElementById("input-busqueda-clientes");
  const selectCampo = document.getElementById("filter_by");
  const btnAnterior = document.getElementById("btn-anterior");
  const btnSiguiente = document.getElementById("btn-siguiente");
  const pageNumberSpan = document.getElementById("page-number");

  const tbody = document.getElementById("tbody-clientes");

  tbody.addEventListener("click", function (event) {
    const btnEditar = event.target.closest(".btn-editar");
    const btnEliminar = event.target.closest(".btn-eliminar");

    const tr = event.target.closest("tr");
    if (!tr || !tr.id) return;

    const operacionId = tr.id;

    if (btnEditar) {
      mostrarEditarCliente(operacionId);
    } else if (btnEliminar) {
      mostrarEliminarCliente(operacionId);
    }
  });

  function updatePaginationButtons() {
    btnAnterior.disabled = currentPage === 1;
    btnSiguiente.disabled = currentPage === totalPages;
    pageNumberSpan.textContent = `Página ${currentPage} de ${totalPages}`;
  }

  async function aplicarFiltro(campoManual = null, valorManual = null) {
    console.log("Aplicando filtro...");
    currentPage = 1;
    
    const campo = campoManual || selectCampo.value;
    const valor = valorManual || inputBusqueda.value.trim();
    const valorTexto = String(valor);

    await cargarClientes(campo, valorTexto, currentPage, limit)
      .then(pagination => {
        totalPages = pagination.totalPages;
        updatePaginationButtons();
      });
  }

  const formEditarClientes = document.getElementById("form-editar-clientes");

  // Event listener para el formulario de edición
  formEditarClientes.addEventListener("submit", function (e) {
    e.preventDefault(); // ← Esto evita que se recargue la página
    guardarActualizacionCliente(); // Llamar a tu función
  });


  function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    const campo = selectCampo.value;
    const valor = inputBusqueda.value.trim();
    const valorTexto = String(valor);

    cargarClientes(campo, valorTexto, currentPage, limit)
      .then(pagination => {
        totalPages = pagination.totalPages;
        updatePaginationButtons();
      });
  }

  inputBusqueda.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const btn2 = document.getElementById("btn-buscar-clientes");
      btn2.textContent = "Buscando...";
      btn2.disabled = true;
      try {
        await aplicarFiltro(); // esperar que termine la búsqueda
      } finally {
        // Restaurar botón
        btn2.textContent = "Buscar";
        btn2.disabled = false;
      }

    }
  });
  document.getElementById("btn-buscar-clientes").addEventListener("click", async (e) => {
    e.preventDefault();
    const btn = e.target;
    const textoOriginal = btn.textContent;
    // Mostrar estado "Buscando..."
    btn.textContent = "Buscando...";
    btn.disabled = true;

    try {
      await aplicarFiltro(); // esperar que termine la búsqueda
    } finally {
      // Restaurar botón
      btn.textContent = textoOriginal;
      btn.disabled = false;
    }
  });

  selectCampo.addEventListener("change", () => aplicarFiltro());

  btnAnterior.addEventListener("click", () => {
    goToPage(currentPage - 1);
  });

  btnSiguiente.addEventListener("click", () => {
    goToPage(currentPage + 1);
  });
  function filtrarPorEstado(estado) {
    aplicarFiltro("estado_cred", estado);  // corregí si el campo es "estado_cred"
  }

  window.filtrarPorEstado = filtrarPorEstado;

  // Cargar inicialmente sin filtro
  cargarClientes("nombre", "", currentPage, limit)
    .then(pagination => {
      totalPages = pagination.totalPages;
      updatePaginationButtons();
    });
  // Cargar las marcas al cargar la página
  cargarMarcas();
  CargarCredito();
  CrearClientes();



  limitadorSelect.addEventListener("change", (e) => {
    limit = parseInt(e.target.value);
    currentPage = 1;
    aplicarFiltro();
  });

  function exportarExcel() {
    const tabla = document.getElementById("tabla-clientes");
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
  window.exportarExcel = exportarExcel;










}

