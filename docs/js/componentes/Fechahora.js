export function actualizarFechaHoraParaguay() {
  const fechaParaguayElement = document.getElementById('fecha-hora-paraguay');
  if (!fechaParaguayElement) {
    console.error('Elemento con ID "fecha-hora-paraguay" no encontrado.');
    return;
  }

  // Opciones para formatear la fecha y la hora
  const optionsFecha = {
    weekday: 'long', // Nombre del día de la semana (ej: "lunes")
    year: 'numeric',   // Año (ej: "2025")
    month: 'long',    // Nombre del mes (ej: "julio")
    day: 'numeric'     // Día del mes (ej: "29")
  };

  const optionsHora = {
    hour: '2-digit',   // Hora (ej: "21")
    minute: '2-digit', // Minutos (ej: "35")
    second: '2-digit', // Segundos (ej: "47")
    hour12: false      // Formato de 24 horas
  };

  // Obtener la fecha y hora actual en Paraguay
  const ahoraParaguay = new Date();

  // Formatear la fecha y la hora
  const fechaFormateada = ahoraParaguay.toLocaleDateString('es-PY', optionsFecha);
  const horaFormateada = ahoraParaguay.toLocaleTimeString('es-PY', optionsHora);

  // Mostrar la fecha y la hora en el elemento HTML
  fechaParaguayElement.textContent = ` / ${fechaFormateada} / Hora Actual: ${horaFormateada}`;
}

// Actualizar la fecha y la hora cada segundo
setInterval(actualizarFechaHoraParaguay, 1000);

// Llamar a la función por primera vez para mostrar la fecha y la hora inmediatamente
actualizarFechaHoraParaguay();