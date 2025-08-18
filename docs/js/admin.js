import { API_BASE_URL } from './config.js';
import { verificarToken } from "./componentes/verificarToken.js";
import { cerrarSesion } from "./componentes/cerrarSesion.js";
import { actualizarFechaHoraParaguay } from "./componentes/Fechahora.js";
import { mostrarConfiguracion } from "./componentes/modales.js";
import { mostrarGestionUsuario } from "./com_admin/usuario.js";
import { mostrarModalCrearUsuario, cerrarModalCrearUsuario,cerrarModalEditarUsuario,mostrarModalCrearMarca,cerrarModalCrearMarca } from "./com_admin/modales_admin.js";
import { mostrarGestionCategorias} from "./com_admin/categorias.js";
import { mostrarGestionMarcas} from "./com_admin/marcas.js";

import {mostrarGestionMetas} from  "./com_admin/metas.js";

// Funciones globales
window.mostrarGestionUsuario = mostrarGestionUsuario;
window.mostrarGestionCategorias = mostrarGestionCategorias;
window.mostrarGestionMarcas = mostrarGestionMarcas;
window.mostrarGestionMetas = mostrarGestionMetas;


window.cerrarSesion = cerrarSesion;
window.API_BASE_URL = API_BASE_URL;
window.cerrarModalCrearUsuario = cerrarModalCrearUsuario;
window.mostrarModalCrearUsuario = mostrarModalCrearUsuario;
window.cerrarModalEditarUsuario = cerrarModalEditarUsuario;
window.mostrarModalCrearMarca = mostrarModalCrearMarca;
window.cerrarModalCrearMarca = cerrarModalCrearMarca;

// Event listeners
document.getElementById('usuario-icono').addEventListener('click', () => {
    mostrarConfiguracion();
});

// ✅ AGREGAR FUNCIÓN PARA EL BOTÓN "mostrarInicio"
window.mostrarInicio = function() {
    const contenedor = document.getElementById('contenido');
    if (contenedor) {
        contenedor.innerHTML = '';
    }
    document.getElementById('contenido').innerHTML = `
    <div class="header">
        <h1>Bienvenido al panel de administración</h1>
        <h4>Aquí puedes gestionar usuarios, categorías y marcas.</h4>
        <br>
        <div class="usuarios-conectados">
            <p class="usuarios-conectados-titulo">Usuarios conectados:</p>
            <ul id="lista-usuarios-conectados" class="lista-usuarios"></ul>
        </div>
    </div>
    `;
    obtenerUsuariosConectados();
    mostrarDashboardIngresos()
};

// Inicialización
actualizarFechaHoraParaguay();
verificarToken();

// ✅ CARGAR USUARIOS AL INICIAR LA PÁGINA
document.addEventListener('DOMContentLoaded', () => {
    mostrarInicio(); // Mostrar la pantalla de inicio al cargar la página
});

const botones = document.querySelectorAll('.nav-btn');

    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            // Quitar clase activa de todos
            botones.forEach(b => b.classList.remove('active'));
            // Activar el que fue clickeado
            boton.classList.add('active');
        });
    });

async function obtenerUsuariosConectados() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}/usuarios/conectados`, {
    headers: { "Authorization": "Bearer " + token }
  });
  if (!res.ok) {
    console.error("Error al obtener usuarios conectados");
    return;
  }
  const usuarios = await res.json();
  console.log("Usuarios conectados:", usuarios);
  
  const lista = document.getElementById("lista-usuarios-conectados");
  if (!lista) return;
  
  lista.innerHTML = "";
  
  if (usuarios.length === 0) {
    lista.classList.add('vacia');
  } else {
    lista.classList.remove('vacia');
    usuarios.forEach(usuario => {
      const item = document.createElement("li");
      item.textContent = `${usuario.nombre}`;
      lista.appendChild(item);
    });
  }
}

// Cada 30 segundos refrescas la lista
setInterval(obtenerUsuariosConectados, 30000);
window.obtenerUsuariosConectados = obtenerUsuariosConectados;

function enviarHeartbeat() {
  const token = localStorage.getItem("token"); // o donde guardes el token

  fetch(`${API_BASE_URL}/heartbeat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    }
  }).then(res => {
    if (!res.ok) {
      console.error("Error en heartbeat", res.status);
    }
  }).catch(err => console.error("Error enviando heartbeat", err));
}

// Enviar heartbeat cada 60 segundos
setInterval(enviarHeartbeat, 60000);

// Opcional: enviar heartbeat inmediatamente al cargar la app
enviarHeartbeat();

