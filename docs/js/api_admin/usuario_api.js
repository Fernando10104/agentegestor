import { API_BASE_URL } from '../config.js';
import { SVG_EDITAR, SVG_ELIMINAR, SVG_ASISTENCIAS } from '../../src/svg/svg.js';



export function CargarUsuarios(valor = "", rol2 = null) {
    const url = new URL(`${API_BASE_URL}/usuarios`);
    const token = localStorage.getItem('token');
    const id_usuario = localStorage.getItem("id_usuario");
    const rol = localStorage.getItem("rol");
    const nombre_usuario = localStorage.getItem("nombre_usuario");
    const rol_select = rol2

    
    if (valor) {
        url.searchParams.append("search", valor);
    }
    if (id_usuario) {
        url.searchParams.append("id_usuario", id_usuario);
    }
    if (rol) {
        url.searchParams.append("rol", rol);
    }
    if (nombre_usuario) {
        url.searchParams.append("nombre_usuario", nombre_usuario);
    }
    if (rol_select) {
        url.searchParams.append("rol_select", rol_select);
    }
    return fetch(url, {
        headers: {
            Authorization: "Bearer " + token,
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }
        return response.json();
    })
    .then(data => {
        console.log("Datos recibidos:", data);
        const usuarios = data.usuarios || [];
        
        // ✅ CORREGIR EL SELECTOR
        const tbody = document.getElementById('usuarios-lista'); // Usar el ID correcto del HTML
        
        if (!tbody) {
            console.error("No se encontró el elemento tbody con ID 'usuarios-lista'");
            return;
        }
        
        if (!usuarios.length) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">No se encontraron usuarios</td></tr>`;
        } else {
            tbody.innerHTML = usuarios.map(usuario => `
                <tr id="${usuario[0] || ''}">
                    <td>${usuario[0] || ''}</td>
                    <td>${usuario[1] || ''}</td>
                    <td>${usuario[7] || ''}</td>
                    <td>${usuario[4] || ''}</td>
                    <td>${usuario[9] || ''}</td>
                    <td>${usuario[10] || ''}</td>
                    <td>${usuario[8] || ''}</td>
                    <td>${usuario[11] || ''}</td>
                    <td class="acciones">
                        <button class="btn-editar" style="background-color: transparent;" data-id="${usuario[0]}">
                            ${SVG_EDITAR}
                        </button>
                        <button class="btn-eliminar" data-id="${usuario[0]}">
                            ${SVG_ELIMINAR}
                        </button>
                        <button class="btn-asistencias" data-id="${usuario[1]}">
                        ${SVG_ASISTENCIAS}
                        </button>
                        </svg></button>
                    </td>
                </tr>
            `).join('');
        }
        
        return usuarios;
    })
    .catch(error => {
        console.error('Error al cargar usuarios:', error);
        const tbody = document.getElementById('usuarios-lista');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:red;">Error al cargar datos</td></tr>`;
        }
        throw error;
    });
}



