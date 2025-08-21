import { API_BASE_URL } from "../config.js";
export function mostrarGestionImport() {
  console.log('Iniciando la función mostrarGestionImport');
  const contenedor = document.getElementById('contenido');
  if (contenedor) {
    contenedor.innerHTML = '';
  }
  document.getElementById('contenido').innerHTML = `
    <div class="header">
        <h1>Gestión de Importaciones</h1>
        <h4>Aquí puedes gestionar las importaciones de clientes.</h4>
    </div>
    <div class="import-section">
        <div class="template-section" style="margin-bottom: 20px; padding: 15px; border: 1px solid #414958; border-radius: 5px; background-color: #1D2430; box-shadow: 0 1px 2px rgba(60, 131, 246, 0.3), 0 1px 2px rgba(0,0,0,0.05);">
            <h5>📋 Plantilla de Importación</h5>
            <p>Descarga la plantilla para asegurar que tu archivo tenga la estructura correcta:</p>
            <button id="downloadTemplateButton" style="background-color: #28a745; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">
                📥 Descargar Plantilla Excel
            </button>
        </div>
        
        <div class="upload-section" style="margin-bottom: 20px; padding: 15px; border: 1px solid #414958; border-radius: 5px; background-color: #1D2430; box-shadow: 0 1px 2px rgba(60, 131, 246, 0.3), 0 1px 2px rgba(0,0,0,0.05);">
            <h5>📤 Importar Datos</h5>
            <input type="file" id="fileInput" accept=".xlsx, .xls" style="margin-bottom: 10px;" />
            <button id="importButton" style="background-color: #007bff; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">
                Importar Archivo
            </button>
        </div>
        
        <div style="margin-bottom: 10px;">
            <button id="selectAllButton" style="display: none; margin-right: 10px; background-color: #6c757d; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">Seleccionar Todo</button>
            <button id="importSelectedButton" style="display: none; background-color: #28a745; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">Importar Seleccionados</button>
        </div>
        
        <div id="importResult"></div>
        <div id="dataTable" class="table-responsive"></div>
    </div>
  `;

  // Agregar funcionalidad a los botones
  document.getElementById('downloadTemplateButton').addEventListener('click', downloadTemplate);
  document.getElementById('importButton').addEventListener('click', handleFileImport);
  document.getElementById('selectAllButton').addEventListener('click', selectAllRows);
  document.getElementById('importSelectedButton').addEventListener('click', importSelectedRows);
}

