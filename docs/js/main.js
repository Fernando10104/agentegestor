import { mostrarInicio } from "./componentes/inicio.js";
import { mostrarHistorial } from "./componentes/historial.js";
import { mostrarCreditos } from "./componentes/creditos.js";
import { mostrarComisiones } from "./componentes/comisiones.js";
import { verificarToken } from "./componentes/verificarToken.js";
import {cerrarSesion} from "./componentes/cerrarSesion.js";
import { mostrarConfiguracion } from "./componentes/configuracion.js";



window.mostrarInicio = mostrarInicio;
window.mostrarHistorial = mostrarHistorial;
window.mostrarCreditos = mostrarCreditos;
window.mostrarComisiones = mostrarComisiones;
window.cerrarsesion = cerrarSesion;
// Mostramos la vista inicial por defecto
verificarToken(); // Verificamos el token al cargar la página
mostrarInicio();