export function mostrarDashboardIngresos(){
  const contenedor = document.getElementById('contenido');
  
  // ✅ Verificar si ya existe el dashboard para no duplicarlo
  if (document.getElementById('dashboard-container')) {
    return; // Si ya existe, no hacer nada
  }
  
  // ✅ Crear el HTML del dashboard sin reemplazar el contenido existente
  const dashboardHTML = `
      <div id="dashboard-container">
        <header>
          <h1>📊 Dashboard de Ingresos</h1>
        </header>

        <!-- Paneles superiores -->
        <div class="grid-top">
          <div class="card">
            <h3>Seleccionar Grupo</h3>
            <select id="grupoSelect" onchange="cambiarGrupos()">
            <option value="">Seleccione un grupo</option>
            </select>
          </div>
          <div class="card">
            <h3>Ingresos Totales</h3>
            <div class="kpi" id="ingresosTotales">Gs. 0</div>
          </div>
          <div class="card">
            <h3>Meta Total</h3>
            <div class="kpi" id="metaTotal">Gs. 0</div>
          </div>
          <div class="card">
            <h3>% Alcanzado</h3>
            <div class="kpi" id="porcentajeAlcanzado">0%</div>
          </div>
        </div>

        <!-- Gráficos -->
        <div class="grid-charts">
          <div class="card">
            <h3>Metas vs Logros</h3>
            <canvas id="barChart" style="height: 400px;"></canvas>
          </div>
          <div class="card">
            <h3>Modos de Crédito</h3>
            <canvas id="pieChart"></canvas>
          </div>
        </div>
      </div>
  `;

  // ✅ AGREGAR al final del contenido existente, no reemplazar
  contenedor.insertAdjacentHTML('beforeend', dashboardHTML);

  // Cargar Chart.js si no está cargado
  if (typeof Chart === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';
    script.onload = () => {
      cargarGruposEnSelect();
    };
    document.head.appendChild(script);
  } else {
    cargarGruposEnSelect();
  }
}
window.mostrarDashboardIngresos = mostrarDashboardIngresos;

