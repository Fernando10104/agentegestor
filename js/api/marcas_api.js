export function cargarMarcas() {
  const token = localStorage.getItem("token");
  const id_usuario = localStorage.getItem("id_usuario") || 8; // Por defecto 8 si no existe
  
  // Usa la URL correcta de tu API
  const API_BASE_URL = "https://word.puntodigitalpy.online";

  return fetch(`${API_BASE_URL}/marcas_all?id_usuario=${id_usuario}`, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al cargar marcas");
      return res.json();
    })
    .then(data => {
      // Si tu API devuelve { marcas: [...] }
      if (Array.isArray(data.marcas)) return data.marcas;
      // Si tu API devuelve directamente un array
      if (Array.isArray(data)) return data;
      return [];
    })
    .catch(err => {
      console.error("Error al cargar marcas:", err);
      return [];
    });
}
