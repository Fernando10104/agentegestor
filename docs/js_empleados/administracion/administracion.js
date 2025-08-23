import { API_BASE_URL } from '../../js/config.js';
import { verificarToken } from "../../js/componentes/verificarToken.js";
import { svg_importar } from "../../src/svg/svg.js";

/**
 * admin.js
 * Código de inicialización del panel de administración.
 * - configura listeners globales
 * - proporciona helpers para mostrar dashboards de grupos
 */

// Variables globales para acceso desde HTML
window.svg_importar = svg_importar;
window.API_BASE_URL = API_BASE_URL;



// ✅ ÚNICO EVENT LISTENER PARA DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    console.log("Inicializando administración...");
    
    // Verificar token y rol
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login.html";
        return;
    }
    
    

    // Verificar token adicional
    verificarToken();
    
    // Configurar botones de navegación
    const botones = document.querySelectorAll('.nav-btn');
    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            // Quitar clase activa de todos
            botones.forEach(b => b.classList.remove('active'));
            // Activar el que fue clickeado
            boton.classList.add('active');
        });
    });

    // Event listener para icono de usuario (si existe)
    const usuarioIcono = document.getElementById('usuario-icono');
    if (usuarioIcono) {
        usuarioIcono.addEventListener('click', () => {
            console.log("Icono de usuario clickeado");
            // mostrarConfiguracion(); // Comentado porque no existe la función
        });
    }

    // Mostrar dashboard inicial
    mostrarInicio();
});

export function mostrarDashboardIngresos() {
  const contenedor = document.getElementById('contenido');
  if (!contenedor) {
    console.error("No se encontró el contenedor con ID 'contenido'");
    return;
  }

  // ✅ Limpiar contenido y mostrar solo el dashboard
  contenedor.innerHTML = `
      <div id="dashboard-container">
        <header>
          <h1>📊 Dashboard de Grupos</h1>
        </header>

        <!-- Paneles superiores -->
        <div class="grid-top">
          <div class="card">
            <h3>Mi grupo</h3>
            <select id="grupoSelect" onchange="cambiarGrupos()">
            <option value="">Cargando...</option>
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
            <h3>Progreso del Grupo</h3>
            <canvas id="pieChart"></canvas>
          </div>
        </div>
      </div>
  `;

  // Cargar Chart.js si no está cargado
  if (typeof Chart === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';
    script.onload = () => {
      console.log("Chart.js cargado, inicializando grupos...");
      cargarGruposEnSelect();
    };
    document.head.appendChild(script);
  } else {
    console.log("Chart.js ya está cargado, inicializando grupos...");
    cargarGruposEnSelect();
  }
}

window.mostrarDashboardIngresos = mostrarDashboardIngresos;

let barChart, pieChart;

export async function cargarGruposEnSelect() {
  const select = document.getElementById('grupoSelect');
  if (!select) {
    console.error("No se encontró el select de grupos");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const idUsuario = localStorage.getItem("id_usuario"); // Obtener ID del usuario
    
    if (!idUsuario) {
      console.error("No se encontró el ID del usuario en localStorage");
      return;
    }

    // Obtener información del usuario incluyendo su grupo
    const res = await fetch(`${API_BASE_URL}/usuarios/${idUsuario}/inicio`, {
      headers: { "Authorization": "Bearer " + token }
    });
    
    if (!res.ok) {
      console.error("Error al obtener información del usuario:", res.status, res.statusText);
      return;
    }
    
    const datosUsuario = await res.json();
    console.log("Datos del usuario obtenidos:", datosUsuario);
    
    // Limpiar opciones previas
    select.innerHTML = "";
    
    // Verificar si el usuario tiene un grupo asignado
    if (datosUsuario.id_grupo) {
      // Hacer fetch a /grupos para obtener todos los grupos
      const resGrupos = await fetch(`${API_BASE_URL}/grupos`, {
        headers: { "Authorization": "Bearer " + token }
      });
      
      if (resGrupos.ok) {
        const gruposData = await resGrupos.json();
        const grupos = gruposData.grupos || [];
        
        // Buscar el grupo que coincida con el id_grupo del usuario
        const grupoUsuario = grupos.find(grupo => grupo.id_grupo === datosUsuario.id_grupo);
        
        if (grupoUsuario) {
          const option = document.createElement('option');
          option.value = grupoUsuario.id_grupo;
          option.textContent = grupoUsuario.nombre_grupo; // Usar el nombre del fetch de grupos
          option.selected = true; // Seleccionar automáticamente
          select.appendChild(option);
          
          // Cargar automáticamente los datos del grupo
          await cambiarGrupos();
        } else {
          console.error("No se encontró el grupo con ID:", datosUsuario.id_grupo);
          // Si no se encuentra el grupo, mostrar mensaje
          const option = document.createElement('option');
          option.value = "";
          option.textContent = "Grupo no encontrado";
          select.appendChild(option);
        }
      } else {
        console.error("Error al obtener grupos:", resGrupos.status, resGrupos.statusText);
        // Fallback: usar el nombre que vino en datosUsuario
        const option = document.createElement('option');
        option.value = datosUsuario.id_grupo;
        option.textContent = datosUsuario.nombre_grupo || "Grupo sin nombre";
        option.selected = true;
        select.appendChild(option);
        
        await cambiarGrupos();
      }
    } else {
      // Si no tiene grupo, mostrar mensaje
      const option = document.createElement('option');
      option.value = "";
      option.textContent = "No tiene grupo asignado";
      select.appendChild(option);
    }
    
  } catch (error) {
    console.error('Error al cargar el grupo del usuario:', error);
  }
}

