import { CargarUsuarios,mostrarEditarUsuario,guardarEditarUsuario,CrearUsuario,EliminarUsuario,MostrarModalAsistencia,cargarAsistencias } from "../api_admin/usuario_api.js"; // ✅ Corregir path
window.mostrarEditarUsuario = mostrarEditarUsuario;
window.guardarEditarUsuario = guardarEditarUsuario;
window.EliminarUsuario = EliminarUsuario;
window.MostrarModalAsistencia = MostrarModalAsistencia;
window.cargarAsistencias = cargarAsistencias;

export function mostrarGestionUsuario() {
    
    
    document.getElementById("contenido").innerHTML = `
            <h1>Gestión de Usuarios</h1>
            <br>
            <h4>Administra usuarios del sistema, sus roles y permisos</h4>
            <br>
            <div class="controls">
                <div><h3>Filtros</h3></div>
                <div class="control-filtros">
                    <input type="text" placeholder="Buscar por CI o nombre" id="filtro-input">
                    <select name="roles" id="roles">
                        <option value=>Todos</option>
                        <option value="admin">Admin</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="asesor">Asesor</option>
                    </select>

                    <button id="btn-filtrar">Filtrar</button>
                    <button id="crear-usuario" onclick="mostrarModalCrearUsuario()">+ nuevo usuario</button>
                </div><!-- hacer flex  -->
            </div>
            <br>
            <div class="table-responsive">
                <h3>Lista de Usuarios</h3>
                <table id="tabla-usuarios">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Usuario</th>
                            <th>Nombre</th>
                            <th>Rol</th>
                            <th>Comisiones</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
                            <th>Supervisor</th>
                            <th>Grupo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="usuarios-lista">
                        <!-- Aquí se cargarán los usuarios dinámicamente -->
                    </tbody>
                </table>    
            </div>
            
            <!--  modal crear usuario -->
            <div class="modal-overlay"></div>
            <div class="modal-crear" id="modalcrear" role="dialog" aria-labelledby="titulo" aria-describedby="descripcion">
                <div class="modal-header">
                    <h2 id="titulo">Crear Usuario</h2>
                    
                </div>

                <form class="modal-form" id="form-crear-usuario">
                    <div class="form-group">
                    <label for="nombre">Nombre Completo *</label>
                    <input type="text" id="nombre"  required />
                    </div>

                    <div class="form-group">
                        <label for="ci">Cédula de Identidad *</label>
                        <input class="form-cedula" type="text" id="ci"  required />
                        <div class="mensaje"> 
                            <p id="Importante" class="mensaje-advertencia">⚠️El usuario iniciara sesion con su <strong>cédula</strong></p>
                        </div>
                    </div>
                    

                    <div class="form-group">
                    <label for="password">Contraseña *</label>
                    <div class="input-password">
                        <input type="text" id="password"  required />
                        
                    </div>
                    </div>

                    <div class="form-group">
                    <label for="telefono">Teléfono</label>
                    <input type="text" id="telefono" />
                    </div>

                    

                    <div class="form-group">
                    <label for="rol">Rol *</label>
                    <select id="rol" required>
                        <option>Admin</option>
                        <option>Supervisor</option>
                        <option>Asesor</option>
                    </select>
                    </div>

                    <div class="form-group">
                    <label for="comision">Comisión</label>
                    <input type="number" id="comision"  />
                    </div>

                    <div class="form-group">
                    <label for="supervisor">ID Supervisor</label>
                    <input type="number" id="supervisor"  />
                    </div>

                    <div class="form-group">
                    <label for="correo">Correo Electrónico</label>
                    <input type="email" id="correo"  />
                    </div>

                    <div class="modal-footer">
                    <button type="submit" class="create-btn" >Crear Usuario</button>
                    <button type="button" class="cancel-btn" onclick="cerrarModalCrearUsuario()">Cancelar</button>
                    </div>
                </form>

                

                
            </div>
            <div class="modal-crear" id="modal-editar-usuario" role="dialog" aria-labelledby="titulo" aria-describedby=
            "descripcion"></div>

            <div id="modal-asistencia"></div>
        `;
   
    const filtroinput = document.querySelector('.controls input[type="text"]');
    const filtroSelect = document.querySelector('.controls select[name="roles"]');
    const btnFiltrar = document.getElementById('btn-filtrar');
    

    btnFiltrar.addEventListener('click', () => {
        const valor = filtroinput.value;
        const rol2 = filtroSelect.value;

        CargarUsuarios(valor, rol2);
    });

    // Cargar usuarios al iniciar la página
    CargarUsuarios();
    CrearUsuario();

    const tbody = document.getElementById("tabla-usuarios");

    tbody.addEventListener("click", function (event) {
        const btnEditar = event.target.closest(".btn-editar");
        const btnEliminar = event.target.closest(".btn-eliminar");
        const btnAsistencias = event.target.closest(".btn-asistencias");
        
    
        const tr = event.target.closest("tr");
        
        if (!tr || !tr.id) return;
    
        const operacionId = tr.id;
    
        if (btnEditar) {
            mostrarEditarUsuario(operacionId);
        } else if (btnEliminar) {
            EliminarUsuario(operacionId);
        } else if (btnAsistencias) {
            const usuarioId = btnAsistencias.getAttribute("data-id");
            MostrarModalAsistencia(usuarioId);
        }
    });



}