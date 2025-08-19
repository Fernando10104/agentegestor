import { API_BASE_URL } from '../config.js';
import {svg_grupo,svg_contactos,svg_logrado,svg_meta,svg_circulo } from './../../src/svg/svg.js';


export async function mostrarInicio() {
  try {
    const idUsuario = localStorage.getItem('id_usuario');
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/usuarios/${idUsuario}/inicio`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();

    const formatearMoneda = (valor) => {
      if (!valor) return '₲ 0';
      return `₲ ${valor.toLocaleString('es-PY')}`;
    };

    const urlImagen = localStorage.getItem('url_imagen');
    const roluser = localStorage.getItem('rol');

    document.getElementById('contenido').innerHTML = `
      <div class="user-info">
      <!-- Header del usuario -->
      <div class="user-header">
        <div class="user-avatar" style="background: #f0f0f0; width: 120px; height: 120px; border-radius: 12%; display: flex; align-items: center; justify-content: center; overflow: hidden;">
        ${
          urlImagen
          ? `<img src="${urlImagen}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover;">`
          : (data.nombre ? data.nombre.charAt(0).toUpperCase() : 'U')
        }
        </div>
        <div class="user-header-info">
        <h2>${data.nombre || 'Usuario'}</h2>
        <div class="user-badges">
          <span class="badge badge-admin">${roluser}</span>
          <span class="badge badge-active">Activo</span>
        </div>
        </div>
        
      </div>
      <!--mensaje motivacional -->
      <div style="margin: 0px; padding:20px; background-color: #4489F7; display:flex; border-radius: 8px; gap: 1.5rem; align-items: center;">
        <div style="background-color: #679EF8; border-radius: 50%;  display: flex; align-items: center; justify-content: center; width: 4rem; height: 4rem;">
          ${svg_circulo}
        </div>
        <div class="motivational-text">
          <h3>¡Cada meta alcanzada es un paso hacia el éxito!</h3>
          
        </div>

      </div>

      <!-- Métricas principales -->
      <div class="metrics-grid">
        <div class="metric-card metric-grupo">
        <div class="metric-icon">${svg_grupo}</div>
        <h3>MI GRUPO</h3>
        <div class="metric-value">${formatearMoneda(data.meta_grupo)}</div>
        </div>
        
        <div class="metric-card metric-contactos">
        <div class="metric-icon">${svg_contactos}</div>
        <h3>CONTACTOS</h3>
        <div class="metric-value">${data.contactos || 0}</div>
        </div>
        
        <div class="metric-card metric-meta">
        <div class="metric-icon">${svg_meta}</div>
        <h3>META</h3>
        <div class="metric-value">${formatearMoneda(data.meta_personal)}</div>
        </div>
        
        <div class="metric-card metric-logrado">
        <div class="metric-icon">${svg_logrado}</div>
        <h3>LOGRADO</h3>
        <div class="metric-value">${formatearMoneda(data.logrado)}</div>
        </div>
      </div>
      </div>
    `;
  } catch (error) {
    console.error('Error al cargar datos del usuario:', error);
    document.getElementById('contenido').innerHTML = `
      <div class="error">
        <p>Error al cargar los datos del usuario</p>
      </div>
    `;
  }
}



