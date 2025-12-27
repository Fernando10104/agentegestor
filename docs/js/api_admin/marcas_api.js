// falta editar y eliminar 
import { SVG_EDITAR, SVG_ELIMINAR, SVG_ASISTENCIAS } from '../../src/svg/svg.js';





export async function cargarMarcas(busqueda = '', id_usuario = '') {
    const url = new URL(`${API_BASE_URL}/marcas_all`);
    const token = localStorage.getItem('token');

    if (busqueda) {
        url.searchParams.append('busqueda', busqueda);
    }
    url.searchParams.append('id_usuario', id_usuario);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => null);
            const message = errData?.detail || 'Error al cargar las marcas';
            throw new Error(message);
        }

        const data = await response.json();
        // Retornar el objeto de datos para que el llamador lo procese
        return data;
    } catch (error) {
        console.error('Error en cargarMarcas:', error);
        throw error;
    }
}


export async function CrearNuevaMarca() {
    const url = new URL(`${API_BASE_URL}/marcas`);
    const token = localStorage.getItem('token');

    const select = document.getElementById("usuario-select");
    const id_usuario_destino = select ? parseInt(select.value) : null;

    const nuevaMarca = {
        marca: document.getElementById("nombre-marca").value,
        monto_min: document.getElementById("monto-minimo").value,
        monto_max: document.getElementById("monto-maximo").value,
        comision_nuevo: document.getElementById("comision-nuevo").value,
        comision_renovacion: document.getElementById("comision-renovacion").value,
        metodo_pago: document.getElementById("metodo-pago").value,
        id_usuario_destino: id_usuario_destino
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaMarca)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.detail || 'Error desconocido al crear la marca';
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('Marca creada:', data);
        if (typeof showDialog === 'function') showDialog('success', 'Marca creada correctamente');
        if (typeof cerrarModalCrearMarca === 'function') cerrarModalCrearMarca();

        // Notificar al resto de la app que se creó una marca (para recargar la lista)
        try { document.dispatchEvent(new CustomEvent('marcas:created', { detail: { id_usuario: id_usuario_destino } })); } catch (e) {}

        return data;
    } catch (error) {
        console.error('Error:', error);
        if (typeof showDialog === 'function') showDialog('error', error.message);
        throw error;
    }
}



export function EditarMarca(id_marca){
    const url = new URL(`${API_BASE_URL}/marcas/${id_marca}`);
    const token = localStorage.getItem('token');
    const marcaEditada = {
        marca: document.getElementById("editar-nombre-marca").value,
        monto_min: document.getElementById("editar-monto-minimo").value,
        monto_max: document.getElementById("editar-monto-maximo").value,
        comision_nuevo: document.getElementById("editar-comision-nuevo").value,
        comision_renovacion: document.getElementById("editar-comision-renovacion").value,
        metodo_pago: document.getElementById("editar-metodo-pago").value,
        
    };

    fetch(url, {
        method: 'PUT', // Cambiar de GET a PUT
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(marcaEditada)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al editar la marca');
        }
        return response.json();
    })
    .then(data => {
        console.log('Marca editada:', data);
        showDialog('success', 'Marca actualizada correctamente');
        const modal = document.getElementById('modal-editar-marca');
        if (modal) {
            modal.style.display = 'none';
        }
        console.log("Detectando usuario seleccionado y cargando marcas...");
        const select = document.getElementById("usuario-select");
        const busqueda = document.getElementById("filtro-input").value;
        const id_usuario = select.value;
        console.log("Usuario seleccionado:", id_usuario);
        cargarMarcas(busqueda, id_usuario);
        // Recargar la lista de marcas después de editar
        try { document.dispatchEvent(new CustomEvent('marcas:edited', { detail: { id_usuario: id_usuario } })); } catch (e) {}
    })
    .catch(error => {
        console.error('Error:', error);
        showDialog('error', 'Error al editar marca: ' + error.message);
    });
}


export function EliminarMarca(id_marca) {
    const url = new URL(`${API_BASE_URL}/marcas/${id_marca}`);
    const token = localStorage.getItem('token');

    fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar la marca');
        }
        return response.json();
    })
    .then(data => {
        console.log('Marca eliminada:', data);
        showDialog('success', 'Marca eliminada correctamente');
        try { document.dispatchEvent(new CustomEvent('marcas:deleted', { detail: { id_marca } })); } catch (e) {}
    })
    .catch(error => {
        console.error('Error:', error);
        showDialog('error', 'Error al eliminar marca: ' + error.message);
    });
}