export function mostrarConfiguracion() {
  document.getElementById('contenido').innerHTML = `
    <h1>Configuración</h1>
    <label>Tema: 
      <select>
        <option>Claro</option>
        <option>Oscuro</option>
      </select>
    </label>
  `;
}
