import { obtenerAsistenciasGlobales } from "../api_gerente/asistencias_api.js";

let asistenciasData = [];
let sortColumn = null;
let sortDirection = 'asc';

function formatearFecha(fechaStr) {
    if (!fechaStr) return "-";
    try {
        const fecha = new Date(fechaStr);
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const año = fecha.getFullYear();
        return `${dia}/${mes}/${año}`;
    } catch {
        return fechaStr;
    }
}

function formatearHora(fechaStr) {
    if (!fechaStr) return "-";
    try {
        const fecha = new Date(fechaStr);
        const horas = String(fecha.getHours()).padStart(2, '0');
        const minutos = String(fecha.getMinutes()).padStart(2, '0');
        const segundos = String(fecha.getSeconds()).padStart(2, '0');
        return `${horas}:${minutos}:${segundos}`;
    } catch {
        return fechaStr;
    }
}

function calcularTiempoTrabajado(fechaIngreso, fechaSalida) {
    if (!fechaIngreso || !fechaSalida) return "-";
    try {
        const ingreso = new Date(fechaIngreso);
        const salida = new Date(fechaSalida);
        const diffMs = salida - ingreso;
        if (diffMs < 0) return "-";
        const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${String(diffHoras).padStart(2, '0')}:${String(diffMinutos).padStart(2, '0')}`;
    } catch {
        return "-";
    }
}

function primerDiaMes() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    return `${año}-${mes}-01`;
}

function hoyFormateado() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
}

function ordenarDatos() {
    if (!sortColumn) return;
    
    asistenciasData.sort((a, b) => {
        let valA, valB;
        
        switch(sortColumn) {
            case 'usuario':
                valA = (a.usuario || '').toLowerCase();
                valB = (b.usuario || '').toLowerCase();
                break;
            case 'nombre':
                valA = (a.nombre || a.usuario || '').toLowerCase();
                valB = (b.nombre || b.usuario || '').toLowerCase();
                break;
            case 'fecha_ingreso':
                valA = a.fecha_ingreso ? new Date(a.fecha_ingreso).getTime() : 0;
                valB = b.fecha_ingreso ? new Date(b.fecha_ingreso).getTime() : 0;
                break;
            case 'hora_ingreso':
                valA = a.fecha_ingreso ? new Date(a.fecha_ingreso).getTime() : 0;
                valB = b.fecha_ingreso ? new Date(b.fecha_ingreso).getTime() : 0;
                break;
            case 'fecha_salida':
                valA = a.fecha_salida ? new Date(a.fecha_salida).getTime() : 0;
                valB = b.fecha_salida ? new Date(b.fecha_salida).getTime() : 0;
                break;
            case 'hora_salida':
                valA = a.fecha_salida ? new Date(a.fecha_salida).getTime() : 0;
                valB = b.fecha_salida ? new Date(b.fecha_salida).getTime() : 0;
                break;
            case 'tiempo':
                const calcA = a.fecha_ingreso && a.fecha_salida ? new Date(a.fecha_salida) - new Date(a.fecha_ingreso) : -1;
                const calcB = b.fecha_ingreso && b.fecha_salida ? new Date(b.fecha_salida) - new Date(b.fecha_ingreso) : -1;
                valA = calcA;
                valB = calcB;
                break;
            default:
                valA = a[sortColumn];
                valB = b[sortColumn];
        }
        
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });
}

function renderizarTabla() {
    const tbody = document.getElementById('tabla-asistencias-global');
    if (!tbody) return;
    
    if (asistenciasData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No hay registros</td></tr>';
        return;
    }
    
    ordenarDatos();
    
    tbody.innerHTML = asistenciasData.map(asistencia => {
        const tiempoTrabajado = calcularTiempoTrabajado(asistencia.fecha_ingreso, asistencia.fecha_salida);
        return `
            <tr>
                <td>${asistencia.usuario || '-'}</td>
                <td>${asistencia.nombre || asistencia.usuario || '-'}</td>
                <td>${formatearFecha(asistencia.fecha_ingreso)}</td>
                <td>${formatearHora(asistencia.fecha_ingreso)}</td>
                <td>${formatearFecha(asistencia.fecha_salida)}</td>
                <td>${formatearHora(asistencia.fecha_salida)}</td>
                <td>${tiempoTrabajado}</td>
            </tr>
        `;
    }).join('');
}

export async function mostrarAsistenciasGlobales() {
    const contenedor = document.getElementById('contenido');
    if (contenedor) {
        contenedor.innerHTML = '';
    }
    
    asistenciasData = [];
    sortColumn = null;
    sortDirection = 'asc';
    
    document.getElementById('contenido').innerHTML = `
        <div class="header">
            <h1>Asistencias Generales</h1>
            <h4>Registro de entradas y salidas de todos los usuarios</h4>
        </div>
        
        <div class="card" style="margin-top: 1.5rem; padding: 1.5rem;">
            <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: end; margin-bottom: 1.5rem;">
                <div class="form-group" style="flex: 1; min-width: 200px;">
                    <label>Fecha Desde</label>
                    <input type="date" id="asistencia-fecha-desde" value="${primerDiaMes()}" style="padding: 8px; border-radius: 6px; border: 1px solid #3a3a4f; background: #2a2a3d; color: #fff;">
                </div>
                <div class="form-group" style="flex: 1; min-width: 200px;">
                    <label>Fecha Hasta</label>
                    <input type="date" id="asistencia-fecha-hasta" value="${hoyFormateado()}" style="padding: 8px; border-radius: 6px; border: 1px solid #3a3a4f; background: #2a2a3d; color: #fff;">
                </div>
                <div class="form-group" style="flex: 1; min-width: 200px;">
                    <label>Usuario (opcional)</label>
                    <input type="text" id="asistencia-usuario" placeholder="CI o usuario" style="padding: 8px; border-radius: 6px; border: 1px solid #3a3a4f; background: #2a2a3d; color: #fff;">
                </div>
                <button id="btn-filtrar-asistencias" style="padding: 8px 20px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; height: 38px;">Filtrar</button>
                <button id="btn-exportar-excel" style="padding: 8px 20px; background: #22c55e; color: white; border: none; border-radius: 6px; cursor: pointer; height: 38px;">Exportar Excel</button>
            </div>
            
            <div class="table-responsive">
                <table class="tabla">
                    <thead>
                        <tr>
                            <th style="cursor: pointer;" data-column="usuario">Usuario ⇅</th>
                            <th style="cursor: pointer;" data-column="nombre">Nombre ⇅</th>
                            <th style="cursor: pointer;" data-column="fecha_ingreso">Fecha Ingreso ⇅</th>
                            <th style="cursor: pointer;" data-column="hora_ingreso">Hora Ingreso ⇅</th>
                            <th style="cursor: pointer;" data-column="fecha_salida">Fecha Salida ⇅</th>
                            <th style="cursor: pointer;" data-column="hora_salida">Hora Salida ⇅</th>
                            <th style="cursor: pointer;" data-column="tiempo">Tiempo Trabajado ⇅</th>
                        </tr>
                    </thead>
                    <tbody id="tabla-asistencias-global">
                        <tr>
                            <td colspan="7" style="text-align: center;">Cargando...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    const btnFiltrar = document.getElementById('btn-filtrar-asistencias');
    btnFiltrar.addEventListener('click', cargarAsistencias);
    
    const btnExportar = document.getElementById('btn-exportar-excel');
    if (btnExportar) {
        btnExportar.addEventListener('click', exportarExcel);
    }
    
    const headers = document.querySelectorAll('.tabla thead th[data-column]');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.getAttribute('data-column');
            if (sortColumn === column) {
                sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                sortColumn = column;
                sortDirection = 'asc';
            }
            renderizarTabla();
        });
    });
    
    cargarAsistencias();
}

