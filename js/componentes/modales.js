export function mostrarCargarCredito() {
  const contenedor = document.getElementById('cargar-credito');
  const cliente = document.getElementById('cargar-cliente');
  if (cliente) cliente.style.display = 'none';
  if (contenedor) contenedor.style.display = 'block';

}

export function ocultarCargarCredito() {
  const contenedor = document.getElementById('cargar-credito');
  if (contenedor) contenedor.style.display = 'none';
}

export function mostrarCargarCliente() {
  const contenedor = document.getElementById('cargar-cliente');
  const credito = document.getElementById('cargar-credito');
  if (credito) credito.style.display = 'none';
  if (contenedor) contenedor.style.display = 'block';
}

export function ocultarCargarCliente() {
  const contenedor = document.getElementById('cargar-cliente');
  if (contenedor) contenedor.style.display = 'none';
}


export function mostrarConfiguracion() {
  const configuracion = document.getElementById('opciones_usuario');
  if (configuracion) {
    configuracion.style.display = configuracion.style.display === 'flex' ? 'none' : 'flex';
  }
}

export function cerrarModificarHistorial() {
  const modal = document.getElementById('modal-editar-historial');
  if (modal) {
    modal.style.display = 'none';
  }

}


export function cerrarEliminarHistorial() {
  const modal = document.getElementById('modal-eliminar-historial');

  if (modal) {
    modal.style.display = 'none';
  }
}

export function cerrarModificarCliente() {
  const modal = document.getElementById('modal-editar-clientes');
  if (modal) {
    modal.style.display = 'none';
  }
}

export function cerrarEliminarCliente() {
  const modal = document.getElementById('modal-eliminar-cliente');
  if (modal) {
    modal.style.display = 'none';
  }
}

export function cerrarEditarComisiones() {
  const modal = document.getElementById('modal-editar-comision');
  if (modal) {
    modal.style.display = 'none';
  }
}
export function cerrarEliminarComisiones() {
  const modal = document.getElementById('modal-eliminar-comision');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Función genérica para abrir el diálogo
export function showDialog(type, message) {
  // Crear el dialog
  const dialog = document.createElement("dialog");
  dialog.style.border = "none";
  dialog.style.borderRadius = "10px";
  dialog.style.padding = "20px";
  dialog.style.maxWidth = "400px";
  dialog.style.width = "90%";
  dialog.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";

  // Definir título según tipo
  let titleText = "ℹ️ INFO";
  if (type === "error") titleText = "❌ ERROR";
  if (type === "exito" || type === "success") titleText = "✅ ÉXITO";

  // Insertar contenido del diálogo
    dialog.innerHTML = `
  <h3>${titleText}</h3>
  <br>
  <p>${message}</p>
  <form method="dialog">
  <br>
  <button id="closeDialog">Cerrar</button>
  </form>
  `;

  // Insertar en el body
  document.body.appendChild(dialog);

  // Abrir modal
  dialog.showModal();

  // Cuando se cierra, eliminarlo del DOM
  dialog.addEventListener("close", () => {
    dialog.remove();
  });
}
