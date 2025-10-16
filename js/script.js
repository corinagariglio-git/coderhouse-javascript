const STORAGE_KEY = "sds_ordenes";

/* Aclaración IMPORTANTE: Si la orden tiene fecha de carga, se considera Embarcado no cobrado. Si no, Pendiente de embarque. */
function Orden(data) {
  this.numero = Number(data.numero || 0);
  this.exportador = String(data.exportador || "").trim();
  this.importador = String(data.importador || "").trim();
  this.producto = String(data.producto || "").trim();
  this.cantidad = Number(data.cantidad || 0);
  this.fechaCarga = data.fechaCarga || "";
  this.fechaCobro = data.fechaCobro || "";
  this.estado = this.fechaCarga
    ? "Embarcado no cobrado"
    : "Pendiente de embarque";
}

const leerOrdenes = () => {
  const datosGuardados = localStorage.getItem(STORAGE_KEY);
  return datosGuardados ? JSON.parse(datosGuardados) : [];
};

const guardarOrdenes = (arr) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
};

/* Mostrar lista de órdenes en las páginas Embarcados no cobrados y Pendientes de embarque */
const mostrarLista = (contenedorId, estado) => {
  const cont = document.getElementById(contenedorId);
  if (!cont) return;

  const visibles = leerOrdenes().filter((o) => o.estado === estado);

  const html = visibles
    .map(
      (o) => `
    <article class="order-card" data-numero="${o.numero}">
      <div class="order-head"><strong>Orden N° ${o.numero}</strong></div>
      <p><strong>Estado:</strong> ${o.estado}</p>
      <p><strong>Exportador:</strong> ${o.exportador}</p>
      <p><strong>Importador:</strong> ${o.importador}</p>
      <p><strong>Producto:</strong> ${o.producto}</p>
      <p><strong>Cantidad (tn):</strong> ${o.cantidad}</p>
      <p><strong>Fecha de carga:</strong> ${o.fechaCarga || ""}</p>
      <p><strong>Fecha de cobro:</strong> ${o.fechaCobro || ""}</p>
    </article>
  `
    )
    .join("");

  cont.innerHTML = html;
};

/* Creador de órdenes en el index */
const initIndex = () => {
  const form = document.getElementById("formularioOrden");
  if (!form) return;
  const msg = document.getElementById("mensaje");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const numero = document.getElementById("numeroOrden").value;
    const exportador = document.getElementById("exportador").value;
    const importador = document.getElementById("importador").value;
    const producto = document.getElementById("producto").value;
    const cantidad = document.getElementById("cantidad").value;
    const fechaCarga = document.getElementById("fechaCarga").value;
    const fechaCobro = document.getElementById("fechaCobro").value;

    const lista = leerOrdenes();
    const nueva = new Orden({
      numero,
      exportador,
      importador,
      producto,
      cantidad,
      fechaCarga,
      fechaCobro,
    });
    lista.push(nueva);
    guardarOrdenes(lista);

    const destino =
      nueva.estado === "Pendiente de embarque"
        ? "Pendientes de embarque"
        : "Embarcados no cobrados";
    if (msg) {
      msg.classList.add("mostrar");
      msg.textContent = `¡Orden N° ${nueva.numero} creada! Se envió a: ${destino}.`;
    }
    form.reset();
  });
};

/* Esperar a que el DOM esté listo y actuar en función de la página */
document.addEventListener("DOMContentLoaded", () => {
  /* Accionar para el Index */
  if (document.getElementById("formularioOrden")) {
    initIndex();
  }

  /* Accionar para Pendientes de embarque */
  if (document.getElementById("pendientesList")) {
    mostrarLista("pendientesList", "Pendiente de embarque");
  }

  /* Accionar para Embarcados no cobrados */

  if (document.getElementById("embarcadosList")) {
    mostrarLista("embarcadosList", "Embarcado no cobrado");
  }
});
