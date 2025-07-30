export function mostrarCargarCredito() {
  const contenedor = document.getElementById('cargar-credito');
  if (contenedor) contenedor.style.display = 'block';
}

export function ocultarCargarCredito() {
  const contenedor = document.getElementById('cargar-credito');
  if (contenedor) contenedor.style.display = 'none';
}

export function mostrarCargarCliente() {
  const contenedor = document.getElementById('cargar-cliente');
  if (contenedor) contenedor.style.display = 'block';
}

export function ocultarCargarCliente() {
  const contenedor = document.getElementById('cargar-cliente');
  if (contenedor) contenedor.style.display = 'none';
}