export async function mostrarEditarUsuario(id) {
    const modal = document.getElementById('modal-editar-usuario');
    const overlay = document.querySelector('.modal-overlay');
    modal.classList.add('active');
    overlay.classList.add('active');

    if (modal) {
        modal.innerHTML = `
            <div class="modal-header">
                <h2 id="titulo-editar">Editar Usuario</h2>
            </div>
            <form class="modal-form" id="form-editar-usuario">
                <div class="form-group">
                    <label for="nombre-editar">Nombre Completo *</label>
                    <input type="text" id="nombre-editar" value="" required />
                </div>

                <div class="form-group">
                    <label for="ci-editar">Cédula de Identidad *</label>
                    <input type="text" id="ci-editar" value="" disabled />
                </div>

                <div class="form-group">
                    <label for="password-editar">Contraseña *</label>
                    <input type="password" id="password-editar" value=""  />
                </div>

                <div class="form-group">
                    <label for="telefono-editar">Teléfono</label>
                    <input type="text" id="telefono-editar" value="" />
                </div>

                <div class="form-group">
                    <label for="rol-editar">Rol *</label>
                    <select id="rol-editar" >
                        <option value="admin">Admin</option>
                        <option value="gerente">Gerente</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="asesor">Asesor</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="supervisor-editar">ID Supervisor</label>
                    <input type="number" id="supervisor-editar" value="" />
                </div>
                <div class="form-group">
                    <label for="correo-editar">Correo Electrónico *</label>
                    <input type="email" id="correo-editar" value=""/>
                </div>

                <div class="form-group">
                    <label for="grupos-editar">Grupos *</label>
                    <select id="grupos-editar">
                        <option value="">Cargando grupos...</option>
                    </select>
                </div>

                <div class="modal-footer">
                    <button type="button" class="cancel-btn" onclick="cerrarModalEditarUsuario()">Cancelar</button>
                    <button type="submit" class="create-btn" onclick="guardarEditarUsuario(${id})">Guardar Cambios</button>
                </div>
            </form>
        `;
        
        // Cargar grupos primero y luego los datos del usuario
        await cargarGruposEnSelect();
        BuscarUsuarioPorId(id);
    }
}

export function BuscarUsuarioPorId(id) {
    console.log(typeof(id));
    id = parseInt(id, 10);
    console.log(typeof(id));
    const url = `${API_BASE_URL}/usuarios/${id}`;
    const token = localStorage.getItem('token');

    return fetch(url, {
        headers: {
            Authorization: "Bearer " + token,
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }
        return response.json();
    })
    .then(data => {
        console.log("Datos del usuario:", data);
        const usuario = data || {};
        console.log("Usuario encontrado:", usuario.usuario);
        
        document.getElementById('nombre-editar').value = usuario.nombre || '';
        document.getElementById('ci-editar').value = usuario.usuario || '';
        document.getElementById('telefono-editar').value = usuario.telefono || '';
        document.getElementById('rol-editar').value = usuario.rol || '';
        document.getElementById('supervisor-editar').value = usuario.superior || '';
        document.getElementById('correo-editar').value = usuario.correo || '';
        document.getElementById('password-editar').value = ''; // No llenar la contraseña por seguridad
        
        // Seleccionar el grupo del usuario
        const selectGrupos = document.getElementById('grupos-editar');
        if (selectGrupos && usuario.id_grupo) {
            selectGrupos.value = usuario.id_grupo;
        }
    })
    .catch(error => {
        console.error('Error al buscar usuario por ID:', error);
        throw error;
    });
}


export function guardarEditarUsuario(id_usuario) {
    event.preventDefault();

    const id = id_usuario;
    const nombre = document.getElementById('nombre-editar').value;
    const ci = document.getElementById('ci-editar').value;
    const telefono = document.getElementById('telefono-editar').value;
    const rol = document.getElementById('rol-editar').value;
    const supervisor = document.getElementById('supervisor-editar').value;
    const correo = document.getElementById('correo-editar').value;
    const password = document.getElementById('password-editar').value;
    const grupo = document.getElementById('grupos-editar').value; // Agregar grupo
    
    const url = `${API_BASE_URL}/usuarios/${id}`;
    const token = localStorage.getItem('token');

    const datos = {
        nombre: nombre,
        usuario: ci,
        password: password,
        rol: rol,
        superior: supervisor,
        telefono: telefono,
        correo: correo,
        id_grupo: grupo // Agregar grupo a los datos
    };

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(datos)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }
        return response.json();
    })
    .then(data => {
        console.log('Usuario actualizado:', data);
        showDialog('success', 'Usuario actualizado correctamente');
        cerrarModalEditarUsuario();
        CargarUsuarios(); // Recargar la lista de usuarios
    })
    .catch(error => {
        console.error('Error al actualizar usuario:', error);
        showDialog('error', 'Error al actualizar usuario: ' + error.message);
        alert('Error al actualizar usuario. Por favor, intente nuevamente.');
    });
}

