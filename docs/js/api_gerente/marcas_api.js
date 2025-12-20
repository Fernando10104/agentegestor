// falta editar y eliminar 
import { SVG_EDITAR, SVG_ELIMINAR, SVG_ASISTENCIAS } from '../../src/svg/svg.js';





export function cargarMarcas(busqueda = '', id_usuario = '') {
    const url = new URL(`${API_BASE_URL}/marcas_all`);
    const token = localStorage.getItem('token');

    if (busqueda) {
        url.searchParams.append("busqueda", busqueda);
    }
    url.searchParams.append("id_usuario", id_usuario);
    console.log("datos de url",url.toString());
    
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar las marcas');
        }
        return response.json();
    })
    .then(data => {
        console.log('Marcas cargadas:', data);
        const marcasLista = document.getElementById('marcas-lista');
        marcasLista.innerHTML = ''; // Limpiar la lista antes de cargar nuevas marcas
        const marcas = data.marcas || []; // Asegurarse de que marcas sea un array
        marcas.forEach(marca => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', marca.id_marca);
            row.innerHTML = `
                <td class="acciones">
                    <button class="btn-editar" onclick="mostrarModalEditarMarca(${marca.id_marca})">${SVG_EDITAR}</button>
                    <button class="btn-eliminar" onclick="mostrarModalEliminarMarca(${marca.id_marca})">${SVG_ELIMINAR}</button>
                </td>
                <td>${marca.id_marca}</td>
                <td class="marca-nombre">${marca.marca}</td>
                <td class="marca-minimo">${marca.monto_min}</td>
                <td class="marca-maximo">${marca.monto_max}</td>
                <td class="marca-comision-nuevo">${marca.comision_nuevo}</td>
                <td class="marca-comision-renovacion">${marca.comision_renovacion}</td>
                <td class="marca-metodo-pago">${marca.metodo_pago}</td>
                <td class="marca-id-usuario">${marca.id_usuario}</td>
            `;
            marcasLista.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


export function CrearNuevaMarca() {
    const url = new URL(`${API_BASE_URL}/marcas`);
    const token = localStorage.getItem('token');

    const nuevaMarca = {
        marca: document.getElementById("nombre-marca").value,
        monto_min: document.getElementById("monto-minimo").value,
        monto_max: document.getElementById("monto-maximo").value,
        comision_nuevo: document.getElementById("comision-nuevo").value,
        comision_renovacion: document.getElementById("comision-renovacion").value,
        metodo_pago: document.getElementById("metodo-pago").value
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaMarca)
    })
    .then(async response => {
        if (!response.ok) {
            // 👇 intentamos obtener el mensaje real del backend
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.detail || 'Error desconocido al crear la marca';
            throw new Error(errorMessage);
        }
        return response.json();
    })
    .then(data => {
        console.log('Marca creada:', data);
        showDialog('success', 'Marca creada correctamente');
        cerrarModalCrearMarca(); 
        console.log("Detectando usuario seleccionado y cargando marcas...");
        const select = document.getElementById("usuario-select");
        const busqueda = document.getElementById("filtro-input").value;
        const id_usuario = select.value;
        console.log("Usuario seleccionado:", id_usuario);
         
    })
    .catch(error => {
        console.error('Error:', error);
        showDialog('error', error.message);
    });
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
    })
    .catch(error => {
        console.error('Error:', error);
        showDialog('error', 'Error al eliminar marca: ' + error.message);
    });
}