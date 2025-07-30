export async function verificarToken() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/sistema_web/docs/login.html";
        return;
    }

    try {
        const response = await fetch("https:///word.puntodigitalpy.online/verificar-token", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Token válido. Usuario:", data.usuario);

            // Podés usar el nombre del usuario en la interfaz
            console.log("Usuario:", data.usuario);
            document.getElementById("usuario-nombre").innerText = data.usuario.nombre;

        } else {
            console.warn("Token inválido o expirado.");
            localStorage.removeItem("token");
            window.location.href = "/sistema_web/docs/login.html";
        }
    } catch (error) {
        console.error("Error al verificar token:", error);
        window.location.href = "/sistema_web/docs/login.html";
    }
}

// Llamar automáticamente al cargar la página
verificarToken();
