// inicio dela pagina de asesores y supervisores.
import { API_BASE_URL } from './config.js';
import {SVG_EDITAR,SVG_ELIMINAR} from "../src/svg/svg.js";
//../js_empleados/
import { mostrarInicio } from "../js_empleados/asesores/inicio/inicio.js";
import { mostrarHistorial } from "../js_empleados/asesores/historial/historial.js";
import { mostrarCreditos } from "../js_empleados/asesores/operaciones/operaciones.js";
import { mostrarComisiones } from "../js_empleados/asesores/comisiones/comisiones.js";
import { verificarToken } from "./componentes/verificarToken.js";
import {cerrarSesion} from "./componentes/cerrarSesion.js";
import {actualizarFechaHoraParaguay} from "./componentes/Fechahora.js";
import {mostrarDashboardIngresos} from "../js_empleados/asesores/administracion/administracion.js"
import 
{
 mostrarConfiguracion,
    cerrarModificarHistorial,
    cerrarEliminarHistorial,
    cerrarModificarCliente,
    cerrarEliminarCliente,
    cerrarEditarComisiones,
    cerrarEliminarComisiones,
    showDialog
} from "./componentes/modales.js";

window.SVG_ELIMINAR = SVG_ELIMINAR;
window.SVG_EDITAR = SVG_EDITAR;

//window.mostrarConfiguracion = mostrarConfiguracion;
window.cerrarModificarCliente = cerrarModificarCliente;
window.cerrarEliminarHistorial = cerrarEliminarHistorial;
window.cerrarModificarHistorial = cerrarModificarHistorial;
window.cerrarEliminarCliente = cerrarEliminarCliente;
window.cerrarEditarComisiones = cerrarEditarComisiones;
window.cerrarEliminarComisiones = cerrarEliminarComisiones;

window.mostrarInicio = mostrarInicio;
window.mostrarHistorial = mostrarHistorial;
window.mostrarCreditos = mostrarCreditos;
window.mostrarComisiones = mostrarComisiones;
window.cerrarSesion = cerrarSesion;
window.showDialog = showDialog;

window.API_BASE_URL = API_BASE_URL;
// Mostramos la vista inicial por defecto
document.getElementById('usuario-icono').addEventListener('click', () => {
    mostrarConfiguracion();
});


actualizarFechaHoraParaguay(); // Actualizamos la fecha y hora al cargar la página
verificarToken(); // Verificamos el token al cargar la página




// ✅ CARGAR USUARIOS AL INICIAR LA PÁGINA
document.addEventListener('DOMContentLoaded', async () => {
    await mostrarInicio(); // Mostrar la pantalla de inicio al cargar la página
    verificarRolYMostrarAdmin(); // Verificar rol y mostrar botón admin si corresponde
});

const botones = document.querySelectorAll('.nav-btn');

    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            // Quitar clase activa de todos
            botones.forEach(b => b.classList.remove('active'));
            // Activar el que fue clickeado
            boton.classList.add('active');
        });
    });

// Función para enviar un heartbeat al servidor

function enviarHeartbeat() {
  const token = localStorage.getItem("token"); // o donde guardes el token

  fetch(`${API_BASE_URL}/heartbeat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    }
  }).then(res => {
    if (!res.ok) {
      console.error("Error en heartbeat", res.status);
    }
  }).catch(err => console.error("Error enviando heartbeat", err));
}

// Enviar heartbeat cada 60 segundos
setInterval(enviarHeartbeat, 60000);

// Opcional: enviar heartbeat inmediatamente al cargar la app
enviarHeartbeat();

function marcarEntrada() {
    const fechaHoy = new Date().toDateString(); // "Wed Jan 09 2025"
    const entradaHoy = localStorage.getItem('entradaMarcada');
    
    // Verificar si ya se marcó entrada hoy
    if (entradaHoy === fechaHoy) {
        console.log("Entrada ya marcada hoy");
        showDialog("success", "Ya has marcado tu entrada hoy");
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
            // Guardar la fecha de hoy en localStorage
            localStorage.setItem('entradaMarcada', fechaHoy);
        }
    }).catch(err => console.error("Error enviando marcar entrada", err));
}

window.marcarEntrada = marcarEntrada;

function verificarEntradaAlIniciarSesion() {
    const fechaHoy = new Date().toDateString(); // Fecha actual formateada
    const entradaHoy = localStorage.getItem('entradaMarcada');

    // Si ya marcó entrada hoy, no hace nada
    if (entradaHoy === fechaHoy) {
        console.log("Entrada ya marcada hoy, no se solicita.");
        return;
    }

    // Preguntar si quiere marcar entrada
    // Modal personalizado con confirmación/cancelación
    const dialog = document.createElement("dialog");
    dialog.style.border = "none";
    dialog.style.borderRadius = "10px";
    dialog.style.padding = "20px";
    dialog.style.maxWidth = "400px";
    dialog.style.width = "90%";
    dialog.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";

    dialog.innerHTML = `
        <h3>ℹ️ INFO</h3>
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

// Llamar esta función justo después de iniciar sesión correctamente
// Ejemplo: después de recibir el token en el login

if (localStorage.getItem("token")) {
    verificarEntradaAlIniciarSesion();
}

// Función para mostrar/ocultar el botón admin según el rol
function verificarRolYMostrarAdmin() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        // Decodificar el token JWT para obtener el rol
        const payload = JSON.parse(atob(token.split('.')[1]));
        const rol = payload.rol;
        
        const btnAdmin = document.getElementById('btn-admin');
        if (rol === 'supervisor') {
            btnAdmin.style.display = 'flex';
        } else {
            btnAdmin.style.display = 'none';
        }
    } catch (error) {
        console.error("Error al verificar rol:", error);
    }
}

// Función para mostrar el panel de administración (crear según necesidades)
function mostrarAdmin() {
    // Aquí puedes cargar el módulo de administración
    console.log("Cargando panel de administración...");
    // Ejemplo: import("../admin/admin.js").then(module => module.mostrarAdmin());
    mostrarDashboardIngresos()
}
window.mostrarDashboardIngresos = mostrarDashboardIngresos;
window.mostrarAdmin = mostrarAdmin;

document.getElementById('toggle-sidebar').addEventListener('click', function() {
    const svgIcon = document.querySelector('#toggle-sidebar svg');
    if (svgIcon) {
        svgIcon.style.transform = svgIcon.style.transform === 'rotate(180deg)' ? 'rotate(0deg)' : 'rotate(180deg)';
        svgIcon.style.transition = 'transform 0.3s';
    }
    const sidebar = document.querySelector('.sidebar-menu');
    sidebar.classList.toggle('sidebar-collapsed');
});