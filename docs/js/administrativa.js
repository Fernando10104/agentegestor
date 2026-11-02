import { API_BASE_URL } from './config.js';
import { verificarToken } from "./componentes/verificarToken.js";
import { cerrarSesion, marcarSalida } from "./componentes/cerrarSesion.js";
import { actualizarFechaHoraParaguay } from "./componentes/Fechahora.js";
import { mostrarConfiguracion,showDialog } from "./componentes/modales.js";
import { mostrarGestionUsuario } from "./com_administrativa/usuario.js";
import { mostrarModalCrearUsuario, cerrarModalCrearUsuario, cerrarModalEditarUsuario } from "./com_administrativa/modales_admin.js";
import { mostrarGestionMetas } from "./com_administrativa/metas.js";
import { mascaraFecha, fechaValida, primerDiaMesFormateado, hoyFormateado } from "./componentes/mascaraFecha.js";
import { mostrarAsistenciasGlobales } from "./com_administrativa/asistencias_global.js";
import { marcarEntrada, verificarEntradaAlIniciarSesion } from "./componentes/marcarEntrada.js";
window.mascaraFecha = mascaraFecha;

window.mostrarGestionUsuario = mostrarGestionUsuario;
window.mostrarGestionMetas = mostrarGestionMetas;
window.mostrarAsistenciasGlobales = mostrarAsistenciasGlobales;

window.cerrarSesion = cerrarSesion;
window.marcarSalida = marcarSalida;
window.marcarEntrada = marcarEntrada;
window.svg_importar = null;

window.mostrarModalCrearUsuario = mostrarModalCrearUsuario;
window.cerrarModalCrearUsuario = cerrarModalCrearUsuario;
window.cerrarModalEditarUsuario = cerrarModalEditarUsuario;

window.showDialog = showDialog;

document.getElementById('usuario-icono').addEventListener('click', () => {
  mostrarConfiguracion();
});

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login.html";
  } else {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.rol === "admin") {
        window.location.href = "/admin.html";
      } else if (payload.rol === "gerente") {
        window.location.href = "/gerente.html";
      } else if (payload.rol === "supervisor") {
        window.location.href = "/supervisores.html";
      } else if (payload.rol === "asesor") {
        window.location.href = "/index.html";
      } else if (payload.rol !== "administrativa") {
        window.location.href = "/login.html";
      }
    } catch (e) {
      console.error("Token inválido", e);
      window.location.href = "/login.html";
    }
  }
});

window.mostrarInicio = function () {
  const contenedor = document.getElementById('contenido');
  if (contenedor) {
    contenedor.innerHTML = '';
  }
  document.getElementById('contenido').innerHTML = `
    <div class="header">
        <h1>Bienvenido al panel de administrativa</h1>
        <h4>Gestión de usuarios, metas y asistencias.</h4>
    </div>
    `;
};

actualizarFechaHoraParaguay();
verificarToken();

document.addEventListener('DOMContentLoaded', async () => {
  await verificarToken();
  await mostrarInicio();
  verificarEntradaAlIniciarSesion();
});

const botones = document.querySelectorAll('.nav-btn');

botones.forEach(boton => {
  boton.addEventListener('click', () => {
    botones.forEach(b => b.classList.remove('active'));
    boton.classList.add('active');
  });
});

document.getElementById('toggle-sidebar').addEventListener('click', function() {
    const svgIcon = document.querySelector('#toggle-sidebar svg');
    if (svgIcon) {
        svgIcon.style.transform = svgIcon.style.transform === 'rotate(180deg)' ? 'rotate(0deg)' : 'rotate(180deg)';
        svgIcon.style.transition = 'transform 0.3s';
    }
    const sidebar = document.querySelector('.sidebar-menu');
    sidebar.classList.toggle('sidebar-collapsed');
});
