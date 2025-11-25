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
        incremento: 1.2,
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
        console.log('Misiones inicializadas:', estadoMisiones);
    }
    renderizarMisiones();
}

function renderizarMisiones() {
    const lista = document.getElementById('lista-misiones');
    if (!lista) return;
    lista.innerHTML = '';

    // Renderizar misión temporal primero si existe y está activa
    if (misionTemporal && tiempoRestante > 0 && !misionTemporal.completada) {
        renderizarMisionTemporal();
    }

    estadoMisiones.forEach((m, i) => {
        // Solo ocultar misión normal si hay una temporal ACTIVA del mismo tipo
        if (
            misionTemporal &&
            !misionTemporal.completada &&
            tiempoRestante > 0 &&
            misionTemporal.tipo === m.tipo
        ) {
            return; // Salta esta misión normal
        }
        
        const def = misiones.find(def => def.tipo === m.tipo);
        const progresoActual = Math.min(progreso[m.tipo], m.meta);
        const porcentaje = Math.min(100, (progresoActual / m.meta) * 100);
        const li = document.createElement('li');
        li.className = 'mision' + (m.completada ? ' mision-completada' : '');
        li.innerHTML = `
            <span>
                ${def.texto(m.meta)}<br>
                <small>Progreso: ${progresoActual} / ${m.meta}</small>
            </span>
            <span style="display:flex;align-items:center;gap:4px;position:relative;">
                <img src="img/krystal.png" alt="Krystal" style="width:18px;vertical-align:middle;"> 
                <span style="font-weight:bold;">+${def.recompensa}</span>
                <button ${m.completada ? '' : 'disabled'} data-idx="${i}" style="position:relative;overflow:hidden;">
                    <span class="progreso-btn" style="position:absolute;left:0;top:0;bottom:0;width:${porcentaje}%;background:linear-gradient(90deg,#2196f3 60%,#4af 100%);z-index:0;transition:width 0.3s;border-radius:6px;opacity:0.7;"></span>
                    <span class="texto-btn" style="position:relative;z-index:2;">Reclamar</span>
                </button>
            </span>
        `;
        
        // Añadir evento directamente al botón
        const button = li.querySelector('button');
        if (button) {
            button.addEventListener('click', function() {
                reclamarMision(i);
            });
        }
        
        lista.appendChild(li);
    });

    // Actualizar indicador de misiones completadas
    actualizarIndicadorMisiones();
    
    const creditosSpan = document.getElementById('creditos-misiones');
    if (creditosSpan) creditosSpan.textContent = creditos;
}

function actualizarIndicadorMisiones() {
    const btnMisiones = document.getElementById('misiones-btn');
    if (!btnMisiones) return;
    
    const indicador = document.getElementById('mision-indicador') || document.createElement('div');
    
    // Verificar si hay misiones completadas Y si el botón de misiones está visible
    const hayMisionesNormalesCompletadas = estadoMisiones.some(m => m.completada);
    const hayMisionTemporalCompletada = misionTemporal && misionTemporal.completada;
    const hayMisionesCompletadas = (hayMisionesNormalesCompletadas || hayMisionTemporalCompletada);
    const esBotonVisible = btnMisiones.style.display !== 'none';
    
    if (hayMisionesCompletadas && esBotonVisible) {
        // Crear o actualizar indicador
        if (!document.getElementById('mision-indicador')) {
            indicador.id = 'mision-indicador';
            indicador.className = 'mision-pendiente';
            indicador.innerHTML = '!';
            btnMisiones.appendChild(indicador);
        }
        // Añadir clase de parpadeo al icono
        btnMisiones.classList.add('con-misiones');
    } else {
        // Remover indicador y clase de parpadeo
        if (document.getElementById('mision-indicador')) {
            document.getElementById('mision-indicador').remove();
        }
        btnMisiones.classList.remove('con-misiones');
    }
}

