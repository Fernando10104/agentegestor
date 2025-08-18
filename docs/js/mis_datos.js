import {mostrarConfiguracion} from "./componentes/modales.js";
import { verificarToken } from "./componentes/verificarToken.js";
import { cerrarSesion } from "./componentes/cerrarSesion.js";
import { API_BASE_URL } from "./config.js";




// funciones globales.
window.mostrarConfiguracion = mostrarConfiguracion;
window.verificarToken = verificarToken;
window.cerrarSesion = cerrarSesion;

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