async function cambiarGrupos() {
  const select = document.getElementById('grupoSelect');
  if (!select) return;
  
  const grupoSeleccionado = select.value;
  console.log("Grupo seleccionado:", grupoSeleccionado);

  if (!grupoSeleccionado) {
    // Limpiar datos si no hay grupo seleccionado
    document.getElementById('ingresosTotales').textContent = 'Gs. 0';
    document.getElementById('metaTotal').textContent = 'Gs. 0';
    document.getElementById('porcentajeAlcanzado').textContent = '0%';
    
    // Limpiar gráficos
    if (barChart) {
      barChart.destroy();
      barChart = null;
    }
    if (pieChart) {
      pieChart.destroy();
      pieChart = null;
    }
    return;
  }

  try {
    console.log("Obteniendo datos para grupo:", grupoSeleccionado);
    
    // Obtener datos del grupo
    const [dataIngresos, dataGrupo, dataMetas] = await Promise.all([
      obtenerGrupoPorId(grupoSeleccionado),
      obtenerGruposPorId(grupoSeleccionado),
      buscarMetas()
    ]);

    console.log("Datos obtenidos:", { dataIngresos, dataGrupo, dataMetas });

    if (!dataIngresos || !dataGrupo) {
      console.error("No se pudieron obtener todos los datos necesarios");
      return;
    }

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
    if (barChart) {
      barChart.destroy();
      barChart = null;
    }

    // Crear gráfico de barras horizontales
    if (empleados.length > 0) {
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
                label: function (context) {
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
                callback: function (value) {
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
    }

    // Destruir gráfico de pie existente
    if (pieChart) {
      pieChart.destroy();
      pieChart = null;
    }

    // Crear gráfico de pie con los datos de ingresos vs meta
    const metaRestante = Math.max(0, metaTotal - ingresosTotales);
    
    // Solo mostrar gráfico si hay datos
    if (ingresosTotales > 0 || metaTotal > 0) {
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
                label: function (context) {
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
    }
  } catch (error) {
    console.error('Error al calcular datos del grupo:', error);
  }
}

// API para obtener información del grupo (meta_grupo)
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

// API para obtener resumen del grupo (suma_comision_asesor_grupal)
export async function obtenerGrupoPorId(id) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/grupos/${id}/resumen-mes`, {
      headers: { "Authorization": "Bearer " + token }
    });
    if (!res.ok) {
      console.error("Error al obtener resumen del grupo");
      return null;
    }
    const grupo = await res.json();
    console.log("Resumen del grupo obtenido:", grupo);
    return grupo;
  } catch (error) {
    console.error('Error al obtener resumen del grupo:', error);
    return null;
  }
}

// API para obtener metas personales
export function buscarMetas() {
  const url = new URL(`${API_BASE_URL}/metas`);
  const token = localStorage.getItem('token');

  if (!token) return Promise.resolve([]);

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

// Exponer funciones al scope global
window.mostrarDashboardIngresos = mostrarDashboardIngresos;
window.cargarGruposEnSelect = cargarGruposEnSelect;
window.cambiarGrupos = cambiarGrupos;