// --- Misiones temporales rotativas/intercaladas ---
const tiposTemporales = [
    {
        tipo: "clicks",
        texto: (meta) => `Haz ${meta} clics manuales en poco tiempo`,
        base: 500,
        recompensa: 20
    },
    {
        tipo: "bitcoin",
        texto: (meta) => `Gana ${meta} bitcoins en poco tiempo`,
        base: 500,
        recompensa: 25
    },
    {
        tipo: "auto",
        texto: (meta) => `Consigue ${meta} clics automáticos en poco tiempo`,
        base: 250,
        recompensa: 22
    }
];

let idxTemporal = 0; // Para rotar/intercalar
let misionTemporal = null;
let tiempoRestante = 0;
let progresoTemporal = 0;
let temporizadorInterval = null;

// Iniciar una nueva misión temporal rotativa
function iniciarMisionTemporal() {
    if (temporizadorInterval) clearInterval(temporizadorInterval);
    const def = tiposTemporales[idxTemporal];
    misionTemporal = {
        ...def,
        meta: def.base,
        completada: false
    };
    // Tiempo aleatorio entre 2 y 3 minutos
    tiempoRestante = 120 + Math.floor(Math.random() * 61); // 120 a 180 segundos
    progresoTemporal = 0;
    renderizarMisiones(); // Actualizar toda la lista
    temporizadorInterval = setInterval(() => {
        tiempoRestante--;
        renderizarMisionTemporal();
        if (tiempoRestante <= 0) {
            if (!misionTemporal.completada) {
                // Si el tiempo se acaba y no está completada, rotar sin recompensa
                misionTemporal.completada = false;
                rotarMisionTemporal();
            }
        }
    }, 1000);
}

// Rota/intercala el tipo de misión temporal
function rotarMisionTemporal() {
    // Resetear la misión temporal actual antes de rotar
    if (misionTemporal) {
        misionTemporal.completada = false;
    }
    idxTemporal = (idxTemporal + 1) % tiposTemporales.length;
    iniciarMisionTemporal();
    actualizarIndicadorMisiones(); // Actualizar indicador después de rotar
}

