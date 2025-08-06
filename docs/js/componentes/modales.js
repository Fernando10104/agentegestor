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
  if (modal){ 
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
