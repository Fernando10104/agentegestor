import {cargarMetas,guardarMetas,CrearGrupo,cargarGruposEnSelect,obtenerGruposPorId,cargarListaUsuariosporGrupoId,guardarEditarGrupo,buscargrupoporid,EliminarGrupo} from '../api_admin/metas_api.js';
window.cargarMetas = cargarMetas;
window.guardarMetas = guardarMetas;
window.CrearGrupo = CrearGrupo;
window.obtenerGruposPorId = obtenerGruposPorId;
window.cargarListaUsuariosporGrupoId = cargarListaUsuariosporGrupoId;
window.guardarEditarGrupo = guardarEditarGrupo;
window.buscargrupoporid = buscargrupoporid;
window.EliminarGrupo = EliminarGrupo;

export function mostrarGestionMetas(){
    document.getElementById('contenido').innerHTML = `
        <div class="menu-metas" style="display: flex; gap: 20px;">
            <div class="contenedor-metas">  

                <div class="header">
                    <h1>Gestión de Metas</h1>
                </div>
                <div class="table-responsive table-responsive-hijo">
                    <table id="tabla-metas">
                        <thead>
                            <tr>
                                <th>Acciones</th>
                                <th>ID</th>
                                <th>Usuario</th>
                                <th>Nombre</th>
                                <th>Meta Personal</th>
                                <th>Meta lograda</th>
                                <th>% Cumplimiento</th>
                                <th>Ganancia</th>
                            </tr>
                        </thead>
                        <tbody id="metas-lista">
                            <!-- Las metas se cargarán aquí dinámicamente -->
                            <tr>
                                <td colspan="5">
                                    Cargando metas...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="footer-buttons" style="margin-top: 20px;">
                    <button onclick="exportarExcel()" class="export-excel">Exportar a excel</button>
                </div>



            </div>
            <div class="contenedor-grupos" style="border: 1px solid #414958; border-radius: 8px; width: auto; padding: 20px; ">
                <div class="header">
                    <h1>Gestión de Grupos</h1>
                </div>

                <div class="controls">
                    <div class="control-filtros">
                        <label for="grupo-select">Seleccionar Grupo:</label>
                        <select id="grupo-select">
                            <option value="">-- Seleccionar Grupo --</option>
                            <!-- Las opciones de grupo se cargarán aquí dinámicamente -->
                        </select>

                        <button id="btn-crear-grupo">+ Crear Grupo</button>
                    </div>
                </div>
                <br>
                <div class="table-responsive table-responsive-hijo">
                    <table>
                        <thead>
                            <tr>
                                <th>Acciones</th>
                                <th>ID Grupo</th>
                                <th>Nombre Grupo</th>
                                <th>Meta grupo</th>
                            </tr>
                        </thead>
                        <tbody id="grupo-lista">
                            <!-- Las metas se cargarán aquí dinámicamente -->
                            <tr>
                                <td colspan="5">
                                    seleccione un grupo...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="table-responsive table-responsive-hijo">
                    <table>
                        <thead>
                            <tr>
                            
                                <th>usuario</th>
                                <th>Nombre usuario</th>
                                <th>Meta lograda</th>

                            </tr>
                        </thead>
                        <tbody id="usuarios-lista">
                            <!-- Las metas se cargarán aquí dinámicamente -->
                            <tr>
                                <td colspan="5">
                                    Cargando usuarios...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="total-comisiones-grupo" style="margin-top: 20px;">
                        <strong>Total Comisiones del Grupo:</strong>
                        <span id="total-comisiones-grupo">0</span>
                    </div>
                </div>
            </div>

            <div class="modal-crear" id="modal-metas">
                <div class="modal-header">
                    <h2>Crear Meta</h2>
                    
                </div>
                
                <form class="modal-form" id="form-crear-meta">
                    <div class="form-group">
                        <label for="usuario-meta">Usuario:</label>
                        <input type="text" id="usuario-meta" name="usuario-meta" disabled>
                    </div>
                    <div class="form-group">
                        <label for="nombre-meta">Nombre:</label>
                        <input type="text" id="nombre-meta" name="nombre-meta" disabled>
                    </div>
                    <div class="form-group">
                        <label for="meta-personal">Meta Personal:</label>
                        <input type="number" id="meta-personal" name="meta-personal" required>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="create-btn">Guardar Meta</button>
                        <button class="cancel-btn" type="button" id="cerrar-modal-btn">X</button>
                    </div>
                </form>
                

            </div>


        </div>
        <div class="modal-crear" id="modal-crear-grupo">
            <div class="modal-header">
                <h2>Crear Grupo</h2>
            </div>
            <form class="modal-form" id="form-crear-grupo">
                <div class="form-group">
                    <label for="nombre-grupo">Nombre del Grupo:</label>
                    <input type="text" id="nombre-grupo" name="nombre-grupo" required>
                </div>
                <div class="form-group">
                    <label for="meta-grupo">Meta del Grupo:</label>
                    <input type="number" id="meta-grupo" name="meta-grupo" required>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="create-btn" onclick="CrearGrupo(event)">Guardar Grupo</button>
                    <button class="cancel-btn" type="button" id="cerrar-modal-grupo-btn">X</button>
                </div>
            </form>
        </div>
        <div class="modal-crear" id="modal-editar-grupo">
            <div class="modal-header">
                <h2>Editar Grupo</h2>
            </div>
            <form class="modal-form" id="form-editar-grupo">
                <div class="form-group">
                    <label for="id-grupo">ID del Grupo:</label>
                    <input type="text" id="id-grupo" name="id-grupo" disabled>
                </div>

                <div class="form-group">
                    <label for="nombre-grupo">Nombre del Grupo:</label>
                    <input type="text" id="nombre-grupo-ed" name="nombre-grupo" required>
                </div>
                <div class="form-group">
                    <label for="meta-grupo">Meta del Grupo:</label>
                    <input type="number" id="meta-grupo-ed" name="meta-grupo" required>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="create-btn" onclick="guardarEditarGrupo(event)">Guardar edición</button>
                    <button class="cancel-btn" type="button" id="cerrar-modal-editar-grupo-btn">X</button>
                </div>
            </form>
        </div>



    `;

    // Función flecha para quitar la clase 'active' del modal
    const cerrarModal = () => {
        document.getElementById('modal-metas').classList.remove('active');
    };
    const cerrarModalGrupo = () => {
        document.getElementById('modal-editar-grupo').classList.remove('active');
    };
    const cerrarModalCrearGrupo = () => {
        document.getElementById('modal-crear-grupo').classList.remove('active');
    };

    document.getElementById('cerrar-modal-btn').addEventListener('click', cerrarModal);
    document.getElementById('cerrar-modal-editar-grupo-btn').addEventListener('click', cerrarModalGrupo);
    document.getElementById('cerrar-modal-grupo-btn').addEventListener('click', cerrarModalCrearGrupo);

   cargarMetas();


    function mostrarModalEditarMeta(idMeta) {
       
        const row = document.querySelector(`tr[data-id="${idMeta}"]`);
        
        

        // Obtener los datos de la fila
        const usuario = row.querySelector('.meta-usuario')?.textContent || '';
        const nombre = row.querySelector('.meta-nombre')?.textContent || '';
        const metaPersonal = row.querySelector('.meta-personal')?.textContent || '';
        

        // Mostrar el modal y rellenar los campos
        const modal = document.getElementById('modal-metas');
        modal.classList.add('active');
        document.getElementById('usuario-meta').value = usuario;
        document.getElementById('nombre-meta').value = nombre;
        document.getElementById('meta-personal').value = metaPersonal.replace(/\./g, '');
    };

    document.getElementById('form-crear-meta').addEventListener('submit', function(e) {
        e.preventDefault();
        guardarMetas();
        cerrarModal();

    });
    document.getElementById('btn-crear-grupo').addEventListener('click', () => {
        document.getElementById('modal-crear-grupo').classList.add('active');   

    });

    
    document.getElementById('grupo-select').addEventListener('change', function() {
        const grupoSelect = document.getElementById('grupo-select');
        const valorSeleccionado = grupoSelect.value;
        
        obtenerGruposPorId(valorSeleccionado);
        cargarListaUsuariosporGrupoId(valorSeleccionado);

    });

    function editarGrupo(idGrupo) {
        const modalEditarGrupo = document.getElementById('modal-editar-grupo');
        modalEditarGrupo.classList.add('active');
        const buscarGrupo = buscargrupoporid(idGrupo);
        buscarGrupo.then(grupo => {
            document.getElementById('id-grupo').value = grupo.id_grupo || '';
            document.getElementById('modal-editar-grupo').querySelector('input[name="nombre-grupo"]').value = grupo.nombre_grupo || '';
            document.getElementById('modal-editar-grupo').querySelector('input[name="meta-grupo"]').value = grupo.meta_grupo || '';
        });

    }
    window.guardarEditarGrupo = guardarEditarGrupo;
    window.editarGrupo = editarGrupo;
    window.mostrarModalEditarMeta = mostrarModalEditarMeta;
    window.cargarGruposEnSelect = cargarGruposEnSelect;
    cargarGruposEnSelect();

  function exportarExcel() {
    const tabla = document.getElementById("tabla-metas");
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
    link.download = "tabla_exportada_metas.csv";
    link.click();
  }
  window.exportarExcel = exportarExcel;
    
}
