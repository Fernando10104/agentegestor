import { SVG_EDITAR, SVG_CREAR2,SVG_ELIMINAR } from '../../src/svg/svg.js';

export function cargarMetas(busqueda = '') {
    const url = new URL(`${API_BASE_URL}/metas`);
    const token = localStorage.getItem('token');

    if (busqueda) {
        url.searchParams.append("busqueda", busqueda);
    }

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar las metas');
        }
        return response.json();
    })
    .then(data => {
        
        const metasLista = document.getElementById('metas-lista');
        metasLista.innerHTML = ''; // Limpiar la lista antes de cargar nuevas metas
        const metas = data.metas || []; // Asegurarse de que metas sea un array
        metas.sort((a, b) => {
            const gananciaA = a.ganancia || 0;
            const gananciaB = b.ganancia || 0;
            return gananciaB - gananciaA; // Orden descendente
        });
        
        metas.forEach(meta => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', meta.usuario|| '');
            // Formatear meta_personal with puntos como separador de miles
            const metaPersonalFormateada = (meta.meta_personal !== undefined && meta.meta_personal !== null)
                ? meta.meta_personal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                : 'Sin meta asignada';
            const totalComisionFormateada = (meta.total_comision_asesor !== undefined && meta.total_comision_asesor !== null)
                ? meta.total_comision_asesor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                : 'Sin comisión';

            row.innerHTML = `
                <td class="acciones">
                    <button class="btn-editar" onclick="mostrarModalEditarMeta('${meta.usuario || ''}')">${SVG_EDITAR}</button>
                </td>
                <td>${meta.id_meta || 'N/A'}</td>
                <td class="meta-usuario">${meta.usuario || 'Sin usuario'}</td>
                <td class="meta-nombre">${meta.nombre || 'Sin nombre'}</td>
                <td class="meta-personal">${metaPersonalFormateada}</td>
                <td class="meta-total-comision">${totalComisionFormateada}</td>
                <td class="meta-cumplimiento">
                    ${
                        (meta.meta_personal && meta.total_comision_asesor)
                            ? `${Math.round((meta.total_comision_asesor / meta.meta_personal) * 100)}%`
                            : 'N/A'
                    }
                </td>
                <td class="ganancia">
                    ${meta.ganancia ? meta.ganancia.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : 'Sin ganancia'}
                </td>
            `;
            metasLista.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        // Mostrar mensaje de error en la tabla
        const metasLista = document.getElementById('metas-lista');
        if (metasLista) {
            metasLista.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-danger">
                        Error al cargar las metas: ${error.message}
                    </td>
                </tr>
            `;
        }
    });
}


export function guardarMetas(){
    const form = document.getElementById('form-crear-meta');
    if (!form) return;

    const usuario = form.querySelector('#usuario-meta').value;
    const metaPersonal = form.querySelector('#meta-personal').value;

    const token = localStorage.getItem('token');
    const payload = {
        usuario: usuario,
        meta_personal: metaPersonal
    };

    fetch(`${API_BASE_URL}/metas`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar la meta');
        }
        return response.json();
    })
    .then(data => {
        showDialog('success', 'Meta guardada correctamente');
        cargarMetas(); // Recargar la lista de metas
        // Opcional: cerrar modal, mostrar mensaje, etc.
    })
    .catch(error => {
        console.error('Error:', error);
        // Opcional: mostrar mensaje de error al usuario
        showDialog('error', 'Error al guardar meta: ' + error.message);
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
        return data.grupos;
    } catch (error) {
        console.error('Error al cargar grupos:', error);
        throw error;
    }
}//devuelve un diccionario con los grupos


export function CrearGrupo(event){
    event.preventDefault(); // Prevenir el envío del formulario
    const form = document.getElementById('form-crear-grupo');
    if (!form) return;

    const nombreGrupo = form.querySelector('#nombre-grupo').value;
    const metaGrupo = form.querySelector('#meta-grupo').value;

    const token = localStorage.getItem('token');
    const payload = {
        nombre: nombreGrupo,
        meta: metaGrupo
    };

    fetch(`${API_BASE_URL}/grupos`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al crear el grupo');
        }
        return response.json();
    })
    .then(data => {
        showDialog('success', 'Grupo creado correctamente');
        cargarMetas();
        // Cerrar el modal
        document.getElementById('modal-crear-grupo').classList.remove('active');
        // Opcional: cerrar modal, mostrar mensaje, etc.
    })
    .catch(error => {
        console.error('Error:', error);
        showDialog('error', 'Error al crear grupo: ' + error.message);
        // Opcional: mostrar mensaje de error al usuario
    });

}


export function cargarGruposEnSelect(){
    const select = document.getElementById('grupo-select');
    if (!select) return;

    obtenerGrupos()
        .then(grupos => {
            grupos.forEach(grupo => {
                const option = document.createElement('option');
                option.value = grupo.id_grupo;
                option.textContent = grupo.nombre_grupo;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error al cargar grupos en el select:', error);
        });
}

export async function obtenerGruposPorId(idGrupo) {
    if (!idGrupo) {
        const grupoLista = document.getElementById('grupo-lista');
        grupoLista.innerHTML = '<tr><td colspan="4" class="text-center text-danger">seleccione un grupo</td></tr>';
        return;
    }
    const url = `${API_BASE_URL}/grupos/${idGrupo}`;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        if (!response.ok) {
            throw new Error('Error al cargar grupo');
        }
        const data = await response.json();
        // Cargar datos del grupo en la tabla
        const grupoLista = document.getElementById('grupo-lista');
        grupoLista.innerHTML = ''; // Limpiar la tabla antes de cargar

        if (data.grupo) {
            const grupo = data.grupo;
            const row = document.createElement('tr');
            row.innerHTML = `
            <td class="acciones">
                <button class="btn-editar" onclick="editarGrupo(${grupo.id_grupo})">${SVG_EDITAR}</button>
                <button class="btn-editar" onclick="EliminarGrupo(${grupo.id_grupo})">${SVG_ELIMINAR}</button>
            </td>
            <td>${grupo.id_grupo || 'N/A'}</td>
            <td>${grupo.nombre_grupo || 'Sin nombre'}</td>
            <td>${grupo.meta_grupo || 'Sin meta'}</td>
            `;
            grupoLista.appendChild(row);
        } else {
            grupoLista.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-danger">
                No se encontró el grupo.
                </td>
            </tr>
            `;
        }
        return data.grupo;
    } catch (error) {
        console.error('Error al cargar grupo:', error);
        throw error;
    }
}



export async function cargarListaUsuariosporGrupoId(grupoId) {
    if (!grupoId) return;

    const url = `${API_BASE_URL}/grupos/${grupoId}/resumen-mes`;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Error al cargar el resumen mensual del grupo');
        }
        const data = await response.json();

        // Mostrar usuarios en la tabla
        const usuariosLista = document.getElementById('usuarios-lista');
        if (usuariosLista) {
            usuariosLista.innerHTML = '';
            (data.usuarios || []).forEach(usuario => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${usuario.usuario}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.total_comision_asesor}</td>
                `;
                usuariosLista.appendChild(row);
            });
        }
        const totalComisionesGrupo = document.getElementById('total-comisiones-grupo');
        if (totalComisionesGrupo) {
            totalComisionesGrupo.textContent = data.suma_comision_asesor_grupal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") || 0;
        }

        return data;
    } catch (error) {
        console.error('Error al cargar resumen mensual del grupo:', error);
        // Opcional: mostrar mensaje de error en la UI
    }
}


export function guardarEditarGrupo(event){
    event.preventDefault();
    const idGrupo = document.getElementById('id-grupo').value;
    const nombreGrupo = document.getElementById('nombre-grupo-ed').value;
    const metaGrupo = document.getElementById('meta-grupo-ed').value;
    const token = localStorage.getItem('token');
    const url = `${API_BASE_URL}/grupos/${idGrupo}`;

    const datos = {
        nombre_grupo: nombreGrupo,
        meta_grupo: metaGrupo
    };
    console.log(datos);

    fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            datos
        )
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar los cambios');
        }
        return response.json();
    })
    .then(data => {
        console.log('Grupo actualizado:', data);
        showDialog('success', 'Grupo actualizado correctamente');
        // Cerrar el modal
        const modalEditarGrupo = document.getElementById('modal-editar-grupo');
        modalEditarGrupo.classList.remove('active');
    })
    .catch(error => {
        console.error('Error al guardar los cambios:', error);
        showDialog('error', 'Error al guardar los cambios: ' + error.message);
    });
}


export async function buscargrupoporid(idGrupo) {
    const url = `${API_BASE_URL}/grupos/${idGrupo}`;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        if (!response.ok) {
            throw new Error('Error al cargar grupo');
        }
        const data = await response.json();
        console.log("Datos del grupo:", data);
        return data.grupo;
    } catch (error) {
        console.error('Error al cargar grupo:', error);
        throw error;
    }
}


export function EliminarGrupo(id) {
    const modal = document.createElement('div');
    modal.id = 'modal-eliminar-grupo';
    modal.classList.add('modal-confirmacion', 'active');

    modal.innerHTML = `
        <div>
            <h2>Eliminar Grupo</h2>
            <p>¿Está seguro que desea eliminar este grupo?</p>
            <div class="btns">
                <button id="confirmar-eliminar-grupo" class="btn-confirmar">Eliminar</button>
                <button id="cancelar-eliminar-grupo" class="btn-cancelar">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('cancelar-eliminar-grupo').onclick = function() {
        modal.classList.remove('active');
        document.body.removeChild(modal);
    };

    document.getElementById('confirmar-eliminar-grupo').onclick = function() {
        const url = `${API_BASE_URL}/grupos/${id}`;
        const token = localStorage.getItem('token');
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar grupo');
            }
            return response.json();
        })
        .then(data => {
            document.body.removeChild(modal);
            showDialog('success', 'Comisión actualizada correctamente');
            cargarMetas();
        })
        .catch(error => {
            document.body.removeChild(modal);
            showDialog('error', 'Error al eliminar grupo: ' + error.message);
            console.error('Error al eliminar grupo:', error);
            console.error('Status code:', error?.response?.status || error.status || 'Desconocido');
        });
    };
}