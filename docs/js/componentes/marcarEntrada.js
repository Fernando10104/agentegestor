import { API_BASE_URL } from '../config.js';

export function marcarEntrada() {
    const fechaHoy = new Date().toDateString(); // "Wed Jan 09 2025"
    const entradaHoy = localStorage.getItem('entradaMarcada');

    // Verificar si ya se marcó entrada hoy
    if (entradaHoy === fechaHoy) {
        console.log("Entrada ya marcada hoy");
        if (typeof showDialog === 'function') {
            showDialog("success", "Ya has marcado tu entrada hoy");
        }
        return;
    }

    const token = localStorage.getItem("token");
    const ahoraParaguay = new Date();

    const año = ahoraParaguay.getFullYear();
    const mes = String(ahoraParaguay.getMonth() + 1).padStart(2, '0');
    const dia = String(ahoraParaguay.getDate()).padStart(2, '0');
    const horas = String(ahoraParaguay.getHours()).padStart(2, '0');
    const minutos = String(ahoraParaguay.getMinutes()).padStart(2, '0');
    const segundos = String(ahoraParaguay.getSeconds()).padStart(2, '0');

    const hora = `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
    const horaEncoded = encodeURIComponent(hora);

    fetch(`${API_BASE_URL}/conexiones/entrada/${horaEncoded}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    }).then(res => {
        if (!res.ok) {
            console.error("Error al marcar entrada", res.status);
        } else {
            console.log("Entrada marcada exitosamente");
            localStorage.setItem('entradaMarcada', fechaHoy);
            localStorage.removeItem('salidaMarcada');
        }
    }).catch(err => console.error("Error enviando marcar entrada", err));
}

export function verificarEntradaAlIniciarSesion() {
    const fechaHoy = new Date().toDateString();
    const entradaHoy = localStorage.getItem('entradaMarcada');

    if (entradaHoy === fechaHoy) {
        console.log("Entrada ya marcada hoy, no se solicita.");
        return;
    }

    const dialog = document.createElement("dialog");
    dialog.style.border = "none";
    dialog.style.borderRadius = "10px";
    dialog.style.padding = "20px";
    dialog.style.maxWidth = "400px";
    dialog.style.width = "90%";
    dialog.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";

    dialog.innerHTML = `
        <h3>INFO</h3>
        <br>
        <p>No tienes entrada marcada hoy. ¿Quieres marcarla ahora?</p>
        <br>
        <div style="display:flex; gap:10px; justify-content:space-around;">
            <button id="confirmEntrada" style="margin-top:15px;padding:8px 15px;border:none;border-radius:8px;background:#22C55E;color:white;cursor:pointer;font-weight:bold;">Marcar entrada</button>
            <button id="cancelEntrada" style="margin-top:15px;padding:8px 15px;border:none;border-radius:8px;background:crimson;color:white;cursor:pointer;font-weight:bold;">Cancelar</button>
        </div>
    `;

    document.body.appendChild(dialog);
    dialog.showModal();

    dialog.querySelector("#confirmEntrada").onclick = () => {
        marcarEntrada();
        dialog.close();
    };
    dialog.querySelector("#cancelEntrada").onclick = () => {
        dialog.close();
    };

    dialog.addEventListener("close", () => {
        dialog.remove();
    });
}
