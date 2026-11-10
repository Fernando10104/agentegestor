import { API_BASE_URL } from "../config.js";
import { SVG_EDITAR, SVG_ELIMINAR } from "../../src/svg/svg.js";

function obtenerToken() {
    return localStorage.getItem("token");
}

async function leerRespuesta(respuesta) {
    let data = null;
    try {
        data = await respuesta.json();
    } catch (error) {
        data = null;
    }

    if (!respuesta.ok) {
        const detalle = (data && (data.detail || data.mensaje)) || "Error en la solicitud";
        throw new Error(detalle);
    }

    return data;
}

function escaparHtml(texto) {
    return String(texto ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function formatearFechaTabla(valor) {
    if (!valor) return "";
    const partes = String(valor).slice(0, 10).split("-");
    if (partes.length !== 3) return String(valor);
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export async function cargarNotificacionesAdmin() {
    const lista = document.getElementById("notificaciones-lista");
    if (!lista) return [];

    try {
        const respuesta = await fetch(`${API_BASE_URL}/notificaciones/all`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${obtenerToken()}`,
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        const data = await leerRespuesta(respuesta);
        const notificaciones = Array.isArray(data.notificaciones) ? data.notificaciones : [];

        lista.innerHTML = "";
        if (notificaciones.length === 0) {
            lista.innerHTML =
                '<tr><td colspan="9" style="text-align:center;">No hay avisos creados.</td></tr>';
            return notificaciones;
        }

        notificaciones.forEach((notificacion) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td class="acciones">
                    <button class="btn-editar" title="Editar" onclick="mostrarModalEditarNotificacion(${notificacion.id_notificacion})">${SVG_EDITAR}</button>
                    <button class="btn-eliminar" title="Eliminar" onclick="mostrarModalEliminarNotificacion(${notificacion.id_notificacion})">${SVG_ELIMINAR}</button>
                </td>
                <td>${notificacion.id_notificacion}</td>
                <td>${escaparHtml(notificacion.titulo)}</td>
                <td>${escaparHtml(notificacion.tipo)}</td>
                <td>${escaparHtml(notificacion.roles || "Todos")}</td>
                <td>${formatearFechaTabla(notificacion.fecha_publicacion)}</td>
                <td>${notificacion.fecha_expiracion ? formatearFechaTabla(notificacion.fecha_expiracion) : "—"}</td>
                <td>${notificacion.fijo ? "Sí" : "No"}</td>
                <td>${notificacion.activo ? "Sí" : "No"}</td>
            `;
            lista.appendChild(fila);
        });

        return notificaciones;
    } catch (error) {
        console.error("Error al cargar avisos:", error);
        if (typeof window.showDialog === "function") {
            window.showDialog("error", "Error al cargar avisos: " + error.message);
        }
        lista.innerHTML =
            '<tr><td colspan="9" style="text-align:center;">No se pudieron cargar los avisos.</td></tr>';
        return [];
    }
}

export async function crearNotificacion(datos) {
    const respuesta = await fetch(`${API_BASE_URL}/notificaciones`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${obtenerToken()}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
    });
    return leerRespuesta(respuesta);
}

export async function actualizarNotificacion(id, datos) {
    const respuesta = await fetch(`${API_BASE_URL}/notificaciones/${id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${obtenerToken()}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
    });
    return leerRespuesta(respuesta);
}

export async function eliminarNotificacion(id) {
    const respuesta = await fetch(`${API_BASE_URL}/notificaciones/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${obtenerToken()}`,
            "Content-Type": "application/json",
        },
    });
    return leerRespuesta(respuesta);
}
