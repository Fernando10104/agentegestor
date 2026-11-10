import { CargarUsuarios,mostrarEditarUsuario,guardarEditarUsuario,MostrarModalAsistencia,cargarAsistencias } from "../api_administrativa/usuario_api.js";
window.mostrarEditarUsuario = mostrarEditarUsuario;
window.guardarEditarUsuario = guardarEditarUsuario;
window.MostrarModalAsistencia = MostrarModalAsistencia;
window.cargarAsistencias = cargarAsistencias;

export function mostrarGestionUsuario() {
    document.getElementById("contenido").innerHTML = `
            <h1>Gestión de Usuarios</h1>
            <br>
            <h4>Consulta y actualiza los usuarios de tu equipo</h4>
            <br>
            <div class="controls">
                <div><h3>Filtros</h3></div>
                <div class="control-filtros">
                    <input type="text" placeholder="Buscar por CI o nombre" id="filtro-input">
                    <select name="roles" id="roles">
                        <option value=>Todos</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="asesor">Asesor</option>
                    </select>

                    <button id="btn-filtrar">Filtrar</button>
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
                            <th>Correo</th>
                            <th>Teléfono</th>
                            <th>Supervisor</th>
                            <th>Grupo</th>
                            <th>Fecha Ingreso</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="usuarios-lista">
                        <!-- Aquí se cargarán los usuarios dinámicamente -->
                    </tbody>
                </table>
            </div>

            <div class="modal-overlay"></div>
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

    const tbody = document.getElementById("tabla-usuarios");

    tbody.addEventListener("click", function (event) {
        const btnEditar = event.target.closest(".btn-editar");
        const btnAsistencias = event.target.closest(".btn-asistencias");

        const tr = event.target.closest("tr");

        if (!tr || !tr.id) return;

        const operacionId = tr.id;

        if (btnEditar) {
            mostrarEditarUsuario(operacionId);
        } else if (btnAsistencias) {
            const usuarioId = btnAsistencias.getAttribute("data-id");
            MostrarModalAsistencia(usuarioId);
        }
    });
}
