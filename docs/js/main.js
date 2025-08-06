import { API_BASE_URL } from './config.js';
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
    cerrarEliminarComisiones
} from "./componentes/modales.js";


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
window.cerrarsesion = cerrarSesion;

window.API_BASE_URL = API_BASE_URL;
// Mostramos la vista inicial por defecto
document.getElementById('usuario-icono').addEventListener('click', () => {
    mostrarConfiguracion();
});



actualizarFechaHoraParaguay(); // Actualizamos la fecha y hora al cargar la página
verificarToken(); // Verificamos el token al cargar la página
mostrarInicio();
