// Sistema de misiones infinitas para PC Clicker

const misiones = [
    {
        tipo: "clicks",
        texto: (meta) => `Haz ${meta} clics manuales`,
        base: 20,
        incremento: 1.5,
        recompensa: 5
    },
    {
        tipo: "auto",
        texto: (meta) => `Consigue ${meta} clics automáticos`,
        base: 10,
        incremento: 2,
        recompensa: 8
    },
    {
        tipo: "bitcoin",
        texto: (meta) => `Gana ${meta} bitcoins`,
        base: 100,
        incremento: 2,
        recompensa: 10
    },
    {
        tipo: "compra",
        texto: (meta) => `Compra ${meta} mejoras en la tienda`,
        base: 1,
        incremento: 1.2, // Puedes ajustar este valor para que suba más lento o más rápido
        recompensa: 7
    }
];

let progreso = {
    clicks: 0,
    auto: 0,
    bitcoin: 0,
    compra: 0
};

let creditos = 0;
let estadoMisiones = []; // [{tipo, nivel, meta, completada}]

function cargarMisiones() {
    // Si no hay misiones, crea una de cada tipo
    if (estadoMisiones.length === 0) {
        estadoMisiones = misiones.map(m => ({
            tipo: m.tipo,
            nivel: 1,
            meta: m.base,
            completada: false
        }));
    }
    renderizarMisiones();
}

function renderizarMisiones() {
    const lista = document.getElementById('lista-misiones');
    if (!lista) return;
    lista.innerHTML = '';
    estadoMisiones.forEach((m, i) => {
        const def = misiones.find(def => def.tipo === m.tipo);
        const progresoActual = Math.min(progreso[m.tipo], m.meta);
        const li = document.createElement('li');
        li.className = 'mision' + (m.completada ? ' mision-completada' : '');
            li.innerHTML = `
                <span>${def.texto(m.meta)}<br>
                <small>Progreso: ${progresoActual} / ${m.meta}</small></span>
                <span style="display:flex;align-items:center;gap:4px;">
                    <img src="img/krystal.png" alt="Kréditos" style="width:18px;vertical-align:middle;"> 
                    <span style="font-weight:bold;">+${def.recompensa}</span>
                    <button ${m.completada ? '' : 'disabled'} data-idx="${i}">Reclamar</button>
                </span>
            `;
            // Evento para mostrar créditos flotantes al reclamar
            li.querySelector('button').addEventListener('click', function(e) {
                if (!m.completada) return;
                mostrarCreditosFlotantes(def.recompensa);
            });
            lista.appendChild(li);
// Muestra un texto flotante con la cantidad de créditos ganados cerca del centro de la pantalla
function mostrarCreditosFlotantes(cantidad) {
    const efecto = document.createElement('div');
    efecto.className = 'creditos-flotantes';
    efecto.textContent = `+${cantidad}`;
    // Centro de la pantalla
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    // Aleatorizar posición cerca del centro
    const offsetX = (Math.random() - 0.5) * 120; // -60 a +60 px
    const offsetY = (Math.random() - 0.5) * 80;  // -40 a +40 px
    efecto.style.position = 'fixed';
    efecto.style.left = `${centerX + offsetX}px`;
    efecto.style.top = `${centerY + offsetY}px`;
    efecto.style.zIndex = 9999;
    efecto.style.fontSize = '2em';
    efecto.style.fontWeight = 'bold';
    efecto.style.color = '#ffd700';
    efecto.style.textShadow = '0 2px 8px #000a';
    efecto.style.pointerEvents = 'none';
    efecto.style.transition = 'opacity 0.7s, transform 0.7s';
    document.body.appendChild(efecto);
    setTimeout(() => {
        efecto.style.opacity = '0';
        efecto.style.transform = 'translateY(-40px) scale(1.2)';
    }, 10);
    setTimeout(() => {
        efecto.remove();
    }, 800);
}
    });
    const creditosSpan = document.getElementById('creditos-misiones');
    if (creditosSpan) creditosSpan.textContent = creditos;
}

function actualizarProgreso(tipo, cantidad = 1) {
    progreso[tipo] += cantidad;
    estadoMisiones.forEach((m) => {
        if (m.tipo === tipo && !m.completada && progreso[tipo] >= m.meta) {
            m.completada = true;
        }
    });
    renderizarMisiones();
}

function reclamarMision(idx) {
    const m = estadoMisiones[idx];
    if (!m.completada) return;
    const def = misiones.find(def => def.tipo === m.tipo);
    window.krystal += def.recompensa;
    actualizarKrystalUI();
    // Siguiente misión: meta aumenta, recompensa igual
    m.nivel++;
    m.meta = Math.floor(def.base * Math.pow(def.incremento, m.nivel - 1));
    m.completada = false;
    progreso[m.tipo] = 0;
    renderizarMisiones();
}

// Mostrar/ocultar ventana de misiones
document.addEventListener('DOMContentLoaded', () => {
    const btnMisiones = document.getElementById('misiones-btn');
    const ventanaMisiones = document.getElementById('ventana-misiones');
    const cerrarMisiones = document.querySelector('.cerrar-misiones');
    const listaMisiones = document.getElementById('lista-misiones');

    if (btnMisiones && ventanaMisiones && cerrarMisiones && listaMisiones) {
        btnMisiones.onclick = () => {
            ventanaMisiones.style.display = 'block';
        };
        cerrarMisiones.onclick = () => {
            ventanaMisiones.style.display = 'none';
        };
        listaMisiones.onclick = (e) => {
            if (e.target.tagName === 'BUTTON') {
                reclamarMision(Number(e.target.dataset.idx));
            }
        };
    }
    cargarMisiones();
});

// Función global para desbloquear el botón de misiones
window.misionesDesbloquearSiCorresponde = function(nivelMonitor) {
    const btn = document.getElementById('misiones-btn');
    if (!btn) return;
    if (nivelMonitor >= 5) {
        btn.style.removeProperty('display');
    }
};

// Funciones globales para actualizar progreso desde el juego principal
window.misionesClickManual = () => actualizarProgreso('clicks', 1);
window.misionesBitcoin = (cantidad) => actualizarProgreso('bitcoin', cantidad);
window.misionesCompra = () => actualizarProgreso('compra', 1);
window.misionesAutoClick = (cantidad) => actualizarProgreso('auto', cantidad);