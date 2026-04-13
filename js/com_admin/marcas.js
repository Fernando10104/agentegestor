import { cargarMarcas,CrearNuevaMarca,EditarMarca,EliminarMarca } from "../api_admin/marcas_api.js";
window.cargarMarcas = cargarMarcas;
window.CrearNuevaMarca = CrearNuevaMarca;
window.EditarMarca = EditarMarca;
window.EliminarMarca = EliminarMarca;

export function mostrarGestionMarcas() {
    document.getElementById("contenido").innerHTML = `
        <h1>Gestion de Marcas</h1>
        <br>
        <h4>Administra las marcas del sistema</h4>
        <br>
        <div class="controls">
            <div><h3>Filtros</h3></div>
            <div class="control-filtros">
                <input type="text" placeholder="Buscar por marca..." id="filtro-input">
                <button id="btn-filtrar" onclick="filtrarMarcas()">Filtrar</button>
                <button id="crear-marca" onclick="mostrarModalCrearMarca()">+ nueva marca</button>
                <select id="usuario-select">
                    <option value="0">Seleccionar usuario...</option>
                </select>
            </div>
        </div>
        <br>
        <div class="table-responsive">
            <h3>Lista de Marcas</h3>
            <table id="tabla-marcas">
                <thead>
                    <tr>
                        <th>ACCIONES</th>
                        <th>ID</th>
                        <th>MARCA</th>
                        <th>MONTO MINIMO</th>
                        <th>MONTO MAXIMO</th>
                        <th>COMISION NUEVO</th>
                        <th>COMISION RENOVACION</th>
                        <th>METODO DE PAGO</th>
                        <th>id_usuario</th>
                    </tr>
                </thead>
                <tbody id="marcas-lista">
                    <!-- Aquí se cargarán las marcas dinámicamente -->
                </tbody>
            </table>    
        </div>
        
        <div class="modal-crear" id="modal-crear-marca" role="dialog" aria-labelledby="titulo" aria-describedby="descripcion" >
            <div class="modal-header">
                <h2 id="titulo">Crear Nueva Marca</h2>
                <p id="descripcion">Complete la información de la marca</p>
            </div>
            <form class="modal-form" id="form-crear-marca">
                <div class="form-group">
                    <label for="nombre-marca">Nombre de la Marca:</label>
                    <input type="text" id="nombre-marca" name="nombre-marca" required>
                </div>
                <div class="form-group">
                    <label for="monto-minimo">Monto Mínimo:</label>
                    <input type="number" id="monto-minimo" name="monto-minimo" required>
                </div>
                <div class="form-group">
                    <label for="monto-maximo">Monto Máximo:</label>
                    <input type="number" id="monto-maximo" name="monto-maximo" required>
                </div>
                <div class="form-group">
                    <label for="comision-nuevo">Comisión Nuevo %:</label>
                    <input type="number" step="any" id="comision-nuevo" name="comision-nuevo" required>
                </div>
                <div class="form-group">
                    <label for="comision-renovacion">Comisión Renovación %:</label>
                    <input type="number" step="any" id="comision-renovacion" name="comision-renovacion" required>
                </div>
                <div class="form-group">
                    <label for="metodo-pago">Método de Pago:</label>
                    <select id="metodo-pago" name="metodo-pago" required>
                        <option value="ventanilla">Ventanilla</option>
                        <option value="debito">Débito</option>
                        <option value="credito">Crédito</option>
                    </select>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="create-btn">Guardar</button>
                    <button type="button" class="cancel-btn" onclick="cerrarModalCrearMarca()">Cancelar</button>
                </div>
            </form>
        </div>
            <div class="modal-crear" id="modal-editar-marca" role="dialog" aria-labelledby="titulo-editar" aria-describedby="descripcion-editar" style="display:none; flex-direction: column; align-items: center; justify-content: center;">
                <div class="modal-header">
                    <h2 id="titulo-editar">Editar Marca</h2>
                    <p id="descripcion-editar">Modifique la información de la marca</p>
                </div>
                <form class="modal-form" id="form-editar-marca">
                    
                    <div class="form-group">
                        <label for="editar-nombre-marca">Nombre de la Marca:</label>
                        <input type="text" id="editar-nombre-marca" name="editar-nombre-marca" required>
                    </div>
                    <div class="form-group">
                        <label for="editar-monto-minimo">Monto Mínimo:</label>
                        <input type="number" id="editar-monto-minimo" name="editar-monto-minimo" required>
                    </div>
                    <div class="form-group">
                        <label for="editar-monto-maximo">Monto Máximo:</label>
                        <input type="number" id="editar-monto-maximo" name="editar-monto-maximo" required>
                    </div>
                    <div class="form-group">
                        <label for="editar-comision-nuevo">Comisión Nuevo %:</label>
                        <input type="number" step="any" id="editar-comision-nuevo" name="editar-comision-nuevo" required>
                    </div>
                    <div class="form-group">
                        <label for="editar-comision-renovacion">Comisión Renovación %:</label>
                        <input type="number" step="any" id="editar-comision-renovacion" name="editar-comision-renovacion" required>
                    </div>
                    <div class="form-group">
                        <label for="editar-metodo-pago">Método de Pago:</label>
                        <select id="editar-metodo-pago" name="editar-metodo-pago" required>
                            <option value="ventanilla">Ventanilla</option>
                            <option value="debito">Débito</option>
                            <option value="credito">Crédito</option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="create-btn">Guardar Cambios</button>
                        <button type="button" class="cancel-btn" onclick="cerrarModalEditarMarca()">Cancelar</button>
                    </div>
                </form>
            </div>
        
    `;
    async function cargarUsuariosEnSelect() {
        const select = document.getElementById("usuario-select");
        select.innerHTML = `<option value="0">Seleccionar usuario...</option>`;
        const url = new URL(`${API_BASE_URL}/usuarios`);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const { usuarios } = await response.json();
            console.log("Usuarios cargados:", usuarios);
            usuarios.forEach(usuario => {
                const option = document.createElement("option");
                option.value = usuario[0]; // id_usuario
                option.textContent = usuario[7]; // nombre
                select.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        }
    }
    cargarUsuariosEnSelect();

    function detectarUsuarioYCargarMarcas() {
        console.log("Detectando usuario seleccionado y cargando marcas...");
        const select = document.getElementById("usuario-select");
        const busqueda = document.getElementById("filtro-input").value;
        const id_usuario = select.value;
        console.log("Usuario seleccionado:", id_usuario);
        cargarMarcas(busqueda, id_usuario);
    }

    // Escuchar cambios en el select de usuario
    document.getElementById("usuario-select").addEventListener("change", detectarUsuarioYCargarMarcas);

    // También puedes llamar al cargar marcas cuando se filtra
    document.getElementById("btn-filtrar").addEventListener("click", detectarUsuarioYCargarMarcas);


    function filtrarMarcas(){
        const busqueda = document.getElementById("filtro-input").value;
        cargarMarcas(busqueda);
    }
    window.filtrarMarcas = filtrarMarcas;
    

    document.getElementById("form-crear-marca").addEventListener("submit", function(e) {
        e.preventDefault();
        CrearNuevaMarca();
    });

    function mostrarModalEditarMarca(id) {
        const modal = document.getElementById('modal-editar-marca');
        modal.style.display = 'flex';
        if (modal) {
            const overlay = document.querySelector('.modal-overlay');
            if (overlay) overlay.classList.add('active');
            const fila = document.querySelector(`#marcas-lista tr[data-id="${id}"]`);
            if (fila) {
                document.getElementById('editar-nombre-marca').value = fila.querySelector('.marca-nombre').textContent;
                document.getElementById('editar-monto-minimo').value = fila.querySelector('.marca-minimo').textContent;
                document.getElementById('editar-monto-maximo').value = fila.querySelector('.marca-maximo').textContent;
                document.getElementById('editar-comision-nuevo').value = fila.querySelector('.marca-comision-nuevo').textContent;
                document.getElementById('editar-comision-renovacion').value = fila.querySelector('.marca-comision-renovacion').textContent;
                document.getElementById('editar-metodo-pago').value = fila.querySelector('.marca-metodo-pago').textContent;
                modal.setAttribute('data-id', id);
            } else {
                console.error(`No se encontró la fila de marca con id=${id}`);
            }
        } else {
            console.error("Modal con ID 'modal-editar-marca' no encontrado");
        }
        function cerrarModalEditarMarca() {
            const modal = document.getElementById('modal-editar-marca');
            if (modal) {
                modal.style.display = 'none';
                modal.removeAttribute('data-id');
                modal.classList.remove('active');
                const overlay = document.querySelector('.modal-overlay');
                if (overlay) overlay.classList.remove('active');
            }
        }
        window.cerrarModalEditarMarca = cerrarModalEditarMarca;
        
    }
    document.getElementById("form-editar-marca").addEventListener("submit", function(e) {
        e.preventDefault();
        const id = document.getElementById('modal-editar-marca').getAttribute('data-id');
        EditarMarca(id);
    });

    window.mostrarModalEditarMarca = mostrarModalEditarMarca;

    
    function mostrarModalEliminarMarca(id) {
        console.log("Mostrando modal de confirmación para eliminar marca con ID:", id);
        
        // Crear modal igual que los otros
        let modal = document.getElementById('modal-eliminar-marca');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal-confirmacion';
            modal.id = 'modal-eliminar-marca';
            document.body.appendChild(modal);
        }
        
        modal.innerHTML = `
            <div>
                <h2>Eliminar Marca</h2>
                <p>¿Está seguro que desea eliminar esta marca?</p>
                <div class="btns">
                    <button id="btn-confirmar-eliminar" class="create-btn" style="background-color: #d9534f; color: white;">Eliminar</button>
                    <button type="button" id="btn-cancelar-eliminar" class="cancel-btn">Cancelar</button>
                </div>
            </div>
                `;
        
        modal.style.display = 'flex';

        document.getElementById('btn-confirmar-eliminar').onclick = function() {
            EliminarMarca(id);
            modal.style.display = 'none';
            detectarUsuarioYCargarMarcas()
        };
        document.getElementById('btn-cancelar-eliminar').onclick = function() {
            modal.style.display = 'none';
        };
    }

    window.mostrarModalEliminarMarca = mostrarModalEliminarMarca;
    window.cerrarModalEliminarMarca = cerrarModalEliminarMarca;


}