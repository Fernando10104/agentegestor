import { API_BASE_URL } from '../config.js';
export async function verificarToken() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/verificar-token`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Token válido. Usuario:", data.usuario);

            // Mostrar nombre en la interfaz
            document.getElementById("usuario-nombre").innerText = data.usuario.nombre;

            // Guardar el nombre en localStorage
            localStorage.setItem("nombre_usuario", data.usuario.nombre);

            // GUARDAR EL ID DEL USUARIO EN LOCAL STORAGE
            localStorage.setItem("id_usuario", data.usuario.id_usuario);
            
            //guardar el id del superior
            localStorage.setItem("superior", data.usuario.superior);

            localStorage.setItem("url_imagen", data.usuario.url_imagen);

        } else {
            console.warn("Token inválido o expirado.");
            localStorage.removeItem("token");
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error("Error al verificar token:", error);
        window.location.href = "login.html";
    }
}

// Llamar automáticamente al cargar la página
verificarToken();
