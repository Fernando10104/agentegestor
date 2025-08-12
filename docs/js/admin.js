import { API_BASE_URL } from './config.js';
import { verificarToken } from "./componentes/verificarToken.js";
import { cerrarSesion } from "./componentes/cerrarSesion.js";
import { actualizarFechaHoraParaguay } from "./componentes/Fechahora.js";
import { mostrarConfiguracion } from "./componentes/modales.js";
import { mostrarGestionUsuario } from "./com_admin/usuario.js";
import { mostrarModalCrearUsuario, cerrarModalCrearUsuario,cerrarModalEditarUsuario,mostrarModalCrearMarca,cerrarModalCrearMarca } from "./com_admin/modales_admin.js";
import { mostrarGestionCategorias} from "./com_admin/categorias.js";
import { mostrarGestionMarcas} from "./com_admin/marcas.js";


// Funciones globales
window.mostrarGestionUsuario = mostrarGestionUsuario;
window.mostrarGestionCategorias = mostrarGestionCategorias;
window.mostrarGestionMarcas = mostrarGestionMarcas;


window.cerrarSesion = cerrarSesion;
window.API_BASE_URL = API_BASE_URL;
window.cerrarModalCrearUsuario = cerrarModalCrearUsuario;
window.mostrarModalCrearUsuario = mostrarModalCrearUsuario;
window.cerrarModalEditarUsuario = cerrarModalEditarUsuario;
window.mostrarModalCrearMarca = mostrarModalCrearMarca;
window.cerrarModalCrearMarca = cerrarModalCrearMarca;

// Event listeners
document.getElementById('usuario-icono').addEventListener('click', () => {
    mostrarConfiguracion();
});

// ✅ AGREGAR FUNCIÓN PARA EL BOTÓN "mostrarInicio"
window.mostrarInicio = function() {
    const contenedor = document.getElementById('contenido');
    if (contenedor) {
        contenedor.innerHTML = '';
    }
    document.getElementById('contenido').innerHTML = `
    <h2>Bienvenido al panel de administración</h2>
    <p>Aquí puedes gestionar usuarios, categorías y marcas.</p>
    <br>
    <div>
        <p>Usuarios conectados:</p>
        <div style= "padding-left: 10px;">
            <ul id="lista-usuarios-conectados"></ul>
        </div>
    </div>
    `;
    obtenerUsuariosConectados();
};

// Inicialización
actualizarFechaHoraParaguay();
verificarToken();

// ✅ CARGAR USUARIOS AL INICIAR LA PÁGINA
document.addEventListener('DOMContentLoaded', () => {
    mostrarInicio(); // Mostrar la pantalla de inicio al cargar la página
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

async function obtenerUsuariosConectados() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}/usuarios/conectados`, {
    headers: { "Authorization": "Bearer " + token }
  });
  if (!res.ok) {
    console.error("Error al obtener usuarios conectados");
    return;
  }
  const usuarios = await res.json();
  console.log("Usuarios conectados:", usuarios);
  // Aquí actualizas la UI con la lista recibida
  const lista = document.getElementById("lista-usuarios-conectados");
  lista.innerHTML = ""; // Limpiar lista existente
  usuarios.forEach(usuario => {
    const item = document.createElement("li");
    item.textContent = `${usuario.nombre}`;
    lista.appendChild(item);
  });
}

// Cada 30 segundos refrescas la lista
setInterval(obtenerUsuariosConectados, 30000);
window.obtenerUsuariosConectados = obtenerUsuariosConectados;

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


