/**
 * Helper: Abrir modal por ID
 * @param {string} id - id del elemento modal en el DOM
 */
function openModalById(id) {
    const modal = document.getElementById(id);
    const overlay = document.querySelector('.modal-overlay');
    if (!modal) {
        console.error(`openModalById: modal con id '${id}' no encontrado`);
        return null;
    }
    modal.classList.add('active');
    if (overlay) overlay.classList.add('active');
    return modal;
}

/**
 * Helper: Cerrar modal por ID
 * @param {string} id - id del elemento modal en el DOM
 * @param {{clearContent?: boolean, resetForm?: boolean}} options
 */
function closeModalById(id, options = {}) {
    const modal = document.getElementById(id);
    const overlay = document.querySelector('.modal-overlay');
    if (!modal) {
        console.error(`closeModalById: modal con id '${id}' no encontrado`);
        return;
    }
    modal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');

    if (options.resetForm) {
        const form = modal.querySelector('form');
        if (form) form.reset();
    }

    if (options.clearContent) {
        modal.innerHTML = '';
    }
}

// ----------------------
// Modales para usuarios
// ----------------------
/**
 * Mostrar modal para crear un usuario.
 * Exportado como `mostrarModalCrearUsuario` para mantener compatibilidad.
 */
export function mostrarModalCrearUsuario() {
    // ID usado en el HTML: 'modalcrear'
    openModalById('modalcrear');
}

/**
 * Cerrar modal de crear usuario y resetear el formulario interno si existe.
 */
export function cerrarModalCrearUsuario() {
    closeModalById('modalcrear', { resetForm: true });
}

/**
 * Cerrar modal de editar usuario. Limpiamos contenido para evitar estados residuales.
 */
export function cerrarModalEditarUsuario() {
    closeModalById('modal-editar-usuario', { clearContent: true });
}

// -------------------------
// Modales para categorías
// -------------------------
/**
 * Mostrar modal para crear categoría.
 */
export function mostrarModalCrearCategoria() {
    openModalById('modal-crear-categoria');
}

/**
 * Cerrar modal crear categoría y resetear formulario.
 */
export function cerrarModalCrearCategoria() {
    closeModalById('modal-crear-categoria', { resetForm: true });
}

// ----------------------
// Modales para marcas
// ----------------------
/**
 * Mostrar modal para crear marca.
 */
export function mostrarModalCrearMarca() {
    openModalById('modal-crear-marca');
}

/**
 * Cerrar modal crear marca y resetear formulario.
 */
export function cerrarModalCrearMarca() {
    closeModalById('modal-crear-marca', { resetForm: true });
}