export function CrearUsuario(){
    document.getElementById('form-crear-usuario').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir el envío del formulario por defecto
        const nombre = document.getElementById('nombre').value;
        const ci = document.getElementById('ci').value;
        const telefono = document.getElementById('telefono').value;
        const rol = document.getElementById('rol').value;
        const supervisor = document.getElementById('supervisor').value;
        const correo = document.getElementById('correo').value;
        const password = document.getElementById('password').value;

        const url = `${API_BASE_URL}/usuarios`;
        const token = localStorage.getItem('token');

        const datos = {
            nombre: nombre,
            usuario: ci,
            password: password,
            rol: rol,
            superior: supervisor,
            telefono: telefono,
            correo: correo,
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(datos)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            return response.json();
        })
        .then(data => {
            console.log('Usuario creado:', data);
            showDialog('success', 'Usuario creado correctamente');
            cerrarModalCrearUsuario();
            CargarUsuarios(); // Recargar la lista de usuarios
        })
        .catch(error => {
            console.error('Error al crear usuario:', error);
            showDialog('error', 'Error al crear usuario: ' + error.message);
        });
    });
}


export function EliminarUsuario(id) {
    const modal = document.createElement('div');
    modal.id = 'modal-eliminar-usuario';
    modal.classList.add('modal-confirmacion');
    modal.classList.add('active');

    modal.innerHTML = `
        <div >
            <h2>Eliminar Usuario</h2>
            <p>¿Está seguro que desea eliminar este usuario?</p>
            <div class="btns">
                <button id="confirmar-eliminar-usuario" class="btn-confirmar">Eliminar</button>
                <button id="cancelar-eliminar-usuario" class="btn-cancelar">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('cancelar-eliminar-usuario').onclick = function() {
        document.body.removeChild(modal);
    };

    document.getElementById('confirmar-eliminar-usuario').onclick = function() {
        const url = `${API_BASE_URL}/usuarios/${id}`;
        const token = localStorage.getItem('token');
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar usuario');
            }
            return response.json();
        })
        .then(data => {
            showDialog('success', 'Usuario eliminado correctamente');
            document.body.removeChild(modal);
            CargarUsuarios();
        })
        .catch(error => {
            document.body.removeChild(modal);
            showDialog('error', 'Error al eliminar usuario: ' + error.message);
            console.error('Error al eliminar usuario:', error);
            console.error('Status code:', error?.response?.status || error.status || 'Desconocido');

        });
    };
}

export function MostrarModalAsistencia(usuario) {
    const modal = document.getElementById('modal-asistencia');
    modal.style.display = 'flex';

    modal.innerHTML = `
           <div >
                
                <div >
                    <h2 id="titulo">ASISTENCIAS DE USUARIOS</h2>
                    <br>
                    <div class="controls">
                            <div class="control-filtros">
                                <label for="fecha-inicio">Fecha Inicio:</label>
                                <input type="date" id="fecha-inicio" />
                            </div>
                            <div class="control-filtros">
                                <label for="fecha-fin">Fecha Fin:</label>
                                <input type="date" id="fecha-fin" />
                            </div>
                            <div class="control-filtros">

                                <button type="button" id="filtrar-asistencias">Filtrar</button>

                            </div>
                    </div>

                    
                    <div id="tabla-asistencias" class="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Usuario</th>
                                    <th>Fecha_ingreso</th>
                                    <th>fecha_salida</th>
                                </tr>
                            </thead>
                            <tbody>
                                    <!-- Aquí se cargarán las asistencias dinámicamente -->
                            </tbody>
                        </table>
                    </div>

                        <div>
                            <button type="button" class="cancel-btn" onclick="const cerrar = () => { document.getElementById('modal-asistencia').style.display = 'none'; }; cerrar()">Cerrar</button>
                        </div>
                </div>

           </div>
           
    `;
    

    const btnFiltrarAsistencias = document.getElementById('filtrar-asistencias');
    btnFiltrarAsistencias.addEventListener('click', () => {
        const fechaInicio = document.getElementById('fecha-inicio').value;
        const fechaFin = document.getElementById('fecha-fin').value;
        cargarAsistencias(usuario, fechaInicio, fechaFin);
    });

}

export function cargarAsistencias(usuario, fechaInicio = null, fechaFin = null) {
    const url = new URL(`${API_BASE_URL}/asistencias`);
    const token = localStorage.getItem('token');

    if (usuario) {
        url.searchParams.append("usuario", usuario);
    }
    if (fechaInicio) {
        url.searchParams.append("fecha_inicio", fechaInicio);
    }
    if (fechaFin) {
        url.searchParams.append("fecha_fin", fechaFin);
    }

    return fetch(url, {
        headers: {
            Authorization: "Bearer " + token,
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar asistencias');
        }
        return response.json();
    })
    .then(data => {
        console.log("Datos de asistencias:", data);
        const tbody = document.querySelector('#tabla-asistencias tbody');
        
        if (!tbody) {
            console.error("No se encontró el elemento tbody en la tabla de asistencias");
            return;
        }

        tbody.innerHTML = data.asistencias.map(asistencia => {
            // Función para formatear la fecha como "YYYY-MM-DD / HH:mm:ss"
            function formatFecha(fechaStr) {
            if (!fechaStr) return '';
            const fecha = new Date(fechaStr);
            if (isNaN(fecha.getTime())) return fechaStr; // Si no es válida, retorna original
            const yyyy = fecha.getFullYear();
            const mm = String(fecha.getMonth() + 1).padStart(2, '0');
            const dd = String(fecha.getDate()).padStart(2, '0');
            const hh = String(fecha.getHours()).padStart(2, '0');
            const min = String(fecha.getMinutes()).padStart(2, '0');
            const ss = String(fecha.getSeconds()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd} / ${hh}:${min}:${ss}`;
            }
            return `
            <tr>
                <td>${asistencia.id || ''}</td>
                <td>${asistencia.usuario || ''}</td>
                <td>${formatFecha(asistencia.fecha_ingreso)}</td>
                <td>${formatFecha(asistencia.fecha_salida)}</td>
            </tr>
            `;
        }).join('');
        
        return data.asistencias;
    })
    .catch(error => {
        console.error('Error al cargar asistencias:', error);
        throw error;
    });
}