// Renderiza la misión temporal en la parte superior de la lista de misiones
function renderizarMisionTemporal() {
    let contenedor = document.getElementById('mision-temporal');
    const lista = document.getElementById('lista-misiones');
    
    if (!misionTemporal || tiempoRestante <= 0) {
        if (contenedor) contenedor.remove();
        return;
    }
    
    if (!contenedor) {
        contenedor = document.createElement('li');
        contenedor.id = 'mision-temporal';
        if (lista.firstChild) {
            lista.insertBefore(contenedor, lista.firstChild);
        } else {
            lista.appendChild(contenedor);
        }
    }
    
    const progresoActual = Math.min(progresoTemporal, misionTemporal.meta);
    const porcentaje = Math.min(100, (progresoActual / misionTemporal.meta) * 100);
    const minutos = Math.floor(tiempoRestante / 60);
    const segundos = tiempoRestante % 60;
    contenedor.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:4px;">
            <span>
                <b>MISIÓN TEMPORAL:</b> ${misionTemporal.texto(misionTemporal.meta)}
                <br>
                <small>Progreso: ${progresoActual} / ${misionTemporal.meta}</small>
                <br>
                <small>Tiempo restante: <span style="color:#4af">${minutos}:${segundos.toString().padStart(2, '0')}</span></small>
            </span>
            <span style="display:flex;align-items:center;gap:4px;position:relative;">
                <img src="img/krystal.png" alt="Krystal" style="width:18px;vertical-align:middle;"> 
                <span style="font-weight:bold;">+${misionTemporal.recompensa}</span>
                <button 
                    class="btn-reclamar-temporal" 
                    ${!misionTemporal.completada ? 'disabled' : ''} 
                    style="position:relative;overflow:hidden;"
                >
                    <span class="progreso-btn" style="position:absolute;left:0;top:0;bottom:0;width:${porcentaje}%;background:linear-gradient(90deg,#2196f3 60%,#4af 100%);z-index:0;transition:width 0.3s;border-radius:6px;opacity:0.7;"></span>
                    <span class="texto-btn" style="position:relative;z-index:2;">Reclamar</span>
                </button>
            </span>
        </div>
    `;
    
    // Evento para reclamar
    const btn = contenedor.querySelector('.btn-reclamar-temporal');
    if (btn) {
        btn.onclick = () => {
            if (misionTemporal && misionTemporal.completada) {
                window.krystal += misionTemporal.recompensa;
                if (typeof actualizarKrystalUI === 'function') {
                    actualizarKrystalUI();
                }
                // Marcar como no completada antes de rotar
                misionTemporal.completada = false;
                rotarMisionTemporal();
            }
        };
    }
}

// Llama a esto cuando avances en la misión temporal
function avanzarMisionTemporal(tipo, cantidad = 1) {
    const btnMisiones = document.getElementById('misiones-btn');
    if (!btnMisiones || btnMisiones.style.display === 'none') {
        console.log('Progreso temporal ignorado - botón de misiones oculto');
        return;
    }
    
    if (!misionTemporal || misionTemporal.completada || tiempoRestante <= 0) return;
    if (misionTemporal.tipo === tipo) {
        progresoTemporal += cantidad;
        if (progresoTemporal >= misionTemporal.meta) {
            progresoTemporal = misionTemporal.meta;
            misionTemporal.completada = true;
            renderizarMisionTemporal();
            actualizarIndicadorMisiones();
        } else {
            renderizarMisionTemporal();
        }
    }
}

// --- HOOKS CORRECTOS MODIFICADOS ---
const originalClickManual = window.misionesClickManual;
window.misionesClickManual = function() {
    const btnMisiones = document.getElementById('misiones-btn');
    if (!btnMisiones || btnMisiones.style.display === 'none') {
        console.log('Click manual ignorado - botón de misiones oculto');
        return;
    }
    
    // Priorizar misión temporal si está activa y es del tipo clicks
    if (misionTemporal && !misionTemporal.completada && misionTemporal.tipo === 'clicks' && tiempoRestante > 0) {
        avanzarMisionTemporal('clicks', 1);
    } else {
        // Solo avanzar misión normal si no hay temporal activa del mismo tipo
        actualizarProgreso('clicks', 1);
    }
    
    if (originalClickManual) originalClickManual();
};

const originalBitcoin = window.misionesBitcoin;
window.misionesBitcoin = function(cantidad) {
    const btnMisiones = document.getElementById('misiones-btn');
    if (!btnMisiones || btnMisiones.style.display === 'none') {
        console.log('Bitcoin ignorado - botón de misiones oculto');
        return;
    }
    
    // Priorizar misión temporal si está activa y es del tipo bitcoin
    if (misionTemporal && !misionTemporal.completada && misionTemporal.tipo === 'bitcoin' && tiempoRestante > 0) {
        avanzarMisionTemporal('bitcoin', cantidad);
    } else {
        // Solo avanzar misión normal si no hay temporal activa del mismo tipo
        actualizarProgreso('bitcoin', cantidad);
    }
    
    if (originalBitcoin) originalBitcoin(cantidad);
};

const originalAuto = window.misionesAutoClick;
window.misionesAutoClick = function(cantidad) {
    const btnMisiones = document.getElementById('misiones-btn');
    if (!btnMisiones || btnMisiones.style.display === 'none') {
        console.log('Auto click ignorado - botón de misiones oculto');
        return;
    }
    
    // Priorizar misión temporal si está activa y es del tipo auto
    if (misionTemporal && !misionTemporal.completada && misionTemporal.tipo === 'auto' && tiempoRestante > 0) {
        avanzarMisionTemporal('auto', cantidad);
    } else {
        // Solo avanzar misión normal si no hay temporal activa del mismo tipo
        actualizarProgreso('auto', cantidad);
    }
    
    if (originalAuto) originalAuto(cantidad);
};

const originalCompra = window.misionesCompra;
window.misionesCompra = function() {
    const btnMisiones = document.getElementById('misiones-btn');
    if (!btnMisiones || btnMisiones.style.display === 'none') {
        console.log('Compra ignorada - botón de misiones oculto');
        return;
    }
    
    // Las misiones de compra no tienen temporales, así que siempre avanzar la normal
    actualizarProgreso('compra', 1);
    if (originalCompra) originalCompra();
};

// Mostrar/ocultar ventana de misiones
document.addEventListener('DOMContentLoaded', () => {
    const btnMisiones = document.getElementById('misiones-btn');
    const ventanaMisiones = document.getElementById('ventana-misiones');
    const cerrarMisiones = document.querySelector('.cerrar-misiones');
    
    if (btnMisiones && ventanaMisiones && cerrarMisiones) {
        btnMisiones.onclick = () => {
            ventanaMisiones.style.display = 'block';
        };
        cerrarMisiones.onclick = () => {
            ventanaMisiones.style.display = 'none';
        };
    }
    
    // Asegurar que el botón esté oculto inicialmente
    if (btnMisiones) {
        btnMisiones.style.display = 'none';
        console.log('🔒 Botón de misiones oculto inicialmente');
    }
    
    cargarMisiones();
    iniciarMisionTemporal();
    actualizarIndicadorMisiones();
});

// Función global para desbloquear el botón de misiones
window.misionesDesbloquearSiCorresponde = function(nivelMonitor) {
    const btn = document.getElementById('misiones-btn');
    if (!btn) return;
    
    console.log('🎯 Nivel monitor:', nivelMonitor, 'Display actual:', btn.style.display);
    
    if (nivelMonitor >= 5) {
        btn.style.display = 'block'; // Asegurar que sea visible
        console.log('🔓 Botón de misiones desbloqueado - mostrando');
        
        // Reiniciar el progreso de todas las misiones
        progreso = {
            clicks: 0,
            auto: 0,
            bitcoin: 0,
            compra: 0
        };
        
        // Reiniciar estado de completado
        estadoMisiones.forEach(m => {
            m.completada = false;
        });
        
        // Reiniciar misión temporal también
        if (misionTemporal) {
            misionTemporal.completada = false;
            progresoTemporal = 0;
        }
        
        console.log('🔄 Progreso de misiones reiniciado');
        
        // Actualizar indicador después de desbloquear
        setTimeout(() => {
            actualizarIndicadorMisiones();
            renderizarMisiones();
        }, 100);
    } else {
        btn.style.display = 'none';
        console.log('🔒 Botón de misiones oculto - nivel insuficiente');
        // Si el botón está oculto, quitar el indicador
        actualizarIndicadorMisiones();
    }
};

function actualizarProgreso(tipo, cantidad = 1) {
    const btnMisiones = document.getElementById('misiones-btn');
    // NO actualizar progreso si el botón de misiones está oculto
    if (!btnMisiones || btnMisiones.style.display === 'none') {
        console.log('⏸️ Progreso ignorado - botón de misiones oculto');
        return;
    }
    
    // Verificar si hay una misión temporal activa del mismo tipo que podría estar ocultando la normal
    if (misionTemporal && !misionTemporal.completada && misionTemporal.tipo === tipo && tiempoRestante > 0) {
        console.log('⏸️ Progreso de misión normal pausado - hay temporal activa del mismo tipo');
        return; // No avanzar la misión normal si está oculta por una temporal
    }
    
    const m = estadoMisiones.find(m => m.tipo === tipo && !m.completada);
    if (!m) {
        console.log('❌ No se encontró misión activa para:', tipo);
        return;
    }
    
    progreso[tipo] += cantidad;
    
    console.log('📈 Progreso:', tipo, progreso[tipo], '/', m.meta, 'Cantidad:', cantidad);
    
    if (progreso[tipo] >= m.meta) {
        progreso[tipo] = m.meta;
        m.completada = true;
        console.log('🎉 MISIÓN COMPLETADA:', tipo);
        actualizarIndicadorMisiones();
    }
    renderizarMisiones();
}

function reclamarMision(idx) {
    const m = estadoMisiones[idx];
    if (!m || !m.completada) return;
    const def = misiones.find(def => def.tipo === m.tipo);
    window.krystal = (window.krystal || 0) + def.recompensa;
    if (typeof actualizarKrystalUI === 'function') {
        actualizarKrystalUI();
    }
    
    // Reinicia la misión con mayor meta y nivel
    m.nivel++;
    m.meta = Math.ceil(def.base * Math.pow(def.incremento, m.nivel - 1));
    m.completada = false;
    progreso[m.tipo] = 0;
    renderizarMisiones();
    actualizarIndicadorMisiones(); // Actualizar indicador después de reclamar
}