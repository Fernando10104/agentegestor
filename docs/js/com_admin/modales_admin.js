export function mostrarModalCrearUsuario() {
    console.log("Mostrando modal para crear usuario");
    const modal = document.getElementById('modalacerrar'); // ✅ Usar ID consistente
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error("Modal con ID 'modalacerrar' no encontrado");
    }
}

export function cerrarModalCrearUsuario() {
    console.log("Cerrando modal para crear usuario");
    const modal = document.getElementById('modalacerrar'); // ✅ Usar el mismo ID
    if (modal) {
        modal.style.display = 'none';
        
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
    const modal = document.getElementById('modal-editar-usuario');
    if(modal){
        modal.style.display = 'none';
        
        // Limpiar el contenido del modal
        modal.innerHTML = '';
    }
}