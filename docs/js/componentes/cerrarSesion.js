export function cerrarSesion() {
    // Eliminar token y rol del almacenamiento local
    localStorage.removeItem("token");
    localStorage.removeItem("rol");

    // Redirigir al login
    window.location.href = "/sistema_web/docs/login.html";
}