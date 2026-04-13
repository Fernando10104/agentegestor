import { API_BASE_URL } from "../config.js";
import { SVG_EDITAR, SVG_ELIMINAR, SVG_ASISTENCIAS } from '../../src/svg/svg.js';

export function cargarCategorias() {
    const url = `${API_BASE_URL}/categorias`;
    const token = localStorage.getItem('token');

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        return response.json();
    })
    .then(data => {
        console.log('Categorías cargadas:', data);
        const categorias = data.categorias || [];
        const categoriasLista = document.getElementById('categorias-lista');
        categoriasLista.innerHTML = ''; // Limpiar lista existente
        categorias.forEach(categoria => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="acciones">
                    <button class="btn-editar" onclick="mostrarModalEditarCategoria(${categoria.id_categoria}, '${categoria.categoria}')">${SVG_EDITAR}</button>
                    <button class="btn-eliminar" onclick="mostrarModalEliminarCategoria(${categoria.id_categoria})">${SVG_ELIMINAR}</button>
                </td>
                <td>${categoria.id_categoria}</td>
                <td>${categoria.categoria}</td>
            `;
            categoriasLista.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error al cargar categorías:', error);
    });
}


export function guardarNuevaCategoria(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    

    const nombreCategoria = document.getElementById('nombre-categoria').value.trim();
    if (!nombreCategoria) {
        alert('El nombre de la categoría es obligatorio.');
        return;
    }
    console.log('Guardando nueva categoría...' + nombreCategoria);
    console.log(typeof(nombreCategoria));
    const url = `${API_BASE_URL}/categorias`;
    const token = localStorage.getItem('token');

    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ categoria: nombreCategoria })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al crear la categoría');
        }
        return response.json();
    })
    .then(data => {
        console.log('Categoría creada:', data);
        showDialog('success', 'Categoría creada correctamente');
        cerrarModalCrearCategoria(); // Cerrar el modal después de crear
        cargarCategorias(); // Recargar la lista de categorías
    })
    .catch(error => {
        console.error('Error al crear categoría:', error);
        showDialog('error', 'Error al crear categoría: ' + error.message);
    });
}

export function EliminarCategoria(id) {
    const url = `${API_BASE_URL}/categorias/${id}`;
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
            throw new Error('Error al eliminar la categoría');
        }
        return response.json();
    })
    .then(data => {
        console.log('Categoría eliminada:', data);
        showDialog('success', 'Categoría eliminada correctamente');
        cargarCategorias(); // Recargar la lista de categorías
    })
    .catch(error => {
        console.error('Error al eliminar categoría:', error);
        showDialog('error', 'Error al eliminar categoría: ' + error.message);
    });
}



export function guardarEditarCategoria(id) {
    const nombreCategoria = document.getElementById('nombre-categoria-editar').value.trim();
    if (!nombreCategoria) {
        alert('El nombre de la categoría es obligatorio.');
        return;
    }

    const url = `${API_BASE_URL}/categorias/${id}`;
    const token = localStorage.getItem('token');

    fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ categoria: nombreCategoria })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al editar la categoría');
        }
        return response.json();
    })
    .then(data => {
        console.log('Categoría editada:', data);
        showDialog('success', 'Categoría actualizada correctamente');
        cerrarModalEditarCategoria(); // Cerrar el modal después de editar
        cargarCategorias(); // Recargar la lista de categorías
    })
    .catch(error => {
        console.error('Error al editar categoría:', error);
        showDialog('error', 'Error al editar categoría: ' + error.message);
    });
}