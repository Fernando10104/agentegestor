import { API_BASE_URL } from '../config.js';

export async function obtenerAsistenciasGlobales(fechaInicio = null, fechaFin = null, usuario = null) {
    try {
        const token = localStorage.getItem("token");
        const url = new URL(`${API_BASE_URL}/asistencias`);
        
        if (fechaInicio) url.searchParams.append("fecha_inicio", fechaInicio);
        if (fechaFin) url.searchParams.append("fecha_fin", fechaFin);
        if (usuario) url.searchParams.append("usuario", usuario);
        
        const res = await fetch(url, {
            headers: { "Authorization": "Bearer " + token }
        });
        
        if (!res.ok) {
            console.error("Error al obtener asistencias");
            return [];
        }
        
        const data = await res.json();
        return data.asistencias || [];
    } catch (error) {
        console.error('Error al obtener asistencias globales:', error);
        return [];
    }
}
