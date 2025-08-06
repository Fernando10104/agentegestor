import {mostrarEliminarCliente,EliminarCliente, cargarClientes,cargarMarcas,CargarCredito,CrearClientes,mostrarEditarCliente,guardarActualizacionCliente } from "../api/operaciones.js";
import { 
  mostrarCargarCredito, 
  ocultarCargarCredito, 
  mostrarCargarCliente, 
  ocultarCargarCliente } from "./modales.js";
window.EliminarCliente = EliminarCliente;
window.mostrarCargarCredito = mostrarCargarCredito;
window.ocultarCargarCredito = ocultarCargarCredito;
window.mostrarCargarCliente = mostrarCargarCliente;
window.ocultarCargarCliente = ocultarCargarCliente;
window.guardarActualizacionCliente = guardarActualizacionCliente;

export function mostrarCreditos() {
  document.getElementById('contenido').innerHTML = `
    <div class="header">
      <h1>Registros credito</h1>
    </div>
    <div class="controls">
      <label for="filter_by">Filtrar Clientes:</label>
      <select id="filter_by" name="filter_by">
        <option value="nombre">Nombre</option>
        <option value="documento">Documento</option>
        <option value="contacto">Contacto</option>
        <option value="direccion">Dirección</option>
        <option value="correo">Correo</option>
        <option value="estado_cred">Estados Créditos</option>
        <option value="e_registro">Asesor</option>
      </select>
      <input type="text" id="input-busqueda-clientes" placeholder="Buscar por ..." />
      <button id="btn-buscar-clientes">Buscar</button>

      <button onclick="mostrarCargarCliente()">CARGAR CLIENTES</button>
      <button onclick="mostrarCargarCredito()">CARGAR CREDITO</button>
      <div class="limit-records" style="display: none;">
        <input type="checkbox" id="limit_records" name="limit_records">
        <label for="limit_records">Limitar 50 registros</label>
      </div>
      <label for="limitador">Limitar a:</label>
          <select id="limitador" name="limitador">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
    </div>
    <div class="table-responsive">
      <table id="tabla-clientes" >
        <thead>
          <tr>
            <th>BR</th>
            <th>ED</th>
            <th>Id</th>
            <th>Nombre</th>
            <th>Documento</th>
            <th>Contacto</th>
            <th>Direccion</th>
            <th>Correo</th>
            <th>Faja Inforcomf</th>
            <th>Estado Credito</th>
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
        <div class="cargar-credito" id="cargar-credito" style="display: none;">
          <form class="cargar-credito-form">
          <h2>Cargar Crédito</h2>
          <br>
          <label for="cedula">Cédula:</label><br>
          <input type="text" id="cedula" name="cedula"><br>
          <label for="celular">Celular:</label><br>
          <input type="text" id="celular" name="celular"><br>
          <label for="faja">Faja:</label><br>
          <input type="text" id="faja" name="faja"><br>

          <label for="categoria">Categoría:</label><br>
          <select id="categoria" name="categoria">
            <option value="ASALARIADO CON IPS">ASALARIADO CON IPS</option>
            <option value="ASALARIADO CON IVA">ASALARIADO CON IVA</option>
            <option value="COMERCIANTE">COMERCIANTE</option>
            <option value="FUNCIONARIO BANCARIO">FUNCIONARIO BANCARIO</option>
            <option value="FUNCIONARIO PUBLICO CONTRATADO">FUNCIONARIO PUBLICO CONTRATADO</option>
            <option value="FUNCIONARIO PUBLICO PERMANENTE">FUNCIONARIO PUBLICO PERMANENTE</option>
            <option value="INFORMAL">INFORMAL</option>

          </select><br>

          <label for="marca">Marca:</label><br>
          <select id="marca" name="marca">
          </select><br>

          <label for="tipo_comision">Tipo de Comisión:</label><br>
          <select id="tipo_comision" name="tipo_comision">
            <option value="nuevo">Nuevo</option>
            <option value="renovacion">Renovación</option>
          </select><br>

          <label for="tipo_credito">Tipo de Crédito:</label><br>
          <select id="tipo_credito" name="tipo_credito">
            <option value="Ventanilla">Ventanilla</option>
            <option value="Debito">Debito</option>
            <option value="Credito">Credito</option>
          </select><br>

          <label for="importe">Importe:</label><br>
          <input type="text" id="importe" name="importe"><br>
          <label for="obs">Obs:</label><br>
          <textarea id="obs" name="obs"></textarea><br>
          <div>
            <button type="submit">Insertar Crédito</button>
            <button type="button" style="background-color: red;" onclick="ocultarCargarCredito()">Cerrar</button>
            
          </div>
          
          </form>

        </div>

        <div class="cargar-clientes" id="cargar-cliente" style="display: none;">
          <form class="cargar-clientes-form">
          <h2>Cargar Cliente</h2>
          <br>
          <label for="cedula">Cédula:</label><br>
          <input type="text" id="documento" name="cedula"><br>

          <label for="Nombre">Nombre:</label><br>
          <input type="text" id="Nombre" name="Nombre"><br>

          <label for="Celular">Celular:</label><br>
          <input type="text" id="Celular" name="Celular"><br>

          <label for="Direccion">Direccion:</label><br>
          <input type="text" id="Direccion" name="Direccion"><br>

          
          <label for="correo">Correo:</label><br>
          <input type="email" id="correo" name="correo"><br>

          <label for="faja">Faja:</label><br>
          <input type="text" id="faja_inforcomf" name="faja"><br>

          
          <div>
            <button type="submit">Insertar Cliente</button>
            <button type="button" style="background-color: red;" onclick="ocultarCargarCliente()">Cerrar</button>
            
          </div>
          
          </form>
          
        </div>

        <!-- ------------------------Formulario para editar historial------------------------------------------------------->
        <div class="modal-editar-clientes" id="modal-editar-clientes"> 
          <form id="form-editar-clientes">
            <h2>Editar Cliente</h2>
            <div class="form-group">
              <label for="id">ID:</label>
              <input type="text" id="id" name="id" disabled />
            </div>
            <div class="form-group">
              <label for="nombre">Nombre:</label>
              <input type="text" id="nombre" name="nombre" />
            </div>
            <div class="form-group">
              <label for="documento">Documento:</label>
              <input type="text" id="documento/1" name="documento" />
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
              <label for="correo">Correo:</label>
              <input type="text" id="correo/1" name="correo" />
            </div>
            <div class="form-group">
              <label for="faja">Faja:</label>
              <input type="text" id="faja-1" name="faja" />
            </div>
            
            <div class="form-group">
              <label for="asesor">Asesor:</label>
              <input type="text" id="asesor" name="asesor" disabled/>
            </div>
            <div class="form-group">
              <label for="estado">Estado:</label>
              <select id="estado-1" name="estado">
                <option value="CANCELADO">Cancelado</option>
                <option value="INGRESADO">Ingresado</option>
                <option value="APROBADO">Aprobado</option>
                <option value="DESEMBOLSADO">Desembolsado</option>
              </select>
            </div>
           
            <div class="form-actions">
              <button type="submit" class="btn-guardar">Guardar</button>
              <button type="button" class="btn-cancelar" onclick="cerrarModificarCliente()">Cancelar</button>
            </div>
          </form>
        </div>
        <!-- ------------------------Fin del formulario de edición------------------------------------------------------->
        <div class="modal-eliminar-historial" id="modal-eliminar-cliente">
        </div>
       
        
        <div class="footer-buttons">
          <button onclick="exportarExcel()" class="export-excel">Exportar a excel</button>
        </div>
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

  function aplicarFiltro(campoManual = null, valorManual = null) {
  currentPage = 1;

  const campo = campoManual || selectCampo.value;
  const valor = valorManual || inputBusqueda.value.trim();
  const valorTexto = String(valor);

  cargarClientes(campo, valorTexto, currentPage, limit)
    .then(pagination => {
      totalPages = pagination.totalPages;
      updatePaginationButtons();
    });
  }

   const formEditarClientes = document.getElementById("form-editar-clientes");

    // Event listener para el formulario de edición
    formEditarClientes.addEventListener("submit", function(e) {
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

  inputBusqueda.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      aplicarFiltro();
    }
  });
  document.getElementById("btn-buscar-clientes").addEventListener("click", (e) => {
    e.preventDefault();
    aplicarFiltro();
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

