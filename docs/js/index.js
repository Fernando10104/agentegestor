function mostrarInicio() {
  document.getElementById('contenido').innerHTML = `
            <div class="user-info">
                
                <div class="user-img">
                    
                    <img src="./src/users/user12.webp" alt="">
                    <p>super seis</p>
                </div>
                <div class="user-details">
                    <h3 class="detail-item">MI GRUPO : ₲ 47.000.000</h3>
                    <h3 class="detail-item">CONTACTOS: ₲ 0</h3>
                    <h3 class="detail-item">META: ₲ 0</h3>
                    <h3 class="detail-item">LOGRADO: ₲ 0</h3>
                    <h3 class="detail-item">COMISION : ₲ 1.000.000</h3>
                    <button>OPERACIONES</button>
                </div>
                    
                
                </div>
            </div>
      `;
}

function mostrarHistorial() {
  document.getElementById('contenido').innerHTML = `
        <div class="header">
          <h1>Historial de Créditos</h1>
            </div>

            <div class="controls">
          <label for="filter_by">Filtrar por:</label>
          <select id="filter_by" name="filter_by">
              <option value="num_operacion">num_operacion</option>
              <option value="nombre">nombre</option>
              <option value="documento_cliente">documento_cliente</option>
              <option value="documento_credito">documento_credito</option>
              <option value="contacto">contacto</option>
              <option value="marca">marca</option>
              <option value="tipo">tipo</option>
              <option value="faja">faja</option>
              <option value="categoria">categoria</categoria>
              <option value="importe">importe</option>
              <option value="responsable">responsable</option>
              <option value="comision">comision</option>
              <option value="estado">estado</option>
              </select>
          <button>FILTRAR</button>
          <div class="limit-records">
              <input type="checkbox" id="limit_records" name="limit_records">
              <label for="limit_records">Limitar 50 registros</label>
          </div>
            </div>

            <div class="table-responsive">  <table>
              <thead>
            <tr>
                <th>num_operacion</th>
                <th>nombre</th>
                <th>documento_cliente</th>
                <th>documento_credito</th>
                <th>contacto</th>
                <th>marca</th>
                <th>tipo</th>
                <th>faja</th>
                <th>categoria</th>
                <th>importe</th>
                <th>responsable</th>
                <th>comision</th>
                <th>estado</th>
                <th>obs</th>
                <th>fecha</th>
            </tr>
              </thead>
              <tbody>
          
            <tr>
                <td>2</td>
                <td>RAMON MAZACOTE</td>
                <td>6.021.893</td>
                <td>6.021.893</td>
                <td>982883377</td>
                <td>Solar 1 - 5</td>
                <td>Crédito</td>
                <td>L</td>
                <td>ASALARIADO CON IPS</td>
                <td>15.000.000</td>
                <td>Maria Lopez</td>
                <td>2.5%</td>
                <td>Pendiente</td>
                <td>Doc. faltante</td>
                <td>2024-07-28</td>
            </tr>
            <tr>
                <td>3</td>
                <td>ROMINA MARTINEZ</td>
                <td>5.031.065</td>
                <td>5.031.065</td>
                <td>976489146</td>
                <td>Solar 1 - 5</td>
                <td>Crédito</td>
                <td>L</td>
                <td>ASALARIADO CON IPS</td>
                <td>8.000.000</td>
                <td>Carlos Gomez</td>
                <td>1.8%</td>
                <td>Rechazado</td>
                <td>Historial crediticio</td>
                <td>2024-07-27</td>
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

function mostrarCreditos() {
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
        <option value="estados_creditos">Estados Créditos</option>
        <option value="asesor">Asesor</option>
      </select>
      <button onclick="mostrarCargarCliente()">CARGAR CLIENTES</button>
      <button onclick="mostrarCargarCredito()">CARGAR CREDITO</button>
      <div class="limit-records">
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

  // Fetch y renderizado de clientes
  fetch(`${API_BASE_URL}/clientes`)
    .then(res => res.json())
    .then(clientes => {
      const tbody = document.getElementById('tbody-clientes');
      if (!clientes.length) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;">Sin datos</td></tr>`;
        return;
      }
      tbody.innerHTML = clientes.map(cliente => `
        <tr>
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
    })
    .catch(err => {
      const tbody = document.getElementById('tbody-clientes');
      tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;color:red;">Error al cargar datos</td></tr>`;
    });
}
function mostrar() {
  document.getElementById('contenido').innerHTML = `
        <h1>Configuración</h1>
        <label>Tema: 
          <select>
            <option>Claro</option>
            <option>Oscuro</option>
          </select>
        </label>
      `;
}
function mostrarComisiones() {
  document.getElementById('contenido').innerHTML = `
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

function mostrarCargarCredito() {
  const contenedor = document.getElementById('cargar-credito');
  if (contenedor) {
    contenedor.style.display = 'block';
  }
}
function ocultarCargarCredito() {
  const contenedor = document.getElementById('cargar-credito');
  if (contenedor) {
    contenedor.style.display = 'none';
  }
}

function mostrarCargarCliente() {
  const contenedor = document.getElementById('cargar-cliente');
  if (contenedor) {
    contenedor.style.display = 'block';
  }
}
function ocultarCargarCliente() {
  const contenedor = document.getElementById('cargar-cliente');
  if (contenedor) {
    contenedor.style.display = 'none';
  }
}

function Configuracion() {
  const configuracion = document.getElementById('configuracion');
  if (configuracion) {
    configuracion.style.display = configuracion.style.display === 'flex' ? 'none' : 'flex';
  }
}
  mostrarInicio();