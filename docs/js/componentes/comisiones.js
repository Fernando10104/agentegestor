export function mostrarComisiones() {
    document.getElementById('contenido').innerHTML = `
    <!-- HTML que ya tenías -->
    <div id="comisiones-template" >
              <div class="header">
                <h1>Comisiones</h1>
              </div>

              <div class="controls">
                <label for="fecha_inicio">Inicio:</label>
                <input type="date" id="fecha_inicio" value="2025-07-29">
                <label for="fecha_fin">Fin:</label>
                <input type="date" id="fecha_fin" value="2025-07-29">
                <button class="buscar-comisiones">Buscar</button>
                <button class="exportar-comisiones">Exportar</button>
                
              </div>

              <div class="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Nombre</th>
                      <th>CI</th>
                      <th>Monto</th>
                      <th>%</th>
                      <th>Entidad</th>
                      <th>Comision bruto</th>
                      <th>Pagado</th>
                      <th>Comision restante</th>
                      <th>Supervisor</th>
                      <th>Asesor</th>
                      <th>Ganancia</th>
                      <th>Calificacion</th>
                      <th>Sucursal</th>
                      <th>Observacion</th>


                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2024-01-15</td>
                      <td>Alice Smith</td>
                      <td>4567890</td>
                      <td>12000000</td>
                      <td>2.0%</td>
                      <td>Banco Py</td>
                      <td>240000</td>
                      <td>0%</td>
                      <td>0</td>
                      <td>Bob Johnson</td>
                      <td>Carlos Perez</td>
                      <td>50000</td>
                      <td>A</td>
                      <td>Asuncion</td>
                      <td>Ninguna</td>
                    </tr>
                    
                  </tbody>
                </table>
              </div>
            </div>
  `;
}
