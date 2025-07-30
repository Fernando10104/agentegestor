import { cargarClientes } from "../api/clientes.js";
import { mostrarCargarCredito, ocultarCargarCredito, mostrarCargarCliente, ocultarCargarCliente } from "./modales.js";
window.mostrarCargarCredito = mostrarCargarCredito;
window.ocultarCargarCredito = ocultarCargarCredito; 
window.mostrarCargarCliente = mostrarCargarCliente;
window.ocultarCargarCliente = ocultarCargarCliente;


export function mostrarCreditos() {
    document.getElementById('contenido').innerHTML = `
    <!-- HTML completo como ya lo tenías -->
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
    </div>
    <div class="table-responsive">
      <table>
        <thead>
          <tr>
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
              <div class="cargar-credito" id="cargar-credito" style="display: none;">
              <form class="cargar-credito-form">
              <label for="cedula">Cédula:</label><br>
              <input type="text" id="cedula" name="cedula"><br>
              <label for="celular">Celular:</label><br>
              <input type="text" id="celular" name="celular"><br>
              <label for="faja">Faja:</label><br>
              <input type="text" id="faja" name="faja"><br>
              <label for="categoria">Categoría:</label><br>
              <select id="categoria" name="categoria">
                <option value="asalariado">ASALARIADO CON IPS</option>
              </select><br>
              <label for="marca">Marca:</label><br>
              <select id="marca" name="marca">
                <option value="agil">Agil Central 1 - 5</option>
              </select><br>
              <label for="tipo_comision">Tipo de Comisión:</label><br>
              <select id="tipo_comision" name="tipo_comision">
                <option value="nuevo">Nuevo: 6.00%</option>
              </select><br>
              <label for="tipo">Tipo:</label><br>
              <select id="tipo" name="tipo">
                <option value="-">-</option>
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

            <div class="cargar-credito" id="cargar-cliente" style="display: none;">
              <form class="cargar-credito-form">
              <label for="cedula">Cédula:</label><br>
              <input type="text" id="cedula" name="cedula"><br>

              <label for="Nombre">Nombre:</label><br>
              <input type="text" id="Nombre" name="Nombre"><br>

              <label for="Celular">Celular:</label><br>
              <input type="text" id="Celular" name="Celular"><br>

              <label for="Direccion">Direccion:</label><br>
              <input type="text" id="Direccion" name="Direccion"><br>

              
              <label for="correo">Correo:</label><br>
              <input type="email" id="correo" name="correo"><br>

              <label for="faja">Faja:</label><br>
              <input type="text" id="faja" name="faja"><br>

               
              <div>
                <button type="submit">Insertar Cliente</button>
                <button type="button" style="background-color: red;" onclick="ocultarCargarCliente()">Cerrar</button>
                
              </div>
              
              </form>

            </div>

  `;


let currentPage = 1;
const limit = 10;

const inputBusqueda = document.getElementById("input-busqueda-clientes");
const selectCampo = document.getElementById("filter_by");

function aplicarFiltro() {
  currentPage = 1;
  const campo = selectCampo.value;
  const valor = inputBusqueda.value.trim();

  // Convertimos el valor a string explícitamente
  const valorTexto = String(valor);

  cargarClientes(campo, valorTexto, currentPage, limit);
}

inputBusqueda.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // evita que recargue el formulario si estuviera en uno
    aplicarFiltro();
  }
});
document.getElementById("btn-buscar-clientes").addEventListener("click", (e) => {
  e.preventDefault();
  aplicarFiltro();
});
selectCampo.addEventListener("change", aplicarFiltro);

// Cargar inicialmente sin filtro
cargarClientes("nombre", "", currentPage, limit);



}
