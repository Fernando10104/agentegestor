import { API_BASE_URL } from './config.js';
import { verificarToken } from "./componentes/verificarToken.js";
import { cerrarSesion } from "./componentes/cerrarSesion.js";
import { actualizarFechaHoraParaguay } from "./componentes/Fechahora.js";
import { mostrarConfiguracion } from "./componentes/modales.js";
import { mostrarGestionUsuario } from "./com_admin/usuario.js";
import { mostrarModalCrearUsuario, cerrarModalCrearUsuario,cerrarModalEditarUsuario } from "./com_admin/modales_admin.js";

// Funciones globales
window.mostrarGestionUsuario = mostrarGestionUsuario;

window.cerrarsesion = cerrarSesion;
window.API_BASE_URL = API_BASE_URL;
window.cerrarModalCrearUsuario = cerrarModalCrearUsuario;
window.mostrarModalCrearUsuario = mostrarModalCrearUsuario;
window.cerrarModalEditarUsuario = cerrarModalEditarUsuario;

// Event listeners
document.getElementById('usuario-icono').addEventListener('click', () => {
    mostrarConfiguracion();
});

// ✅ AGREGAR FUNCIÓN PARA EL BOTÓN "mostrarInicio"
window.mostrarInicio = function() {
    mostrarGestionUsuario();
};

// Inicialización
actualizarFechaHoraParaguay();
verificarToken();

// ✅ CARGAR USUARIOS AL INICIAR LA PÁGINA
document.addEventListener('DOMContentLoaded', () => {
    mostrarGestionUsuario();
});