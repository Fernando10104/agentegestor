import { API_BASE_URL } from '../config.js';
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
                    <td>${usuario[5] || ''}</td>
                    <td>${usuario[3] || ''}</td>
                    <td>${usuario[8] || ''}</td>
                    <td>
                        <button class="btn-editar" data-id="${usuario[0]}">Editar</button>
                        <button class="btn-eliminar" data-id="${usuario[0]}">Eliminar</button>
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



export function mostrarEditarUsuario(id) {
    
    const modal = document.getElementById('modal-editar-usuario');
    modal.style.display = 'block';
    if (modal) {
            modal.innerHTML = `
                <div class="modal-header">
                    <h2 id="titulo-editar">Editar Usuario</h2>
                    <p id="descripcion-editar">Modifique la información del usuario</p>
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
                            <option value="supervisor">Supervisor</option>
                            <option value="asesor">Asesor</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="comision-editar">Comisión</label>
                        <input type="number" id="comision-editar" value="" />
                    </div>

                    <div class="form-group">
                        <label for="supervisor-editar">ID Supervisor</label>
                        <input type="number" id="supervisor-editar" value="" />
                    </div>
                    <div class="form-group">
                        <label for="correo-editar">Correo Electrónico *</label>
                        <input type="email" id="correo-editar" value=""/>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="cancel-btn" onclick="cerrarModalEditarUsuario()">Cancelar</button>
                        <button type="submit" class="edit-btn" onclick="guardarEditarUsuario(${id})">Guardar Cambios</button>
                    </div>
                </form>
            `;
        BuscarUsuarioPorId(id)

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
        document.getElementById('comision-editar').value = usuario.comision || '';
        document.getElementById('supervisor-editar').value = usuario.superior || '';
        document.getElementById('correo-editar').value = usuario.correo || '';
        document.getElementById('password-editar').value = ''; // No llenar la contraseña por seguridad


    })
    .catch(error => {
        console.error('Error al buscar usuario por ID:', error);
        throw error;
    });
}


export function guardarEditarUsuario(id_usuario) {
    
    event.preventDefault();

    const id = id_usuario; // Obtener ID del usuario desde el modal
    const nombre = document.getElementById('nombre-editar').value;
    const ci = document.getElementById('ci-editar').value;
    const telefono = document.getElementById('telefono-editar').value;
    const rol = document.getElementById('rol-editar').value;
    const comision = document.getElementById('comision-editar').value;
    const supervisor = document.getElementById('supervisor-editar').value;
    const correo = document.getElementById('correo-editar').value;
    const password = document.getElementById('password-editar').value;
    const url = `${API_BASE_URL}/usuarios/${id}`;
    const token = localStorage.getItem('token');

    const datos = {
        nombre: nombre,
        usuario: ci,
        password: password,
        rol: rol,
        comision: comision,
        superior: supervisor,
        telefono: telefono,
        correo: correo,
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
        cerrarModalEditarUsuario();
        CargarUsuarios(); // Recargar la lista de usuarios
    })
    .catch(error => {
        console.error('Error al actualizar usuario:', error);
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
        const comision = document.getElementById('comision').value;
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
            comision: comision,
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
            cerrarModalCrearUsuario();
            CargarUsuarios(); // Recargar la lista de usuarios
        })
        .catch(error => {
            console.error('Error al crear usuario:', error);
            alert('Error al crear usuario. Por favor, intente nuevamente.');
        });
    });
}


export function EliminarUsuario(id) {
    const modal = document.createElement('div');
    modal.id = 'modal-eliminar-usuario';
    modal.style.display = 'flex';

    modal.innerHTML = `
        <div>
            <h2>Eliminar Usuario</h2>
            <p>¿Está seguro que desea eliminar este usuario?</p>
            <div>
                <button id="confirmar-eliminar-usuario" style="margin-right:1rem;background:#d9534f;color:#fff;padding:0.5rem 1rem;border:none;border-radius:4px;">Eliminar</button>
                <button id="cancelar-eliminar-usuario" style="padding:0.5rem 1rem;border:none;border-radius:4px;">Cancelar</button>
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
            document.body.removeChild(modal);
            CargarUsuarios();
        })
        .catch(error => {
            document.body.removeChild(modal);
            alert('Error al eliminar usuario. Por favor, intente nuevamente.');
            console.error('Error al eliminar usuario:', error);
            console.error('Status code:', error?.response?.status || error.status || 'Desconocido');

        });
    };
}