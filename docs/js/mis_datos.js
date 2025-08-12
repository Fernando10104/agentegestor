import {mostrarConfiguracion} from "./componentes/modales.js";






// funciones globales.
window.mostrarConfiguracion = mostrarConfiguracion;



document.getElementById('usuario-icono').addEventListener('click', () => {
    mostrarConfiguracion();
});

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
    preview.style.display = 'block';
    const file = inputFile.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => preview.src = e.target.result;
      reader.readAsDataURL(file);
    }
  })
