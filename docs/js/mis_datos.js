import {mostrarConfiguracion} from "./componentes/modales.js";
import { verificarToken } from "./componentes/verificarToken.js";
import { cerrarSesion } from "./componentes/cerrarSesion.js";
import { API_BASE_URL } from "./config.js";




// funciones globales.
window.mostrarConfiguracion = mostrarConfiguracion;
window.verificarToken = verificarToken;
window.cerrarSesion = cerrarSesion;
window.mostrarModalCambiarContrasena = mostrarModalCambiarContrasena;
window.cerrarModalCambiarContrasena = cerrarModalCambiarContrasena;
window.cambiarContrasena = cambiarContrasena;

document.getElementById('usuario-icono').addEventListener('click', () => {
    mostrarConfiguracion();
});
const id_usuario = localStorage.getItem('id_usuario'); // 12
const usuarioNombre = localStorage.getItem('nombre_usuario');
if (usuarioNombre) {
    const usuarioNombreElement = document.getElementById('usuario-nombre');
    const usuarioNombre2 = usuarioNombre.toUpperCase();
    usuarioNombreElement.textContent = usuarioNombre2;
}

//------------input oculto 
const inputFile = document.getElementById('avatar-upload');
  const preview = document.getElementById('preview');
  

  inputFile.addEventListener('change', () => {
    preview.style.display = 'flex'; // Usa flex para centrar los elementos
    const file = inputFile.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            document.getElementById('preview-img').src = e.target.result; // Carga la imagen en el preview-img
        };
        reader.readAsDataURL(file);
    }
});


document.getElementById('btn-cancelar-foto').addEventListener('click', () => {
  preview.style.display = 'none';
  document.getElementById('preview-img').src = '';
  inputFile.value = '';
});


document.getElementById('btn-confirmar-foto').addEventListener('click', () => {
  const file = inputFile.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  fetch(`${API_BASE_URL}/upload-profile/${id_usuario}`, {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.url) {
      console.log('Foto de perfil actualizada:', data.url);
      const avatar = document.getElementById('usuario-avatar');
      if (avatar) {
        avatar.src = data.url;
      }
      preview.style.display = 'none';
      document.getElementById('preview-img').src = '';
      inputFile.value = '';
      localStorage.setItem('url_imagen', data.url);
    } else {
      alert('Error al actualizar la foto');
    }
    location.reload();
  })
  .catch(() => {
    // Oculta el modal y limpia los campos aunque haya error
    preview.style.display = 'none';
    document.getElementById('preview-img').src = '';
    inputFile.value = '';
    alert('Error de conexión');
  });
});

async function cargarMisDatos() {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${API_BASE_URL}/mis-datos`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al cargar los datos del usuario');
        }

        const data = await response.json();
        console.log('Datos del usuario:', data);
        
        // Actualizar los elementos HTML con los datos recibidos
        actualizarDatosEnHTML(data.usuario);
        
    } catch (error) {
        console.error('Error al cargar mis datos:', error);
        
        // Opcional: mostrar mensaje de error al usuario
    }
}

function actualizarDatosEnHTML(datos) {
    // Actualizar por IDs únicos
    const nombreElement = document.getElementById('nombre-completo');
    const nombreElement2 = document.getElementById('nombre-completo2');
    const cedulaElement = document.getElementById('cedula');
    const correoElement = document.getElementById('correo');
    const telefonoElement = document.getElementById('telefono');
    const rolElement = document.getElementById('rol');

    if (nombreElement) nombreElement.textContent = datos.nombre || 'Sin nombre';
    if (nombreElement2) nombreElement2.textContent = datos.nombre || 'Sin nombre';
    if (cedulaElement) cedulaElement.textContent = datos.usuario || 'Sin cédula';
    if (correoElement) correoElement.textContent = datos.correo || 'Sin correo';
    if (telefonoElement) telefonoElement.textContent = datos.telefono || 'Sin teléfono';
    if (rolElement) rolElement.textContent = datos.rol || 'Sin rol';
}

// Llamar la función cuando se carga la página
document.addEventListener('DOMContentLoaded', cargarMisDatos);

export function mostrarModalCambiarContrasena() {
    const modaldiv = document.getElementById("contenedor-3");
    modaldiv.innerHTML = "";
    modaldiv.style.display = "block";
    const modalContent = `
        <div class="modal-header">
            <h2 class="modal-title">Cambiar Contraseña</h2>
        </div>

        <div class="modal-body">
            <form class="modal-form" id="cambiar-contrasena-form">
                <div class="form-group">
                    <label for="password_actual">Contraseña actual</label>
                    <input 
                        type="password" 
                        class="form-control" 
                        id="password_actual" 
                        required
                    >
                </div>

                <div class="form-group">
                    <label for="password_nueva">Nueva contraseña</label>
                    <input 
                        type="password" 
                        class="form-control" 
                        id="password_nueva" 
                        required
                    >
                </div>

                <div class="form-group">
                    <label for="password_confirmar">Confirmar nueva contraseña</label>
                    <input 
                        type="password" 
                        class="form-control" 
                        id="password_confirmar" 
                        required
                    >
                </div>
            </form>
        </div>

        <div class="modal-footer">
            <button type="button" class="cancel-btn" data-dismiss="modal" style="background-color: red;" onclick="cerrarModalCambiarContrasena()">
                Cancelar
            </button>
            <button type="button" class="create-btn"  onclick="cambiarContrasena()">
                Guardar cambios
            </button>
        </div>
    `;

    document.getElementById("contenedor-3").innerHTML = modalContent;
    
}

export function cerrarModalCambiarContrasena() {
    const modaldiv = document.getElementById("contenedor-3");
    modaldiv.style.display = "none";
    modaldiv.innerHTML = "";
}
export async function cambiarContrasena() {
    const password_actual = document.getElementById('password_actual').value;
    const password_nueva = document.getElementById('password_nueva').value;
    const password_confirmar = document.getElementById('password_confirmar').value;

    if (password_nueva !== password_confirmar) {
        alert('La nueva contraseña y la confirmación no coinciden.');
        return;
    }
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE_URL}/cambiar-contrasena`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password_actual,
                password_nueva
            })
        }); 
        if (!response.ok) {
            throw new Error('Error al cambiar la contraseña');
        }
        const data = await response.json();
        alert(data.message || 'Contraseña cambiada exitosamente.');
        cerrarModalCambiarContrasena();
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        alert('Error al cambiar la contraseña. Por favor, inténtalo de nuevo.');
    }
}