let barChart, pieChart;
export async function cargarGruposEnSelect() {
  const select = document.getElementById('grupoSelect');
  if (!select) return;

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/grupos`, {
      headers: { "Authorization": "Bearer " + token }
    });
    if (!res.ok) {
      console.error("Error al obtener grupos");
      return;
    }
    const grupos = await res.json();
    console.log("Grupos obtenidos:", grupos);
    select.innerHTML = ""; // Limpiar opciones previas
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = "Seleccione un grupo";
    select.appendChild(defaultOption);
    grupos.grupos.forEach(grupo => {
      const option = document.createElement('option');
      option.value = grupo.id_grupo;
      option.textContent = grupo.nombre_grupo;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar grupos en el select:', error);
  }
}
async function cambiarGrupos() {
  const select = document.getElementById('grupoSelect');
  if (!select) return;
  const grupoSeleccionado = select.value;
  console.log("Grupo seleccionado:", grupoSeleccionado);

  try {
    // Obtener ambos datos en paralelo
    const [dataIngresos, dataGrupo, dataMetas] = await Promise.all([
      obtenerGrupoPorId(grupoSeleccionado),
      obtenerGruposPorId(grupoSeleccionado),
      buscarMetas()
    ]);

    if (!dataIngresos || !dataGrupo || !dataMetas) return;
    console.log("Datos de ingresos:", dataIngresos);
    console.log("Datos del grupo:", dataGrupo);
    console.log("Datos de metas: importante", dataMetas);

    // Obtener valores para KPIs
    const ingresosTotales = dataIngresos.suma_comision_asesor_grupal || 0;
    const metaTotal = dataGrupo.meta_grupo || 0;

    // Calcular porcentaje
    const porcentaje = metaTotal > 0 ? ((ingresosTotales / metaTotal) * 100).toFixed(1) : 0;

    // Actualizar la interfaz
    document.getElementById('ingresosTotales').textContent = `Gs. ${ingresosTotales.toLocaleString()}`;
    document.getElementById('metaTotal').textContent = `Gs. ${metaTotal.toLocaleString()}`;
    document.getElementById('porcentajeAlcanzado').textContent = `${porcentaje}%`;

    console.log(`Ingresos: ${ingresosTotales}, Meta: ${metaTotal}, Porcentaje: ${porcentaje}%`);

    // Preparar datos para el gráfico de barras
    const usuariosGrupo = dataIngresos.usuarios || [];
    const empleados = [];
    const logrados = [];
    const metas = [];

    // Procesar cada usuario del grupo
    usuariosGrupo.forEach(usuario => {
      empleados.push(usuario.nombre);
      logrados.push(usuario.total_comision_asesor || 0);
      
      // Buscar la meta personal del usuario en dataMetas
      const metaUsuario = dataMetas.find(meta => meta.usuario === usuario.usuario);
      metas.push(metaUsuario ? (metaUsuario.meta_personal || 0) : 0);
    });

    console.log("Datos para gráfico:", { empleados, logrados, metas });

    // Función para formatear guaraníes
    function formatearGs(valor) {
      return "Gs. " + valor.toLocaleString("es-PY");
    }

    // Destruir gráfico existente
    if (barChart) barChart.destroy();

    // Crear gráfico de barras horizontales
    barChart = new Chart(document.getElementById("barChart"), {
      type: "bar",
      data: {
        labels: empleados,
        datasets: [
          {
            label: "Logrado",
            data: logrados,
            backgroundColor: "rgba(54, 162, 235, 0.8)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1
          },
          {
            label: "Meta Personal",
            data: metas,
            backgroundColor: "rgba(255, 99, 132, 0.8)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1
          }
        ]
      },
      options: {
        indexAxis: 'y', // Barras horizontales
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.parsed.x || 0;
                return `${label}: ${formatearGs(value)}`;
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return formatearGs(value);
              }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        }
      }
    });

    // Destruir gráfico de pie existente
    if (pieChart) pieChart.destroy();

    // Crear gráfico de pie con los datos de ingresos vs meta
    const metaRestante = Math.max(0, metaTotal - ingresosTotales);
    const pieData = [
      {
        label: "Ingresos Logrados",
        value: ingresosTotales,
        color: "#0D86D9"
      },
      {
        label: "Meta Restante", 
        value: metaRestante,
        color: "#D53D61"
      }
    ];

    // Solo mostrar gráfico si hay datos
    if (ingresosTotales > 0 || metaTotal > 0) {
      pieChart = new Chart(document.getElementById("pieChart"), {
        type: "pie",
        data: {
          labels: pieData.map(item => item.label),
          datasets: [{
            data: pieData.map(item => item.value),
            backgroundColor: pieData.map(item => item.color),
            borderColor: "#1D2430",
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#ffffff',
                padding: 20,
                usePointStyle: true
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.parsed || 0;
                  const total = ingresosTotales + metaRestante;
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                  return `${label}: ${formatearGs(value)} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    } else {
      // Si no hay datos, mostrar mensaje
      const pieContainer = document.getElementById("pieChart").parentElement;
      pieContainer.innerHTML = `
        <h3>Modos de Crédito</h3>
        <div style="display: flex; align-items: center; justify-content: center; height: 200px; color: #b3b3b3;">
          <p>No hay datos disponibles</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error al calcular datos del grupo:', error);
  }
}
// de aqui quitamos el meta_grupo-
export async function obtenerGruposPorId(id) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/grupos/${id}`, {
      headers: { "Authorization": "Bearer " + token }
    });
    if (!res.ok) {
      console.error("Error al obtener grupo por ID");
      return null;
    }
    const grupo = await res.json();
    console.log("Grupo obtenido:", grupo);
    return grupo.grupo;
  } catch (error) {
    console.error('Error al obtener grupo por ID:', error);
    return null;
  }
}
// retorna monto total del grupo. desde suma comision asesor grupal.
export async function obtenerGrupoPorId(id) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/grupos/${id}/resumen-mes`, {
      headers: { "Authorization": "Bearer " + token }
    });
    if (!res.ok) {
      console.error("Error al obtener grupo por ID");
      return null;
    }
    const grupo = await res.json();
    console.log("Grupo obtenido:", grupo);
    return grupo;
  } catch (error) {
    console.error('Error al obtener grupo por ID:', error);
    return null;
  }
}

export function buscarMetas() {
  const url = new URL(`${API_BASE_URL}/metas`);
  const token = localStorage.getItem('token');

  if (!token) return [];

  const headers = new Headers();
  headers.append("Authorization", "Bearer " + token);

  return fetch(url, { headers })
    .then(res => {
      if (!res.ok) {
        console.error("Error al buscar metas:", res.statusText);
        return [];
      }
      return res.json();
    })
    .then(data => {
      return data.metas || [];
    })
    .catch(error => {
      console.error("Error al buscar metas:", error);
      return [];
    });
}

// Llamar al cargar el dashboard
window.mostrarDashboardIngresos = mostrarDashboardIngresos;
window.cargarGruposEnSelect = cargarGruposEnSelect;
window.cambiarGrupos = cambiarGrupos;
