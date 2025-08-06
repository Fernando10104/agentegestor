import { CargarUsuarios,mostrarEditarUsuario,guardarEditarUsuario,CrearUsuario,EliminarUsuario } from "../api_admin/usuario_api.js"; // ✅ Corregir path
window.mostrarEditarUsuario = mostrarEditarUsuario;
window.guardarEditarUsuario = guardarEditarUsuario;
window.EliminarUsuario = EliminarUsuario;

export function mostrarGestionUsuario() {
    
    document.getElementById("contenido").innerHTML = `
            <h1>Gestion de Usuarios</h1>
            <br>
            <h4>administra usuarios del sistema, sus roles y permisos</h4>
            <br>
            <div class="controls">
                <div><h3>Filtros</h3></div>
                <div>
                    <input type="text" placeholder="Buscar por ci o nombre" id="filtro-input">
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
            <div">
                <h3>Lista de Usuarios</h3>
                <table id="tabla-usuarios">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>usuario</th>
                            <th>Nombre</th>
                            <th>Rol</th>
                            <th>Comisiones</th>
                            <th>Estado</th>
                            <th>Supervisor</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="usuarios-lista">
                        <!-- Aquí se cargarán los usuarios dinámicamente -->
                    </tbody>
                </table>    
            </div>

            <div class="modal" id="modalacerrar" role="dialog" aria-labelledby="titulo" aria-describedby="descripcion">
                <div class="modal-header">
                    <h2 id="titulo">Crear Nuevo Usuario</h2>
                    <p id="descripcion">Complete la información del usuario</p>
                </div>

                <form class="modal-form" id="form-crear-usuario">
                    <div class="form-group">
                    <label for="nombre">Nombre Completo *</label>
                    <input type="text" id="nombre" placeholder="Ingrese el nombre completo" required />
                    </div>

                    <div class="form-group">
                    <label for="ci">Cédula de Identidad *</label>
                    <input type="text" id="ci" placeholder="Ingrese el CI" required />
                    </div>


                    <div class="form-group">
                    <label for="password">Contraseña *</label>
                    <div class="input-password">
                        <input type="password" id="password" placeholder="Ingrese contraseña" required />
                        <button type="button" class="toggle-password">👁️</button>
                    </div>
                    </div>

                    <div class="form-group">
                    <label for="telefono">Teléfono</label>
                    <input type="text" id="telefono" placeholder="+595 981 234 567" />
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
                    <label for="comision">Comision</label>
                    <input type="number" id="comision" placeholder="Ingrese la comision" />
                    </div>

                    <div class="form-group">
                    <label for="supervisor">id_supervisor</label>
                    <input type="number" id="supervisor" placeholder="Ingrese el id del supervisor" />
                    </div>

                    <div class="form-group">
                    <label for="correo">Correo Electrónico</label>
                    <input type="email" id="correo" placeholder="Ingrese el correo electrónico" />
                    </div>

                    <div class="modal-footer">
                    <button type="button" class="cancel-btn" onclick="cerrarModalCrearUsuario()">Cancelar</button>
                    <button type="submit" class="create-btn" >Crear Usuario</button>
                    </div>
                </form>

                

                
            </div>
            <div class="modal" id="modal-editar-usuario" role="dialog" aria-labelledby="titulo" aria-describedby="descripcion"></div>




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
        
    
        const tr = event.target.closest("tr");
        
        if (!tr || !tr.id) return;
    
        const operacionId = tr.id;
    
        if (btnEditar) {
            mostrarEditarUsuario(operacionId);
        } else if (btnEliminar) {
            EliminarUsuario(operacionId);
        }
    });
    
}