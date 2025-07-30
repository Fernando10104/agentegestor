export function mostrarHistorial() {
  document.getElementById('contenido').innerHTML = `
    <div class="header">
      <h1>Historial de Créditos</h1>
    </div>
    <div class="controls">
      <label for="filter_by">Filtrar por:</label>
      <select id="filter_by">
        <option value="num_operacion">num_operacion</option>
        <option value="nombre">nombre</option>
        <option value="documento_cliente">documento_cliente</option>
        <option value="documento_credito">documento_credito</option>
        <option value="contacto">contacto</option>
        <option value="marca">marca</option>
        <option value="tipo">tipo</option>
        <option value="faja">faja</option>
        <option value="categoria">categoria</option>
        <option value="importe">importe</option>
        <option value="responsable">responsable</option>
        <option value="comision">comision</option>
        <option value="estado">estado</option>
      </select>
      <button>FILTRAR</button>
      <div class="limit-records">
        <input type="checkbox" id="limit_records">
        <label for="limit_records">Limitar 50 registros</label>
      </div>
    </div>

    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th>num_operacion</th><th>nombre</th><th>documento_cliente</th><th>documento_credito</th>
            <th>contacto</th><th>marca</th><th>tipo</th><th>faja</th>
            <th>categoria</th><th>importe</th><th>responsable</th><th>comision</th>
            <th>estado</th><th>obs</th><th>fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2</td><td>RAMON MAZACOTE</td><td>6.021.893</td><td>6.021.893</td><td>982883377</td>
            <td>Solar 1 - 5</td><td>Crédito</td><td>L</td><td>ASALARIADO CON IPS</td><td>15.000.000</td>
            <td>Maria Lopez</td><td>2.5%</td><td>Pendiente</td><td>Doc. faltante</td><td>2024-07-28</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="footer-buttons">
      <button class="export-excel">Exportar a excel</button>
      <button class="view-disbursed">Ver más créditos desembolsados</button>
    </div>
  `;
}
