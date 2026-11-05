import {
    cargarNotificacionesAdmin,
    crearNotificacion,
    actualizarNotificacion,
    eliminarNotificacion,
} from "../api_admin/notificaciones_api.js";

let cacheNotificaciones = [];

const TIPOS = [
    { valor: "info", etiqueta: "Información" },
    { valor: "warning", etiqueta: "Importante" },
    { valor: "success", etiqueta: "Novedad" },
    { valor: "danger", etiqueta: "Urgente" },
];

const ROLES = [
    { valor: "admin", etiqueta: "Admin" },
    { valor: "gerente", etiqueta: "Gerente" },
    { valor: "administrativa", etiqueta: "Administrativa" },
    { valor: "supervisor", etiqueta: "Supervisor" },
    { valor: "asesor", etiqueta: "Asesor" },
];

function escaparHtml(texto) {
    return String(texto ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function opcionesTipos(seleccionado) {
    return TIPOS.map(
        (tipo) =>
            `<option value="${tipo.valor}"${tipo.valor === seleccionado ? " selected" : ""}>${tipo.etiqueta}</option>`
    ).join("");
}

function checkboxesRoles(seleccionados) {
    const activos = new Set(
        String(seleccionados || "")
            .split(",")
            .map((rol) => rol.trim().toLowerCase())
            .filter(Boolean)
    );

    return ROLES.map(
        (rol) =>
            `<label><input type="checkbox" value="${rol.valor}"${activos.has(rol.valor) ? " checked" : ""}> ${rol.etiqueta}</label>`
    ).join("");
}

function formularioNotificacion(prefijo, datos = {}) {
    const fechaPublicacion = String(datos.fecha_publicacion || "").slice(0, 10);
    const fechaExpiracion = String(datos.fecha_expiracion || "").slice(0, 10);

    return `
        <div class="form-group">
            <label for="${prefijo}-titulo">Título *</label>
            <input type="text" id="${prefijo}-titulo" maxlength="120" required
                value="${escaparHtml(datos.titulo || "")}">
        </div>
        <div class="form-group">
            <label for="${prefijo}-mensaje">Mensaje *</label>
            <textarea id="${prefijo}-mensaje" rows="4" required>${escaparHtml(datos.mensaje || "")}</textarea>
        </div>
        <div class="form-group">
            <label for="${prefijo}-tipo">Tipo</label>
            <select id="${prefijo}-tipo">${opcionesTipos(datos.tipo || "info")}</select>
        </div>
        <div class="form-group">
            <label>Roles que lo verán (sin selección = todos)</label>
            <div class="notif-roles" id="${prefijo}-roles">${checkboxesRoles(datos.roles || "")}</div>
        </div>
        <div class="form-group">
            <label for="${prefijo}-fecha-publicacion">Fecha de publicación</label>
            <input type="date" id="${prefijo}-fecha-publicacion" value="${fechaPublicacion}">
        </div>
        <div class="form-group">
            <label for="${prefijo}-fecha-expiracion">Fecha de expiración</label>
            <input type="date" id="${prefijo}-fecha-expiracion" value="${fechaExpiracion}">
        </div>
        <div class="form-group notif-checks">
            <label><input type="checkbox" id="${prefijo}-fijo"${datos.fijo ? " checked" : ""}> Aviso fijo (no se puede cerrar)</label>
            <label><input type="checkbox" id="${prefijo}-activo"${datos.activo !== false ? " checked" : ""}> Activo</label>
        </div>
    `;
}

function leerFormulario(prefijo) {
    const contenedorRoles = document.getElementById(`${prefijo}-roles`);
    const roles = contenedorRoles
        ? Array.from(contenedorRoles.querySelectorAll('input[type="checkbox"]:checked')).map(
              (checkbox) => checkbox.value
          )
        : [];

    return {
        titulo: document.getElementById(`${prefijo}-titulo`).value.trim(),
        mensaje: document.getElementById(`${prefijo}-mensaje`).value.trim(),
        tipo: document.getElementById(`${prefijo}-tipo`).value,
        roles: roles.length ? roles.join(",") : null,
        fecha_publicacion: document.getElementById(`${prefijo}-fecha-publicacion`).value || null,
        fecha_expiracion: document.getElementById(`${prefijo}-fecha-expiracion`).value || null,
        fijo: document.getElementById(`${prefijo}-fijo`).checked,
        activo: document.getElementById(`${prefijo}-activo`).checked,
    };
}

function mostrarDialogo(tipo, mensaje) {
    if (typeof window.showDialog === "function") {
        window.showDialog(tipo, mensaje);
    } else {
        console.log(`[${tipo}] ${mensaje}`);
    }
}

function mostrarModalCrearNotificacion() {
    const formulario = document.getElementById("form-crear-notificacion");
    if (formulario) formulario.reset();
    const modal = document.getElementById("modal-crear-notificacion");
    if (modal) modal.classList.add("active");
}

function cerrarModalNotificacion(tipo) {
    const modal = document.getElementById(`modal-${tipo}-notificacion`);
    if (modal) modal.classList.remove("active");

    if (tipo === "crear") {
        const formulario = document.getElementById("form-crear-notificacion");
        if (formulario) formulario.reset();
    }
}

function mostrarModalEditarNotificacion(id) {
    const notificacion = cacheNotificaciones.find(
        (item) => Number(item.id_notificacion) === Number(id)
    );
    if (!notificacion) return;

    const campos = document.getElementById("campos-editar-notificacion");
    if (!campos) return;
    campos.innerHTML = formularioNotificacion("editar", notificacion);

    const formulario = document.getElementById("form-editar-notificacion");
    if (formulario) formulario.dataset.id = String(id);

    const modal = document.getElementById("modal-editar-notificacion");
    if (modal) modal.classList.add("active");
}

function mostrarModalEliminarNotificacion(id) {
    const notificacion = cacheNotificaciones.find(
        (item) => Number(item.id_notificacion) === Number(id)
    );
    const modal = document.getElementById("modal-eliminar-notificacion");
    if (!modal) return;

    modal.dataset.id = String(id);
    const texto = document.getElementById("texto-eliminar-notificacion");
    if (texto) {
        texto.textContent = notificacion
            ? `¿Está seguro que desea eliminar el aviso "${notificacion.titulo}"?`
            : "¿Está seguro que desea eliminar este aviso?";
    }
    modal.classList.add("active");
}

export async function mostrarGestionNotificaciones() {
    const contenido = document.getElementById("contenido");
    if (!contenido) return;

    contenido.innerHTML = `
        <h1>Gestión de Avisos</h1>
        <br>
        <h4>Publicá avisos que se muestran en todos los paneles</h4>
        <br>
        <div class="controls">
            <div class="control-filtros">
                <button id="crear-notificacion" onclick="mostrarModalCrearNotificacion()">Crear Nuevo Aviso</button>
            </div>
        </div>
        <br>
        <div class="table-responsive">
            <h3>Lista de Avisos</h3>
            <table id="tabla-notificaciones">
                <thead>
                    <tr>
                        <th>ACCIONES</th>
                        <th>ID</th>
                        <th>TÍTULO</th>
                        <th>TIPO</th>
                        <th>ROLES</th>
                        <th>PUBLICACIÓN</th>
                        <th>EXPIRA</th>
                        <th>FIJO</th>
                        <th>ACTIVO</th>
                    </tr>
                </thead>
                <tbody id="notificaciones-lista"></tbody>
            </table>
        </div>

        <div class="modal-crear" id="modal-crear-notificacion" role="dialog" aria-labelledby="titulo-crear-notificacion">
            <div class="modal-header">
                <h2 id="titulo-crear-notificacion">Crear Nuevo Aviso</h2>
                <p>Complete la información del aviso</p>
            </div>
            <form class="modal-form" id="form-crear-notificacion">
                ${formularioNotificacion("crear")}
                <div class="modal-footer">
                    <button type="submit" class="create-btn">Crear Aviso</button>
                    <button type="button" class="cancel-btn" onclick="cerrarModalNotificacion('crear')">Cancelar</button>
                </div>
            </form>
        </div>

        <div class="modal-crear" id="modal-editar-notificacion" role="dialog" aria-labelledby="titulo-editar-notificacion">
            <div class="modal-header">
                <h2 id="titulo-editar-notificacion">Editar Aviso</h2>
                <p>Modifique la información del aviso</p>
            </div>
            <form class="modal-form" id="form-editar-notificacion">
                <div id="campos-editar-notificacion"></div>
                <div class="modal-footer">
                    <button type="submit" class="create-btn">Guardar Cambios</button>
                    <button type="button" class="cancel-btn" onclick="cerrarModalNotificacion('editar')">Cancelar</button>
                </div>
            </form>
        </div>

        <div class="modal-confirmacion" id="modal-eliminar-notificacion">
            <div>
                <h2>Eliminar Aviso</h2>
                <p id="texto-eliminar-notificacion">¿Está seguro que desea eliminar este aviso?</p>
                <div class="btns">
                    <button id="confirmar-eliminar-notificacion" class="btn-confirmar">Eliminar</button>
                    <button id="cancelar-eliminar-notificacion" class="btn-cancelar">Cancelar</button>
                </div>
            </div>
        </div>
    `;

    cacheNotificaciones = await cargarNotificacionesAdmin();

    const formularioCrear = document.getElementById("form-crear-notificacion");
    if (formularioCrear) {
        formularioCrear.onsubmit = async (event) => {
            event.preventDefault();
            try {
                await crearNotificacion(leerFormulario("crear"));
                mostrarDialogo("success", "Aviso creado correctamente");
                cerrarModalNotificacion("crear");
                cacheNotificaciones = await cargarNotificacionesAdmin();
            } catch (error) {
                mostrarDialogo("error", error.message);
            }
        };
    }

    const formularioEditar = document.getElementById("form-editar-notificacion");
    if (formularioEditar) {
        formularioEditar.onsubmit = async (event) => {
            event.preventDefault();
            const id = Number(formularioEditar.dataset.id);
            try {
                await actualizarNotificacion(id, leerFormulario("editar"));
                mostrarDialogo("success", "Aviso actualizado correctamente");
                cerrarModalNotificacion("editar");
                cacheNotificaciones = await cargarNotificacionesAdmin();
            } catch (error) {
                mostrarDialogo("error", error.message);
            }
        };
    }

    const cancelarEliminar = document.getElementById("cancelar-eliminar-notificacion");
    if (cancelarEliminar) {
        cancelarEliminar.onclick = () => {
            const modal = document.getElementById("modal-eliminar-notificacion");
            if (modal) modal.classList.remove("active");
        };
    }

    const confirmarEliminar = document.getElementById("confirmar-eliminar-notificacion");
    if (confirmarEliminar) {
        confirmarEliminar.onclick = async () => {
            const modal = document.getElementById("modal-eliminar-notificacion");
            if (!modal) return;
            const id = Number(modal.dataset.id);
            try {
                await eliminarNotificacion(id);
                mostrarDialogo("success", "Aviso eliminado correctamente");
                modal.classList.remove("active");
                cacheNotificaciones = await cargarNotificacionesAdmin();
            } catch (error) {
                mostrarDialogo("error", error.message);
            }
        };
    }
}

window.mostrarModalCrearNotificacion = mostrarModalCrearNotificacion;
window.mostrarModalEditarNotificacion = mostrarModalEditarNotificacion;
window.mostrarModalEliminarNotificacion = mostrarModalEliminarNotificacion;
window.cerrarModalNotificacion = cerrarModalNotificacion;
