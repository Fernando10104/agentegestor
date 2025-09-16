// js/login.js  
    

    function togglePasswordVisibility() {
        const passwordInput = document.getElementById("password");
        const eyeIcon = document.getElementById("eye-icon");

        const eyeOpenSVG = `
            <svg id="eye-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-eye h-4 w-4 text-primary">
                <path d="M2.062 12.348a1 1 0 0 1 0-.696
                    10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696
                    10.75 10.75 0 0 1-19.876 0"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </svg>
        `;

        const eyeOffSVG = `
            <svg id="eye-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-eye-off h-4 w-4 text-primary">
                <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575
                    1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"></path>
                <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"></path>
                <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151
                    1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"></path>
                <path d="m2 2 20 20"></path>
            </svg>
        `;

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            eyeIcon.parentNode.innerHTML = eyeOffSVG;
        } else {
            passwordInput.type = "password";
            eyeIcon.parentNode.innerHTML = eyeOpenSVG;
        }
    }
document.getElementById("login-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Formato que espera FastAPI con OAuth2PasswordRequestForm
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password); 
    
    const URL_api = "https://word.puntodigitalpy.online"; // Cambia esto por tu URL base
    //const URL_api = "http://localhost:8000"; // Cambia esto por tu URL base

    try {
        const response = await fetch(`${URL_api}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData.toString()
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.access_token;

            // Guardar JWT y opcionalmente el rol
            localStorage.setItem("token", token);
            localStorage.setItem("rol", data.rol); // si lo necesitás más adelante
            const rol = data.rol;
            if(rol === "admin"){
                //window.location.href = "/agentegestor/index.html";
                window.location.href = "/index.html"; // Redirigir al index después de iniciar sesión
            }else if(rol === "supervisor" || rol === "Supervisor"){
                window.location.href = "/supervisores.html";
                //window.location.href = "/agentegestor/supervisores.html";
            }else if(rol === "asesor" || rol === "Asesor"){
                window.location.href = "/asesores.html";
                //window.location.href = "/agentegestor/asesores.html";
            }
            
            
        } else {
            const errorData = await response.json();
            alert("Error de inicio de sesión: " + (errorData.detail || "Credenciales inválidas"));
        }
    } catch (error) {
        console.error("Error al intentar iniciar sesión:", error);
        alert("No se pudo conectar al servidor.");
    }
});
