export function cerrarSesion() {
    const ahoraParaguay = new Date();
    
    // Mismo formato sin barras
    const año = ahoraParaguay.getFullYear();
    const mes = String(ahoraParaguay.getMonth() + 1).padStart(2, '0');
    const dia = String(ahoraParaguay.getDate()).padStart(2, '0');
    const horas = String(ahoraParaguay.getHours()).padStart(2, '0');
    const minutos = String(ahoraParaguay.getMinutes()).padStart(2, '0');
    const segundos = String(ahoraParaguay.getSeconds()).padStart(2, '0');
    
    const hora = `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
    const horaEncoded = encodeURIComponent(hora);
    const token = localStorage.getItem("token");

    fetch(`${API_BASE_URL}/conexiones/salida/${horaEncoded}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    })
    .then(response => {
        console.log('Sesión cerrada en el servidor');
    })
    .catch(error => {
        console.error('Error al cerrar sesión en el servidor:', error);
    })
    .finally(() => {
        // Eliminar token y rol del almacenamiento local DESPUÉS de la petición
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        localStorage.removeItem("id_usuario");
        localStorage.removeItem("nombre_usuario");
        localStorage.removeItem('entradaMarcada');

        // Redirigir al login
        window.location.href = "login.html";
    });
}