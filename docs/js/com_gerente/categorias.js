import { cargarCategorias, guardarNuevaCategoria,EliminarCategoria,guardarEditarCategoria} from "../api_admin/categoria_api.js"; // ✅ Corregir path
import { mostrarModalCrearCategoria, cerrarModalCrearCategoria} from "./modales_admin.js"; // ✅ Importar función para mostrar modal de crear categoría
window.mostrarModalCrearCategoria = mostrarModalCrearCategoria;
window.cerrarModalCrearCategoria = cerrarModalCrearCategoria;
window.guardarNuevaCategoria = guardarNuevaCategoria;
window.EliminarCategoria = EliminarCategoria;
window.guardarEditarCategoria = guardarEditarCategoria;

export function mostrarGestionCategorias() {
    document.getElementById("contenido").innerHTML = `
        
        <h1>Gestion de Categorías</h1>
        <br>
        <h4>Administra las categorías del sistema</h4>
        <br>
        <div class="controls">
            
            <div class="control-filtros">

                <button id="crear-categoria" onclick="mostrarModalCrearCategoria()">Crear Nueva Categoría</button>

            </div>
        </div>
        <br>
        <div class="table-responsive">
            <h3>Lista de Categorías</h3>
            <table id="tabla-categorias" >
                <thead>
                    <tr>
                        <th>ACCIONES</th>
                        <th>ID</th>
                        <th>CATEGORIA</th>
                    </tr>
                </thead>
                <tbody id="categorias-lista">
                    <!-- Aquí se cargarán las categorías dinámicamente -->
                </tbody>
            </table>    
        </div>
        
        <div class="modal-crear" id="modal-crear-categoria" role="dialog" aria-labelledby="titulo" aria-describedby="descripcion">
            <div class="modal-header">
                <h2 id="titulo">Crear Nueva Categoría</h2>
                <p id="descripcion">Complete la información de la categoría</p>
            </div>
            <form class="modal-form" id="form-crear-categoria">
                <div class="form-group">
                    <label for="nombre-categoria">Nombre de la Categoría *</label>
                    <input type="text" id="nombre-categoria" required>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="create-btn">Crear Categoría</button>
                    <button type="button" class="cancel-btn" onclick="cerrarModalCrearCategoria()">Cancelar</button>
                </div>
            </form>
        </div>
    `;


    cargarCategorias();

    document.getElementById('form-crear-categoria').onsubmit = function(event) {
        event.preventDefault();
        guardarNuevaCategoria(event);
    };

    function mostrarModalEditarCategoria(id, nombreActual) {
        let modal = document.getElementById('modal-editar-categoria');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal-crear';
            modal.id = 'modal-editar-categoria';
            document.body.appendChild(modal);
        }
        modal.style.display = 'flex';
        modal.style.flexDirection = 'column';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.innerHTML = `
            <div class="modal-header">
            <h2 id="titulo-editar">Editar Categoría</h2>
            <p id="descripcion-editar">Modifique el nombre de la categoría</p>
            </div>
            <form class="modal-form" id="form-editar-categoria">
                <div class="form-group">
                    <label for="nombre-categoria-editar">Nombre de la Categoría *</label>
                    <input 
                    type="text" 
                    id="nombre-categoria-editar" 
                    value="${nombreActual}" 
                    required 
                    >
                </div>
                <div class="modal-footer">
                    <button type="button" class="cancel-btn" onclick="cerrarModalEditarCategoria()">Cancelar</button>
                    <button type="submit" class="create-btn">Guardar Cambios</button>
                </div>
            </form>
        `;
        document.getElementById('form-editar-categoria').onsubmit = function(event) {
            event.preventDefault();
            guardarEditarCategoria(id);
        };
    }

    function cerrarModalEditarCategoria() {
        const modal = document.getElementById('modal-editar-categoria');
        if (modal) modal.style.display = 'none';
    }

    function mostrarModalEliminarCategoria(id) {
        let modal = document.getElementById('modal-eliminar-categoria');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal';
            modal.id = 'modal-eliminar-categoria';
            modal.classList.add('modal-confirmacion');

            document.body.appendChild(modal);
        }
        modal.classList.add('active');
        modal.innerHTML = `
            <div>
                <h2>Eliminar Categoría</h2>
                <p>¿Está seguro que desea eliminar esta categoría? id ${id}</p>

                <div class="btns">
                    <button id="confirmar-eliminar-categoria" class="btn-confirmar">Eliminar</button>
                    <button id="cancelar-eliminar-categoria" class="btn-cancelar">Cancelar</button>
                </div>
            </div>
        `;
        document.getElementById('cancelar-eliminar-categoria').onclick = function() {
            modal.classList.remove('active');
        };
        document.getElementById('confirmar-eliminar-categoria').onclick = function() {
            EliminarCategoria(id);
            modal.classList.remove('active');
            cargarCategorias(); // Recargar la lista de categorías después de eliminar
        };
    }

    window.mostrarModalEditarCategoria = mostrarModalEditarCategoria;
    window.cerrarModalEditarCategoria = cerrarModalEditarCategoria;
    window.mostrarModalEliminarCategoria = mostrarModalEliminarCategoria;
    
}

