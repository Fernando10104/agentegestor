import { API_BASE_URL } from './config.js';
import {SVG_EDITAR,SVG_ELIMINAR} from "../src/svg/svg.js";

import { mostrarInicio } from "./componentes/inicio.js";
import { mostrarHistorial } from "./componentes/historial.js";
import { mostrarCreditos } from "./componentes/operaciones.js";
import { mostrarComisiones } from "./componentes/comisiones.js";
import { verificarToken } from "./componentes/verificarToken.js";
import {cerrarSesion} from "./componentes/cerrarSesion.js";
//import { mostrarConfiguracion } from "./componentes/configuracion.js"; 
import {actualizarFechaHoraParaguay} from "./componentes/Fechahora.js";
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
        alert("Ya has marcado tu entrada hoy");
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
    if (confirm("No tienes entrada marcada hoy. ¿Quieres marcarla ahora?")) {
        marcarEntrada();
    }
}

// Llamar esta función justo después de iniciar sesión correctamente
// Ejemplo: después de recibir el token en el login

if (localStorage.getItem("token")) {
    verificarEntradaAlIniciarSesion();
}