function downloadTemplate() {
  // Crear datos de ejemplo para la plantilla
  const templateData = [
    {
      'Nombre': 'Juan Pérez',
      'Documento': '12345678',
      'Contacto': '0991234567',
      'Direccion': 'Av. Principal 123',
      'Correo': 'juan.perez@email.com',
      'Faja Inforcomf': 'A',
      'Estado Credito': 'INGRESADO',
      'Asesor': 'Maria González',
      'Fecha Registro': '2025-08-21'
    },
    {
      'Nombre': 'Ana García',
      'Documento': '87654321',
      'Contacto': '0987654321',
      'Direccion': 'Calle Secundaria 456',
      'Correo': 'ana.garcia@email.com',
      'Faja Inforcomf': 'B',
      'Estado Credito': 'INGRESADO',
      'Asesor': 'Carlos Rodríguez',
      'Fecha Registro': '2025-08-20'
    },
    {
      'Nombre': '',
      'Documento': '',
      'Contacto': '',
      'Direccion': '',
      'Correo': '',
      'Faja Inforcomf': '',
      'Estado Credito': '',
      'Asesor': '',
      'Fecha Registro': ''
    }
  ];

  // Crear un nuevo libro de trabajo
  const workbook = XLSX.utils.book_new();
  
  // Crear hoja con los datos de plantilla
  const worksheet = XLSX.utils.json_to_sheet(templateData);
  
  // Agregar la hoja al libro
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Plantilla Clientes');
  
  // Crear una segunda hoja con instrucciones
  const instructions = [
    { 'INSTRUCCIONES': 'Complete los datos en la hoja "Plantilla Clientes"' },
    { 'INSTRUCCIONES': '' },
    { 'INSTRUCCIONES': 'CAMPOS OBLIGATORIOS:' },
    { 'INSTRUCCIONES': '• Nombre: Nombre completo del cliente' },
    { 'INSTRUCCIONES': '• Contacto: Número de teléfono' },
    { 'INSTRUCCIONES': '' },
    { 'INSTRUCCIONES': 'CAMPOS OPCIONALES:' },
    { 'INSTRUCCIONES': '• Documento: Número de cédula o documento' },
    { 'INSTRUCCIONES': '• Direccion: Dirección completa' },
    { 'INSTRUCCIONES': '• Correo: Email del cliente' },
    { 'INSTRUCCIONES': '• Faja Inforcomf: Clasificación (A, B, C, etc.)' },
    { 'INSTRUCCIONES': '• Estado Credito: ACTIVO, PENDIENTE, INACTIVO' },
    { 'INSTRUCCIONES': '• Asesor: Nombre del asesor asignado' },
    { 'INSTRUCCIONES': '• Fecha Registro: Formato YYYY-MM-DD' },
    { 'INSTRUCCIONES': '' },
    { 'INSTRUCCIONES': 'NOTAS IMPORTANTES:' },
    { 'INSTRUCCIONES': '• No modifique los nombres de las columnas' },
    { 'INSTRUCCIONES': '• Use "-" para campos vacíos si es necesario' },
    { 'INSTRUCCIONES': '• Las fechas deben estar en formato YYYY-MM-DD' },
    { 'INSTRUCCIONES': '• Elimine esta hoja antes de importar' }
  ];
  
  const instructionsSheet = XLSX.utils.json_to_sheet(instructions);
  XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Instrucciones');
  
  // Generar el archivo y descargarlo
  const fileName = `Plantilla_Importacion_Clientes_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
  
  // Mostrar mensaje de confirmación
  const resultContainer = document.getElementById('importResult');
  resultContainer.innerHTML = '<p style="color: green;">✅ Plantilla descargada correctamente. Complete los datos y vuelva a cargar el archivo.</p>';
}

function handleFileImport() {
  const fileInput = document.getElementById('fileInput');
  const resultContainer = document.getElementById('importResult');
  const dataTable = document.getElementById('dataTable');

  if (!fileInput.files.length) {
    resultContainer.innerHTML = '<p style="color: red;">Por favor, selecciona un archivo.</p>';
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    try {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      console.log('Datos importados:', jsonData);

      // Preprocesar y validar los datos
      const processedData = preprocessData(jsonData);
      if (validateImportedData(processedData)) {
        resultContainer.innerHTML = '<p style="color: green;">Archivo importado correctamente.</p>';
        renderTable(processedData, dataTable);
        // Mostrar botones adicionales
        document.getElementById('selectAllButton').style.display = 'inline-block';
        document.getElementById('importSelectedButton').style.display = 'inline-block';
      } else {
        resultContainer.innerHTML = '<p style="color: red;">El archivo tiene errores en su estructura.</p>';
      }
    } catch (error) {
      console.error('Error al procesar el archivo:', error);
      resultContainer.innerHTML = '<p style="color: red;">Error al procesar el archivo. Verifica el formato.</p>';
    }
  };

  reader.readAsArrayBuffer(file);
}

function validateImportedData(data) {
  console.log('Validando datos:', data);
  
  // Filtrar filas vacías (que no tengan nombre)
  const nonEmptyRows = data.filter(item => {
    const nombre = item.Nombre ? item.Nombre.toString().trim() : '';
    const contacto = item.Contacto ? item.Contacto.toString().trim() : '';
    return nombre !== '' && contacto !== '';
  });
  
  console.log('Filas no vacías:', nonEmptyRows);
  
  if (nonEmptyRows.length === 0) {
    console.log('No hay filas válidas para importar');
    return false;
  }
  
  // Validar que las filas no vacías tengan al menos nombre y contacto
  const isValid = nonEmptyRows.every(item => {
    const nombre = item.Nombre ? item.Nombre.toString().trim() : '';
    const contacto = item.Contacto ? item.Contacto.toString().trim() : '';
    
    console.log(`Validando fila - Nombre: "${nombre}", Contacto: "${contacto}"`);
    
    return nombre !== '' && contacto !== '';
  });
  
  console.log('Resultado de validación:', isValid);
  return isValid;
}

function preprocessData(data) {
  console.log('Datos originales:', data);
  
  // Definir las columnas permitidas para la base de datos
  const allowedColumns = [
    'Nombre',
    'Documento', 
    'Contacto',
    'Direccion',
    'Correo',
    'Faja Inforcomf',
    'Estado Credito',
    'Asesor',
    'Fecha Registro'
  ];

  const processedData = data.map(item => {
    // Crear un objeto solo con las columnas permitidas
    const filteredItem = {};
    
    allowedColumns.forEach(column => {
      if (item.hasOwnProperty(column)) {
        let value = item[column];
        
        // Convertir a string y limpiar
        if (value !== null && value !== undefined) {
          value = value.toString().trim();
        }
        
        if (column === 'Fecha Registro') {
          filteredItem[column] = convertExcelDate(value);
        } else if (value === '-' || value === '') {
          filteredItem[column] = '';
        } else {
          filteredItem[column] = value || '';
        }
      } else {
        filteredItem[column] = ''; // Si la columna no existe, asignar valor vacío
      }
    });
    
    return filteredItem;
  });
  
  // Filtrar filas completamente vacías
  const filteredData = processedData.filter(item => {
    const hasData = Object.values(item).some(value => value && value.toString().trim() !== '');
    return hasData;
  });
  
  console.log('Datos procesados:', filteredData);
  return filteredData;
}

function convertExcelDate(excelDate) {
  // Si ya es una string en formato de fecha, devolverla tal como está
  if (typeof excelDate === 'string' && excelDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return excelDate;
  }
  
  // Si es un número (fecha serial de Excel)
  if (typeof excelDate === 'number') {
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    return date.toISOString().split('T')[0];
  }
  
  // Si es una string que representa un número
  if (typeof excelDate === 'string' && !isNaN(parseFloat(excelDate))) {
    const numericDate = parseFloat(excelDate);
    const date = new Date((numericDate - 25569) * 86400 * 1000);
    return date.toISOString().split('T')[0];
  }
  
  // Si no es un formato reconocido, devolver el valor original
  return excelDate;
}

function mostrarResultadoImportacion(resultado) {
  const resultContainer = document.getElementById('importResult');
  
  let html = '<div style="border: 1px solid #414958; padding: 15px; border-radius: 5px; margin: 10px 0; background-color: #1D2430;">';
  html += '<h5>📊 Resultado de la Importación</h5>';
  
  // Resumen
  html += '<div style="background-color: #2a3441; padding: 10px; border-radius: 3px; margin-bottom: 10px;">';
  html += `<strong>Total procesados:</strong> ${resultado.resumen.total_procesados}<br>`;
  html += `<span style="color: #28a745;"><strong>✅ Exitosos:</strong> ${resultado.resumen.exitosos}</span><br>`;
  html += `<span style="color: #ffc107;"><strong>⚠️ Duplicados:</strong> ${resultado.resumen.duplicados}</span><br>`;
  html += `<span style="color: #dc3545;"><strong>❌ Errores:</strong> ${resultado.resumen.errores}</span>`;
  html += '</div>';
  
  // Detalles de errores si los hay
  if (resultado.errores.length > 0) {
    html += '<details style="margin-top: 10px;">';
    html += `<summary style="cursor: pointer; color: #dc3545;"><strong>Ver errores (${resultado.errores.length})</strong></summary>`;
    resultado.errores.forEach(error => {
      html += `<div style="margin: 5px 0; padding: 5px; background-color: #2d1b1b; border-left: 3px solid #dc3545;">`;
      html += `<strong>Fila ${error.fila}:</strong> ${error.error}<br>`;
      html += `<small>Cliente: ${error.cliente.nombre} (${error.cliente.documento})</small>`;
      html += '</div>';
    });
    html += '</details>';
  }
  
  // Detalles de duplicados si los hay
  if (resultado.duplicados.length > 0) {
    html += '<details style="margin-top: 10px;">';
    html += `<summary style="cursor: pointer; color: #ffc107;"><strong>Ver duplicados (${resultado.duplicados.length})</strong></summary>`;
    resultado.duplicados.forEach(duplicado => {
      html += `<div style="margin: 5px 0; padding: 5px; background-color: #2d2a1b; border-left: 3px solid #ffc107;">`;
      html += `<strong>Fila ${duplicado.fila}:</strong> ${duplicado.mensaje}<br>`;
      html += `<small>Cliente: ${duplicado.cliente.nombre} (${duplicado.cliente.documento})</small>`;
      html += '</div>';
    });
    html += '</details>';
  }
  
  // Detalles de exitosos si los hay
  if (resultado.exitosos.length > 0) {
    html += '<details style="margin-top: 10px;">';
    html += `<summary style="cursor: pointer; color: #28a745;"><strong>Ver exitosos (${resultado.exitosos.length})</strong></summary>`;
    resultado.exitosos.forEach(exitoso => {
      html += `<div style="margin: 5px 0; padding: 5px; background-color: #1b2d1b; border-left: 3px solid #28a745;">`;
      html += `<strong>Fila ${exitoso.fila}:</strong> ${exitoso.mensaje}<br>`;
      html += `<small>Cliente: ${exitoso.cliente.nombre} (${exitoso.cliente.documento})</small>`;
      html += '</div>';
    });
    html += '</details>';
  }
  
  html += '</div>';
  resultContainer.innerHTML = html;
  
  // Ocultar botones de importación si se completó
  if (resultado.resumen.exitosos > 0 || resultado.resumen.duplicados > 0) {
    document.getElementById('selectAllButton').style.display = 'none';
    document.getElementById('importSelectedButton').style.display = 'none';
  }
}

function renderTable(data, container) {
  // Guardar los datos para uso posterior
  window.currentImportData = data;
  
  // Definir el orden específico de las columnas a mostrar
  const columnsOrder = [
    'Nombre',
    'Documento', 
    'Contacto',
    'Direccion',
    'Correo',
    'Faja Inforcomf',
    'Estado Credito',
    'Asesor',
    'Fecha Registro'
  ];

  // Crear la tabla
  let tableHTML = '<table>';
  tableHTML += '<thead><tr>';

  // Agregar columna de selección
  tableHTML += '<th><input type="checkbox" id="selectAllCheckbox"> Todos</th>';

  // Agregar encabezados en el orden específico
  columnsOrder.forEach(header => {
    tableHTML += `<th>${header}</th>`;
  });
  tableHTML += '</tr></thead>';

  // Agregar filas de datos
  tableHTML += '<tbody>';
  data.forEach((row, index) => {
    tableHTML += '<tr>';
    
    // Agregar checkbox de selección
    tableHTML += `<td><input type="checkbox" class="row-checkbox" data-row-index="${index}"></td>`;
    
    // Agregar datos de la fila en el orden específico
    columnsOrder.forEach(header => {
      tableHTML += `<td>${row[header] || ''}</td>`;
    });
    tableHTML += '</tr>';
  });
  tableHTML += '</tbody>';

  tableHTML += '</table>';

  // Renderizar la tabla en el contenedor
  container.innerHTML = tableHTML;

  // Agregar funcionalidad al checkbox de seleccionar todo
  document.getElementById('selectAllCheckbox').addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.checked = this.checked;
    });
  });
}

function selectAllRows() {
  const selectAllCheckbox = document.getElementById('selectAllCheckbox');
  const checkboxes = document.querySelectorAll('.row-checkbox');
  
  const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
  
  checkboxes.forEach(checkbox => {
    checkbox.checked = !allChecked;
  });
  
  selectAllCheckbox.checked = !allChecked;
}

async function importSelectedRows() {
  const selectedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
  
  if (selectedCheckboxes.length === 0) {
    alert('Por favor, selecciona al menos una fila para importar.');
    return;
  }
  
  // Obtener los datos procesados almacenados
  const processedData = window.currentImportData;
  
  if (!processedData) {
    alert('No hay datos cargados para importar.');
    return;
  }
  
  const selectedRows = Array.from(selectedCheckboxes).map(checkbox => {
    const rowIndex = parseInt(checkbox.dataset.rowIndex);
    return processedData[rowIndex];
  });
  
  console.log('Filas seleccionadas para importar:', selectedRows);
  
  // Mapear los datos al formato esperado por la API
  const clientesParaImportar = selectedRows.map(row => ({
    nombre: row.Nombre || '',
    documento: row.Documento || '',
    contacto: row.Contacto || '',
    direccion: row.Direccion || '',
    correo: row.Correo || '',
    faja_inforcomf: row['Faja Inforcomf'] || '',
    estado_credito: row['Estado Credito'] || 'INGRESADO',
    asesor: row.Asesor || '',
    fecha_registro: row['Fecha Registro'] || ''
  }));
  
  try {
    // Mostrar loading
    const resultContainer = document.getElementById('importResult');
    resultContainer.innerHTML = '<p style="color: #007bff;">🔄 Procesando importación...</p>';
    
    // Obtener el token de autenticación
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      throw new Error('No se encontró token de autenticación');
    }
    
    // Enviar datos a la API
    const response = await fetch(`${API_BASE_URL}/crear-cliente/importacion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(clientesParaImportar)
    });
    
    const resultado = await response.json();
    
    if (response.ok) {
      // Mostrar resumen de resultados
      mostrarResultadoImportacion(resultado);
    } else {
      resultContainer.innerHTML = `<p style="color: #dc3545;">❌ Error en la importación: ${resultado.detail || 'Error desconocido'}</p>`;
    }
    
  } catch (error) {
    console.error('Error al importar:', error);
    const resultContainer = document.getElementById('importResult');
    resultContainer.innerHTML = `<p style="color: #dc3545;">❌ Error de conexión: ${error.message}</p>`;
  }
}