function exportarExcel() {
    if (!asistenciasData || asistenciasData.length === 0) {
        alert("No hay datos para exportar");
        return;
    }

    const datosExcel = asistenciasData.map(asistencia => ({
        "Usuario": asistencia.usuario || "-",
        "Nombre": asistencia.nombre || asistencia.usuario || "-",
        "Fecha Ingreso": formatearFecha(asistencia.fecha_ingreso),
        "Hora Ingreso": formatearHora(asistencia.fecha_ingreso),
        "Fecha Salida": formatearFecha(asistencia.fecha_salida),
        "Hora Salida": formatearHora(asistencia.fecha_salida),
        "Tiempo Trabajado": calcularTiempoTrabajado(asistencia.fecha_ingreso, asistencia.fecha_salida)
    }));

    const worksheet = XLSX.utils.json_to_sheet(datosExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Asistencias");

    const fecha = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `Asistencias_${fecha}.xlsx`);
}

async function cargarAsistencias() {
    const fechaDesde = document.getElementById('asistencia-fecha-desde').value;
    const fechaHasta = document.getElementById('asistencia-fecha-hasta').value;
    const usuario = document.getElementById('asistencia-usuario').value.trim();
    const tbody = document.getElementById('tabla-asistencias-global');
    
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Cargando...</td></tr>';
    
    asistenciasData = await obtenerAsistenciasGlobales(fechaDesde, fechaHasta, usuario || null);
    
    if (asistenciasData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No hay registros</td></tr>';
        return;
    }
    
    renderizarTabla();
}
