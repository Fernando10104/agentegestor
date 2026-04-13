import { API_BASE_URL } from '../../js/config.js';

export function mostrarMenuBackup() {
  document.getElementById('contenido').innerHTML = `
    <div class="menu-metas" style="display: flex; gap: 20px;">
      <div class="contenedor-metas">
        <div class="header">
          <h1>Gestión de Backup</h1>
        </div>
        <div class="table-responsive table-responsive-hijo" style="margin-bottom: 20px;">
          <table>
            <tbody>
              <tr>
                <td>
                  <div class="backup-info" style="margin-bottom: 20px;">
                    <p>Presiona el botón para descargar el backup de la base de datos.</p>
                  </div>
                  <div class="footer-buttons" style="display: flex; gap: 10px;">
                    <button id="btn-hacer-backup" class="export-excel">Hacer Backup</button>
                    <button class="cancel-btn" id="btn-cerrar-backup">Cancelar</button>
                  </div>
                  <div id="backup-status" style="margin-top: 15px; color: #2e7d32;"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-hacer-backup').onclick = hacerBackup;
  document.getElementById('btn-cerrar-backup').onclick = cerrarMenuBackup;
}

export function hacerBackup() {
  const token = localStorage.getItem("token");
  const status = document.getElementById('backup-status');
  status.textContent = "Generando backup, por favor espere...";
  fetch(`${API_BASE_URL}/backup`, {
    method: 'GET',
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al generar el backup");
      const disposition = res.headers.get('Content-Disposition');
      let filename = 'backup.sql';
      if (disposition && disposition.includes('filename=')) {
        filename = disposition.split('filename=')[1].replace(/"/g, '');
      }
      const fecha = new Date();
      const yyyy = fecha.getFullYear();
      const mm = String(fecha.getMonth() + 1).padStart(2, '0');
      const dd = String(fecha.getDate()).padStart(2, '0');
      const fechaStr = `${yyyy}-${mm}-${dd}`;
      // Insertar la fecha antes de la extensión .sql
      const punto = filename.lastIndexOf('.sql');
      if (punto !== -1) {
        filename = filename.slice(0, punto) + `_${fechaStr}` + filename.slice(punto);
      } else {
        filename = filename + `_${fechaStr}.sql`;
      }
      return res.blob().then(blob => ({ blob, filename }));
    })
    .then(({ blob, filename }) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      status.textContent = "Backup descargado correctamente.";
      status.style.color = "#2e7d32";
    })
    .catch(err => {
      status.textContent = "Error al descargar el backup: " + err.message;
      status.style.color = "red";
    });
}

export function cerrarMenuBackup() {
  document.getElementById('contenido').innerHTML = '';
}

