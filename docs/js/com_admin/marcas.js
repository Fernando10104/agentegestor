import { cargarMarcas,CrearNuevaMarca,EditarMarca,EliminarMarca } from "../api_admin/marcas_api.js";
window.CrearNuevaMarca = CrearNuevaMarca;
window.EditarMarca = EditarMarca;
window.EliminarMarca = EliminarMarca;

export function mostrarGestionMarcas() {
    // Render minimal UI similar to the prueba example and initialize Handsontable
    document.getElementById("contenido").innerHTML = `
        <h1>Gestion de Marcas</h1>
        <div class="control-filtros" style="display:flex;gap:8px;align-items:center;margin:8px 0;">
            <label>Usuario:</label>
            <select id="usuario-select"><option value="">Seleccione usuario...</option></select>
            <button id="btn-cargar">Cargar</button>
            <button id="btn-agregar">Agregar fila</button>
            <button id="btn-guardar">Guardar cambios</button>
        </div>
        <div style="min-height:500px;overflow:auto;position:relative;margin-bottom:10px;">
            <div id="tabla" style="height:480px;"></div>
        </div>
        <div style="margin-top:16px;color:#a00;">
            <strong>Nota:</strong> Haga clic derecho en una fila para ver opciones de eliminar, copiar y pegar filas.
        </div>
    `;

    // Ensure API base is available (use global or fallback)
    const API_BASE = window.API_BASE_URL || window.API_BASE || 'https://word.puntodigitalpy.online';
    // expose for other modules (marcas_api.js expects API_BASE_URL)
    window.API_BASE_URL = API_BASE;

    // Ensure Handsontable is loaded (inject CDN if missing)
    function loadScript(url){
        return new Promise((res,rej)=>{
            const s=document.createElement('script');
            s.src=url; s.onload=res; s.onerror=rej; document.head.appendChild(s);
        });
    }
    function loadCss(url){
        if (document.querySelector(`link[href="${url}"]`)) return;
        const l=document.createElement('link'); l.rel='stylesheet'; l.href=url; document.head.appendChild(l);
    }

    async function ensureHandsontable(){
        if (typeof Handsontable !== 'undefined') return;
        const cdnCss = 'https://cdn.jsdelivr.net/npm/handsontable@13.0.0/dist/handsontable.full.min.css';
        const cdnJs = 'https://cdn.jsdelivr.net/npm/handsontable@13.0.0/dist/handsontable.full.min.js';
        const localCss = 'vendor/handsontable/handsontable.full.min.css';
        const localJs = 'vendor/handsontable/handsontable.full.min.js';

        // Try CDN first
        try {
            loadCss(cdnCss);
            await loadScript(cdnJs);
            return;
        } catch (err) {
            console.warn('CDN failed, trying local vendor files', err);
        }

        // Try local fallback (relative to the served docs root)
        try {
            loadCss(localCss);
            await loadScript(localJs);
            return;
        } catch (err) {
            console.warn('Local Handsontable files not found or failed to load', err);
        }

        // If both attempts fail, show instructions in the UI
        showHandsontableMissingMessage();
    }

    function showHandsontableMissingMessage(){
        const container = document.getElementById('tabla');
        if (!container) return;
        container.innerHTML = `
            <div style="padding:16px; color:#a00; background:#fff7f7; border:1px solid #f1c0c0;">
                <h3>Handsontable no está disponible</h3>
                <p>El intento de cargar Handsontable desde el CDN falló y no se encontraron archivos locales.</p>
                <p>Para solucionarlo, descarga estos archivos y colócalos en <strong>docs/vendor/handsontable/</strong>:</p>
                <ul>
                    <li>handsontable.full.min.css</li>
                    <li>handsontable.full.min.js</li>
                </ul>
                <p>Descarga desde (si tu red lo permite):</p>
                <p><a href="https://cdn.jsdelivr.net/npm/handsontable@13.0.0/dist/handsontable.full.min.css" target="_blank">CSS (jsDelivr)</a> • <a href="https://cdn.jsdelivr.net/npm/handsontable@13.0.0/dist/handsontable.full.min.js" target="_blank">JS (jsDelivr)</a></p>
                <p>Después de colocar los archivos, pulsa <button id="btn-retry-handsontable">Reintentar</button>.</p>
            </div>
        `;
        const btn = document.getElementById('btn-retry-handsontable');
        if (btn) btn.addEventListener('click', async ()=>{
            // attempt to load local files again
            try{
                loadCss('vendor/handsontable/handsontable.full.min.css');
                await loadScript('vendor/handsontable/handsontable.full.min.js');
                // reload the page area to re-initialize
                mostrarGestionMarcas();
            }catch(e){ alert('No se pudo cargar desde local. Verifica la ruta y los archivos.'); }
        });
    }

    // Initialize
    (async ()=>{
        try{
            await ensureHandsontable();
        }catch(e){ console.error('Error cargando Handsontable:', e); }

        const container = document.getElementById('tabla');
        const hot = new Handsontable(container, {
            data: [],
            colHeaders: ['ID','MARCA','MONTO_MIN','MONTO_MAX','COM_NUEVO','COM_RENOV','METODO','ID_USUARIO'],
            columns: [ {readOnly:true},{type:'text'},{type:'numeric'},{type:'numeric'},{type:'numeric'},{type:'numeric'},{type:'text'},{readOnly:true} ],
            rowHeaders: false,
            stretchH: 'all',
            minRows: 10,
            licenseKey: 'non-commercial-and-evaluation'
        });

        async function cargarUsuariosEnSelect(){
            const select = document.getElementById('usuario-select');
            select.innerHTML = '<option value="">Seleccione usuario...</option>';
            try{
                const url = new URL(`${API_BASE_URL}/usuarios`);
                const token = localStorage.getItem('token');
                const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
                if (!res.ok) throw new Error('No se pudieron cargar usuarios');
                const { usuarios } = await res.json();
                usuarios.forEach(u=>{ const opt=document.createElement('option'); opt.value=u[0]; opt.textContent = u[7]||u[1]||`Usuario ${u[0]}`; select.appendChild(opt); });
            }catch(err){ console.error('Error cargarUsuariosEnSelect',err); }
        }

        async function cargarMarcasUI(){
            const id = document.getElementById('usuario-select').value;
            if (!id) return alert('Seleccione usuario');
            try{
                const data = await cargarMarcas('', id);
                const rows = (data.marcas||[]).map(m=>[m.id_marca||null,m.marca||'',m.monto_min||null,m.monto_max||null,m.comision_nuevo||null,m.comision_renovacion||null,m.metodo_pago||'',m.id_usuario||m.id_usuario_destino||id]);
                hot.loadData(rows);
            }catch(err){ console.error('Error cargarMarcasUI',err); alert('Error cargando marcas'); }
        }

        function agregarFila(){
            const id = document.getElementById('usuario-select').value;
            if (!id) return alert('Seleccione usuario');
            const data = hot.getData(); data.push([null,'',null,null,null,null,'',parseInt(id)]); hot.loadData(data);
        }

        async function guardarCambios(){
            const rows = hot.getData().filter(r=> r.some(c=> c!==null && c!=='') );
            const token = localStorage.getItem('token');
            const idUsuario = document.getElementById('usuario-select').value;
            if (!idUsuario) return alert('Seleccione usuario');
            for(const r of rows){
                const payload = { marca: r[1], monto_min: r[2], monto_max: r[3], comision_nuevo: r[4], comision_renovacion: r[5], metodo_pago: r[6], id_usuario_destino: parseInt(r[7]||idUsuario) };
                try{
                    if (r[0]){
                        const res = await fetch(`${API_BASE_URL}/marcas/${r[0]}`, { method:'PUT', headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${token}` }, body: JSON.stringify(payload) });
                        if (!res.ok) { const err = await res.json().catch(()=>null); throw new Error(err?.detail||'Error actualizar'); }
                    } else {
                        const res = await fetch(`${API_BASE_URL}/marcas`, { method:'POST', headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${token}` }, body: JSON.stringify(payload) });
                        if (!res.ok) { const err = await res.json().catch(()=>null); throw new Error(err?.detail||'Error crear'); }
                    }
                }catch(err){ console.error('Error guardarCambios fila',r,err); alert('Error al guardar: '+(err.message||err)); return; }
            }
            alert('Cambios guardados');
            await cargarMarcasUI();
        }

        // Wire UI
        document.getElementById('btn-cargar').addEventListener('click', cargarMarcasUI);
        document.getElementById('btn-agregar').addEventListener('click', agregarFila);
        document.getElementById('btn-guardar').addEventListener('click', guardarCambios);

        // Menú contextual personalizado para filas
        let copiedRow = null;

        container.addEventListener('contextmenu', (ev) => {
            ev.preventDefault();
            const row = hot.getSelectedLast();
            if (!row) return;
            const r = row[0];
            // Eliminar menú contextual anterior si existe
            const oldMenu = document.getElementById('custom-context-menu');
            if (oldMenu) oldMenu.remove();

            // Crear menú
            const menu = document.createElement('div');
            menu.id = 'custom-context-menu';
            menu.style.position = 'fixed';
            menu.style.top = ev.clientY + 'px';
            menu.style.left = ev.clientX + 'px';
            menu.style.background = '#23293a';
            menu.style.color = '#fff';
            menu.style.border = '1px solid #414958';
            menu.style.borderRadius = '8px';
            menu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)';
            menu.style.zIndex = 9999;
            menu.style.minWidth = '140px';
            menu.style.fontSize = '15px';
            menu.style.padding = '4px 0';

            // Opción: Eliminar fila
            const eliminar = document.createElement('div');
            eliminar.textContent = 'Eliminar fila';
            eliminar.style.padding = '8px 18px';
            eliminar.style.cursor = 'pointer';
            eliminar.onmouseenter = () => eliminar.style.background = '#383d44';
            eliminar.onmouseleave = () => eliminar.style.background = 'none';
            eliminar.onclick = () => {
                const id = hot.getDataAtRowProp(r, 0);
                if (!id) {
                    hot.alter('remove_row', r);
                } else if (confirm('¿Eliminar marca ID ' + id + '?')) {
                    EliminarMarca(id);
                    setTimeout(() => cargarMarcasUI(), 300);
                }
                menu.remove();
            };
            menu.appendChild(eliminar);


            // Opción: Copiar fila
            const copiar = document.createElement('div');
            copiar.textContent = 'Copiar fila';
            copiar.style.padding = '8px 18px';
            copiar.style.cursor = 'pointer';
            copiar.onmouseenter = () => copiar.style.background = '#383d44';
            copiar.onmouseleave = () => copiar.style.background = 'none';
            copiar.onclick = () => {
                copiedRow = hot.getDataAtRow(r).slice();
                console.log('Fila copiada:', copiedRow);
                menu.remove();
            };
            menu.appendChild(copiar);

            // Opción: Pegar fila
            const pegar = document.createElement('div');
            pegar.textContent = 'Pegar fila';
            pegar.style.padding = '8px 18px';
            pegar.style.cursor = 'pointer';
            pegar.onmouseenter = () => pegar.style.background = '#383d44';
            pegar.onmouseleave = () => pegar.style.background = 'none';
            pegar.onclick = () => {
                if (copiedRow && copiedRow.length) {
                    const nueva = copiedRow.slice();
                    nueva[0] = null; // Limpiar ID
                    // Insertar arriba de la fila actual (r)
                    hot.alter('insert_row_above', r);
                    for (let c = 0; c < nueva.length; c++) {
                        hot.setDataAtCell(r, c, nueva[c]);
                    }
                }
                menu.remove();
            };
            menu.appendChild(pegar);

            // Cerrar menú al hacer click fuera
            setTimeout(() => {
                document.addEventListener('mousedown', function handler(e) {
                    if (!menu.contains(e.target)) {
                        menu.remove();
                        document.removeEventListener('mousedown', handler);
                    }
                });
            }, 10);

            document.body.appendChild(menu);
        });

        // Init data
        await cargarUsuariosEnSelect();
    })();

}