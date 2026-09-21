export function mascaraFecha(input) {
    let v = input.value.replace(/\D/g, "").slice(0, 8);
    if (v.length > 4) {
        v = v.slice(0, 2) + "/" + v.slice(2, 4) + "/" + v.slice(4);
    } else if (v.length > 2) {
        v = v.slice(0, 2) + "/" + v.slice(2);
    }
    input.value = v;
}

export function fechaValida(valor) {
    if (!valor) return true;
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valor);
    if (!match) return false;
    const dia = parseInt(match[1], 10);
    const mes = parseInt(match[2], 10);
    const anio = parseInt(match[3], 10);
    const fecha = new Date(anio, mes - 1, dia);
    return (
        fecha.getFullYear() === anio &&
        fecha.getMonth() === mes - 1 &&
        fecha.getDate() === dia
    );
}

export function formatearFecha(fecha) {
    const dd = String(fecha.getDate()).padStart(2, "0");
    const mm = String(fecha.getMonth() + 1).padStart(2, "0");
    const aaaa = fecha.getFullYear();
    return `${dd}/${mm}/${aaaa}`;
}

export function hoyFormateado() {
    return formatearFecha(new Date());
}

export function primerDiaMesFormateado() {
    const ahora = new Date();
    return formatearFecha(new Date(ahora.getFullYear(), ahora.getMonth(), 1));
}