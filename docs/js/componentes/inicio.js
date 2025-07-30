export function mostrarInicio() {
  document.getElementById('contenido').innerHTML = `
    <div class="user-info">
      <div class="user-img">
        <img src="./src/users/user12.webp" alt="">
        <p>super seis</p>
      </div>
      <div class="user-details">
        <h3 class="detail-item">MI GRUPO : ₲ 47.000.000</h3>
        <h3 class="detail-item">CONTACTOS: ₲ 0</h3>
        <h3 class="detail-item">META: ₲ 0</h3>
        <h3 class="detail-item">LOGRADO: ₲ 0</h3>
        <h3 class="detail-item">COMISION : ₲ 1.000.000</h3>
        <button>OPERACIONES</button>
      </div>
    </div>
  `;
}
