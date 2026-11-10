import { API_BASE_URL } from "../config.js";

const CLAVE_DESCARTADAS = "notif_descartadas";
const TIPOS_VALIDOS = ["info", "warning", "success", "danger"];
const ETIQUETAS_TIPO = {
    info: "Aviso",
    warning: "Importante",
    success: "Novedad",
    danger: "Urgente",
};

function leerDescartadas() {
    try {
        const crudo = localStorage.getItem(CLAVE_DESCARTADAS);
        const lista = crudo ? JSON.parse(crudo) : [];
        return Array.isArray(lista) ? lista : [];
    } catch (error) {
        return [];
    }
}

function guardarDescartadas(lista) {
    try {
        localStorage.setItem(CLAVE_DESCARTADAS, JSON.stringify(lista));
    } catch (error) {
        console.warn("No se pudo guardar el descarte de avisos:", error);
    }
}

function claveNotificacion(notificacion) {
    return `${notificacion.id_notificacion}:${notificacion.actualizado_en || ""}`;
}

function escaparHtml(texto) {
    return String(texto ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function formatearFecha(valor) {
    if (!valor) return "";
    const partes = String(valor).slice(0, 10).split("-");
    if (partes.length !== 3) return String(valor);

    const [anio, mes, dia] = partes;
    const fecha = new Date(Number(anio), Number(mes) - 1, Number(dia));
    if (Number.isNaN(fecha.getTime())) return String(valor);

    const hoy = new Date();
    const ayer = new Date();
    ayer.setDate(hoy.getDate() - 1);

    const mismoDia = (a, b) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();

    if (mismoDia(fecha, hoy)) return "Hoy";
    if (mismoDia(fecha, ayer)) return "Ayer";
    return `${dia}/${mes}/${anio}`;
}

function renderizarNotificaciones(notificaciones) {
    const contenedor = document.getElementById("notificaciones-global");
    if (!contenedor) return;

    const descartadas = leerDescartadas();
    const visibles = notificaciones.filter(
        (notificacion) =>
            notificacion.fijo || !descartadas.includes(claveNotificacion(notificacion))
    );

    if (visibles.length === 0) {
        contenedor.innerHTML = "";
        contenedor.classList.remove("visible");
        return;
    }

    const tarjetas = visibles
        .map((notificacion) => {
            const tipoCrudo = String(notificacion.tipo || "info").toLowerCase();
            const tipo = TIPOS_VALIDOS.includes(tipoCrudo) ? tipoCrudo : "info";
            const etiqueta = ETIQUETAS_TIPO[tipo];
            const clave = claveNotificacion(notificacion);
            const fecha = formatearFecha(notificacion.fecha_publicacion);

            const botonCerrar = notificacion.fijo
                ? ""
                : `<button type="button" class="notificacion-cerrar" data-clave="${escaparHtml(clave)}" title="Descartar aviso" aria-label="Descartar aviso">&times;</button>`;

            return `
                <article class="notificacion-card tipo-${tipo}${notificacion.fijo ? " fijo" : ""}">
                    ${botonCerrar}
                    <div class="notificacion-header">
                        <h4 class="notificacion-titulo">${escaparHtml(notificacion.titulo)}</h4>
                        <span class="notificacion-badge">${etiqueta}${notificacion.fijo ? " · Fijo" : ""}</span>
                    </div>
                    <p class="notificacion-mensaje">${escaparHtml(notificacion.mensaje)}</p>
                    ${fecha ? `<span class="notificacion-fecha">Publicado: ${escaparHtml(fecha)}</span>` : ""}
                </article>
            `;
        })
        .join("");

    contenedor.innerHTML = `<div class="notificaciones-global">${tarjetas}</div>`;
    contenedor.classList.add("visible");

    contenedor.querySelectorAll(".notificacion-cerrar").forEach((boton) => {
        boton.addEventListener("click", () => {
            const clave = boton.getAttribute("data-clave");
            const actuales = leerDescartadas();
            if (clave && !actuales.includes(clave)) {
                actuales.push(clave);
                guardarDescartadas(actuales);
            }

            const tarjeta = boton.closest(".notificacion-card");
            if (tarjeta) tarjeta.remove();

            if (!contenedor.querySelector(".notificacion-card")) {
                contenedor.innerHTML = "";
                contenedor.classList.remove("visible");
            }
        });
    });
}

export async function cargarNotificacionesGlobales() {
    const contenedor = document.getElementById("notificaciones-global");
    if (!contenedor) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const respuesta = await fetch(`${API_BASE_URL}/notificaciones`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!respuesta.ok) {
            return;
        }

        const data = await respuesta.json();
        const notificaciones = Array.isArray(data.notificaciones) ? data.notificaciones : [];
        renderizarNotificaciones(notificaciones);
    } catch (error) {
        console.warn("No se pudieron cargar los avisos:", error);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", cargarNotificacionesGlobales);
} else {
    cargarNotificacionesGlobales();
}