export async function obtenerGrupos(){
    const url = `${API_BASE_URL}/grupos`;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        if (!response.ok) {
            throw new Error('Error al cargar grupos');
        }
        const data = await response.json();
        console.log("Datos de grupos:", data);
        return data.grupos;
    } catch (error) {
        console.error('Error al cargar grupos:', error);
        throw error;
    }
}

export async function cargarGruposEnSelect() {
    try {
        const grupos = await obtenerGrupos();
        const selectGrupos = document.getElementById('grupos-editar');
        
        if (!selectGrupos) {
            console.error('No se encontró el select de grupos');
            return;
        }

        // Limpiar opciones existentes
        selectGrupos.innerHTML = '';
        
        // Agregar opción por defecto
        selectGrupos.innerHTML = '<option value="">Seleccionar grupo</option>';
        
        // Agregar opciones de grupos
        grupos.forEach(grupo => {
            const option = document.createElement('option');
            option.value = grupo.id_grupo || grupo.id; // Ajustar según la estructura de tu API
            option.textContent = grupo.nombre_grupo;
            selectGrupos.appendChild(option);
        });
        
    } catch (error) {
        console.error('Error al cargar grupos en select:', error);
        const selectGrupos = document.getElementById('grupos-editar');
        if (selectGrupos) {
            selectGrupos.innerHTML = '<option value="">Error al cargar grupos</option>';
        }
    }
}




