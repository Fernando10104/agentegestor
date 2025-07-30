export function cargarClientes(campo = "nombre", valor = "", page = 1, limit = 10) {
  const url = new URL('https:///word.puntodigitalpy.online/clientes');

  // Agregamos parámetros query
  url.searchParams.append("page", page);
  url.searchParams.append("limit", limit);
  url.searchParams.append("campo", campo);

  if (valor) {
    // Como tu backend solo filtra por "nombre" en este ejemplo, enviamos search
    url.searchParams.append("search", valor);
  }

  const token = localStorage.getItem("token"); // o donde guardes el token

  fetch(url, {
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Error en la respuesta de la API");
      }
      return res.json();
    })
    .then(data => {
      const clientes = data.clientes ?? [];
      const tbody = document.getElementById('tbody-clientes');
      if (!clientes.length) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;">Sin datos</td></tr>`;
        return;
      }
      tbody.innerHTML = clientes.map(cliente => `
        <tr>
          <td>${cliente.id_cliente ?? ''}</td>
          <td>${cliente.nombre ?? ''}</td>
          <td>${cliente.documento ?? ''}</td>
          <td>${cliente.contacto ?? ''}</td>
          <td>${cliente.direccion ?? ''}</td>
          <td>${cliente.correo ?? ''}</td>
          <td>${cliente.faja_inforcomf ?? ''}</td>
          <td>${cliente.estado_cred ?? ''}</td>
          <td>${cliente.e_registro ?? ''}</td>
          <td>${(cliente.fecha_registro ?? '').split('T')[0]}</td>
        </tr>
      `).join('');

      // Aquí podrías actualizar un contador de páginas o algo más si quieres
    })
    .catch(err => {
      const tbody = document.getElementById('tbody-clientes');
      tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;color:red;">Error al cargar datos</td></tr>`;
      console.error(err);
    });
}
