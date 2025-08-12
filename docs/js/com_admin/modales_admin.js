export function mostrarModalCrearUsuario() {
    console.log("Mostrando modal para crear usuario");
    const modal = document.getElementById('modalcrear'); // ✅ Usar ID consistente
    const overlay = document.querySelector('.modal-overlay');
    if (modal) {
        modal.classList.add('active');
        if (overlay) overlay.classList.add('active');
    } else {
        console.error("Modal con ID 'modalcrear' no encontrado");
    }
}

export function cerrarModalCrearUsuario() {
    console.log("Cerrando modal para crear usuario");
    const modal = document.getElementById('modalcrear'); // ✅ Usar el mismo ID
    const overlay = document.querySelector('.modal-overlay');
    if (modal) {
        modal.classList.remove('active');
        if (overlay) overlay.classList.remove('active');

        // ✅ Buscar el formulario dentro del modal
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    } else {
        console.error("Modal con ID 'form-crear-usuario' no encontrado");
    }
}

export function cerrarModalEditarUsuario() {
    console.log("Cerrando modal para editar usuario");
    const modal = document.getElementById('modal-editar-usuario');
    const overlay = document.querySelector('.modal-overlay');
    if (modal) {
        modal.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        // Limpiar el contenido del modal
        modal.innerHTML = '';
    } else {
        console.error("Modal con ID 'modal-editar-usuario' no encontrado");
    }
}

export function mostrarModalCrearCategoria() {
    console.log("Mostrando modal para crear categoría");
    const modal = document.getElementById('modal-crear-categoria'); // ✅ Usar ID consistente
    const overlay = document.querySelector('.modal-overlay');
    if (modal) {
        modal.classList.add('active');
        if (overlay) overlay.classList.add('active');
    } else {
        console.error("Modal con ID 'modal-crear-categoria' no encontrado");
    }
}
export function cerrarModalCrearCategoria() {
    console.log("Cerrando modal para crear categoría");
    const modal = document.getElementById('modal-crear-categoria');
    if (modal) {
        modal.classList.remove('active');
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    } else {
        console.error("Modal con ID 'modal-crear-categoria' no encontrado");
    }
}

export function mostrarModalCrearMarca() {
    console.log("Mostrando modal para crear marca");
    const modal = document.getElementById('modal-crear-marca');
    const overlay = document.querySelector('.modal-overlay');
    if (modal) {
        modal.classList.add('active');
        if (overlay) overlay.classList.add('active');
    } else {
        console.error("Modal con ID 'modal-crear-marca' no encontrado");
    }
}

export function cerrarModalCrearMarca() {
    console.log("Cerrando modal para crear marca");
    const modal = document.getElementById('modal-crear-marca');
    const overlay = document.querySelector('.modal-overlay');
    if (modal) {
        modal.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    } else {
        console.error("Modal con ID 'modal-crear-marca' no encontrado");
    }
}
