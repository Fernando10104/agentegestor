import { API_BASE_URL } from '../config.js';

// Una sola petición compartida por todas las llamadas de la misma carga de página
let verificacionPendiente = null;

function guardarDatosUsuario(usuario) {
    const elNombre = document.getElementById("usuario-nombre");
    if (elNombre) {
        elNombre.innerText = usuario.nombre;
    }

    localStorage.setItem("nombre_usuario", usuario.nombre);
    localStorage.setItem("id_usuario", usuario.id_usuario);
    localStorage.setItem("superior", usuario.superior);
    localStorage.setItem("url_imagen", usuario.url_imagen || "");
}

export function verificarToken() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return Promise.resolve(null);
    }

    // Devuelve la misma promesa si ya hay una verificación en curso o resuelta
    if (verificacionPendiente) {
        return verificacionPendiente;
    }

    verificacionPendiente = (async () => {
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
                console.log("Token válido.");

                // Mostrar nombre en la interfaz y guardar datos en localStorage
                guardarDatosUsuario(data.usuario);

                return data.usuario;
            } else {
                console.warn("Token inválido o expirado.");
                verificacionPendiente = null; // permitir reintentos
                localStorage.removeItem("token");
                window.location.href = "login.html";
                return null;
            }
        } catch (error) {
            console.error("Error al verificar token:", error);
            verificacionPendiente = null; // permitir reintentos
            window.location.href = "login.html";
            return null;
        }
    })();

    return verificacionPendiente;
}

// Llamar automáticamente al cargar la página
verificarToken();
