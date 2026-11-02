import { API_BASE_URL } from "../config.js";

function obtenerHoraParaguay() {
    const ahoraParaguay = new Date();
    const año = ahoraParaguay.getFullYear();
    const mes = String(ahoraParaguay.getMonth() + 1).padStart(2, '0');
    const dia = String(ahoraParaguay.getDate()).padStart(2, '0');
    const horas = String(ahoraParaguay.getHours()).padStart(2, '0');
    const minutos = String(ahoraParaguay.getMinutes()).padStart(2, '0');
    const segundos = String(ahoraParaguay.getSeconds()).padStart(2, '0');
    return `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
}

function confirmarSalida() {
    return new Promise((resolve) => {
        let resuelto = false;
        const finalizar = (valor) => {
            if (resuelto) return;
            resuelto = true;
            resolve(valor);
        };

        const dialog = document.createElement("dialog");
        dialog.style.border = "none";
        dialog.style.borderRadius = "10px";
        dialog.style.padding = "20px";
        dialog.style.maxWidth = "400px";
        dialog.style.width = "90%";
        dialog.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";

        dialog.innerHTML = `
            <h3>CONFIRMAR SALIDA</h3>
            <br>
            <p>¿Seguro que querés marcar tu salida?</p>
            <p style="font-size:13px;color:#666;">Si fue un error, podrás volver a marcar tu entrada.</p>
            <br>
            <div style="display:flex; gap:10px; justify-content:space-around;">
                <button id="confirmSalida" style="margin-top:15px;padding:8px 15px;border:none;border-radius:8px;background:#22C55E;color:white;cursor:pointer;font-weight:bold;">Sí, marcar salida</button>
                <button id="cancelSalida" style="margin-top:15px;padding:8px 15px;border:none;border-radius:8px;background:crimson;color:white;cursor:pointer;font-weight:bold;">Cancelar</button>
            </div>
        `;

        document.body.appendChild(dialog);
        dialog.showModal();

        dialog.querySelector("#confirmSalida").onclick = () => {
            finalizar(true);
            dialog.close();
        };
        dialog.querySelector("#cancelSalida").onclick = () => {
            finalizar(false);
            dialog.close();
        };

        dialog.addEventListener("close", () => {
            finalizar(false);
            dialog.remove();
        });
    });
}

export async function marcarSalida() {
    const token = localStorage.getItem("token");
    
    if (!token) {
        alert("No hay sesión activa");
        return;
    }
    
    const salidaMarcadaHoy = localStorage.getItem("salidaMarcada");
    const hoy = new Date().toDateString();
    if (salidaMarcadaHoy === hoy) {
        alert("Ya marcaste tu salida hoy");
        return;
    }

    const confirmado = await confirmarSalida();
    if (!confirmado) {
        return;
    }
    
    const hora = obtenerHoraParaguay();
    const horaEncoded = encodeURIComponent(hora);
    
    fetch(`${API_BASE_URL}/conexiones/salida/${horaEncoded}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al registrar la salida');
        }
        return response.json();
    })
    .then(data => {
        console.log('Salida registrada:', data);
        localStorage.setItem("salidaMarcada", hoy);
        localStorage.removeItem("entradaMarcada");
        alert(`Salida registrada a las ${hora.split(' ')[1]}`);
    })
    .catch(error => {
        console.error('Error al marcar salida:', error);
        alert("Error al marcar la salida");
    });
}

export function cerrarSesion() {
    const token = localStorage.getItem("token");
    
    if (!token) {
        window.location.href = "login.html";
        return;
    }
    
    const hora = obtenerHoraParaguay();
    const horaEncoded = encodeURIComponent(hora);

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
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        localStorage.removeItem("id_usuario");
        localStorage.removeItem("nombre_usuario");
        localStorage.removeItem('entradaMarcada');
        localStorage.removeItem('salidaMarcada');

        window.location.href = "login.html";
    });
}