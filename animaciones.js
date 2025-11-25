// Mapeo mínimo id <-> itemName (mantener sincronizado con Caja.js)
window._mouseIdMap = {
    // id: itemName
    1: 'Mouse En Llamas',
    2: 'tanque',
    3: 'DruidGamerX',
    4: 'Girar de nuevo',
    5: 'darwin',
    6: 'Stream Deck',
    7: 'Telefono'
};

// Inversa para búsqueda por nombre (normaliza)
window._mouseNameToId = {};
for (const k in window._mouseIdMap) {
    window._mouseNameToId[String(window._mouseIdMap[k]).toLowerCase()] = Number(k);
}

// Convierte el inventory (array de objetos) a string compacta de ids, p.e. "12112"
window.getInventoryIdString = function() {
    try {
        const inv = window.inventory;
        if (typeof inv === 'string') {
            // ya es cadena (puede ser "1,2,1" o JSON); si es JSON array, intentar parsear
            if (/^[0-9,]+$/.test(inv)) return inv;
            try {
                const parsed = JSON.parse(inv);
                if (Array.isArray(parsed)) return parsed.map(it => {
                    if (it && it.id) return String(it.id);
                    if (it && it.itemName) return String(window._mouseNameToId[(it.itemName||'').toLowerCase()] || '');
                    return '';
                }).join(',');
            } catch (e) {
                return inv;
            }
        }
        if (!Array.isArray(inv)) return '';
        return inv.map(it => {
            if (!it) return '';
            if (it.id) return String(it.id);
            if (it.itemName) return String(window._mouseNameToId[(it.itemName||'').toLowerCase()] || '');
            // fallback: intentar por src/alt
            if (it.src) {
                const name = it.src.split('/').pop().replace('.png','').toLowerCase();
                return String(window._mouseNameToId[name] || '');
            }
            if (it.alt) return String(window._mouseNameToId[(it.alt||'').toLowerCase()] || '');
            return '';
        }).join(',');
    } catch (e) {
        return '';
    }
};

// Convierte cadena de ids ("12112" o "1,2,1") en array de objetos.
// Si Caja.js ya define `items` con datos completos, lo usa para clonar objetos completos.
window.parseInventoryIdString = function(idString) {
    const out = [];
    if (typeof idString !== 'string') return out;
    // soportar comas
    const tokens = idString.indexOf(',') !== -1 ? idString.split(',') : idString.split('');
    for (let t of tokens) {
        t = t.trim();
        if (!t) continue;
        if (!/^\d+$/.test(t)) continue;
        const id = Number(t);
        // Si Caja.js definió items completos, reutilizarlos
        if (window.items && Array.isArray(window.items)) {
            const found = window.items.find(it => it.id === id);
            if (found) { out.push(Object.assign({}, found)); continue; }
        }
        // fallback mínimo con nombre conocido
        const name = window._mouseIdMap[id] || ('mouse-' + id);
        out.push({ id:id, itemName: name, src: 'img/Mouse Base.png', alt: name, rarity: 'comun' });
    }
    return out;
};

// Agrega la función crearTextoFlotante al inicio del archivo
function crearTextoFlotante(x, y, texto) {
    const { adjX, adjY } = mapClientToDocumentCoords(x, y);
    const tf = document.createElement('div');
    tf.className = 'texto-flotante';
    tf.textContent = texto;
    tf.style.left = `${Math.round(adjX)}px`;
    tf.style.top = `${Math.round(adjY)}px`;
    document.body.appendChild(tf);
    setTimeout(() => tf.remove(), 1000);
}

// Detecta el factor de escala aplicado a la página (zoom o transform)
function getPageScale() {
    // Preferir zoom inline si está presente
    try {
        const z = document.body && document.body.style && document.body.style.zoom;
        if (z) {
            // soportar '80%' o '0.8' o '80'
            const parsed = parseFloat(String(z).replace('%',''));
            if (!isNaN(parsed)) {
                return parsed > 2 ? parsed / 100 : parsed; // si era '80' -> 0.8
            }
        }
    } catch (e) {}

    // Si no hay zoom, revisar transform matrix
    try {
        const cs = window.getComputedStyle(document.body);
        const t = cs.transform || cs.webkitTransform;
        if (t && t !== 'none') {
            const m = t.match(/matrix\(([-0-9., ]+)\)/);
            if (m) {
                const parts = m[1].split(',').map(p => parseFloat(p.trim()));
                if (parts.length >= 1 && !isNaN(parts[0])) return parts[0];
            }
        }
    } catch (e) {}

    return 1;
}

function mapClientToDocumentCoords(clientX, clientY) {
    const scale = getPageScale() || 1;
    // Si la página está escalada (zoom), mapear coordenadas
    if (scale !== 1) {
        return { adjX: clientX / scale, adjY: clientY / scale };
    }
    return { adjX: clientX, adjY: clientY };
}

// Función para crear partículas al hacer clic
// Función para crear partículas al hacer clic (usa coordenadas globales clientX/clientY)
function crearParticulas(globalX, globalY, cantidad, color) {
    const { adjX, adjY } = mapClientToDocumentCoords(globalX, globalY);
    for (let i = 0; i < cantidad; i++) {
        const particula = document.createElement('div');
        particula.className = 'particle';

        // Posicionar la partícula exactamente donde se hizo clic (coordenadas corregidas)
        particula.style.left = `${Math.round(adjX)}px`;
        particula.style.top = `${Math.round(adjY)}px`;

        // Dirección aleatoria para cada partícula
        const angle = Math.random() * Math.PI * 2; // ángulo aleatorio
        const speed = 0.8 + Math.random() * 1.6; // velocidad aleatoria
        particula.style.setProperty('--particle-dx', Math.cos(angle) * speed);
        particula.style.setProperty('--particle-dy', Math.sin(angle) * speed);

        if (color) {
            particula.style.background = color;
        }

        // Añadir al body para que las coordenadas clientX/clientY coincidan con position:fixed
        document.body.appendChild(particula);

        // Eliminar después de la animación
        setTimeout(() => {
            if (particula.parentNode) particula.parentNode.removeChild(particula);
        }, 700);
    }
}

// Función para crear confeti
function crearConfeti(cantidad) {
    const colores = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < cantidad; i++) {
        const confeti = document.createElement('div');
        confeti.className = 'confeti-piece';
        confeti.style.left = `${Math.random() * 100}vw`;
        confeti.style.setProperty('--confeti-color', colores[Math.floor(Math.random() * colores.length)]);
        confeti.style.animationDelay = `${Math.random() * 2}s`;
        
        document.body.appendChild(confeti);
        
        // Eliminar después de la animación
        setTimeout(() => {
            if (confeti.parentNode) {
                confeti.parentNode.removeChild(confeti);
            }
        }, 3000);
    }
}

// Modificar el evento de clic existente para incluir partículas
if (clicker) {
    clicker.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Usar coordenadas globales (clientX/clientY) para que las partículas salgan desde
        // el punto exacto donde el usuario hizo clic en la ventana.
        const globalX = e.clientX;
        const globalY = e.clientY;

        crearTextoFlotante(globalX, globalY, `+${incremento}`);
        crearParticulas(globalX, globalY, 8, 'radial-gradient(circle, gold, orange)');

        // ... resto del código existente ...
    });
}

// Función para animar componentes nuevos
function animarComponente(componenteId) {
    const componente = document.getElementById(componenteId);
    if (componente) {
        componente.classList.add('componente-nuevo');
        setTimeout(() => {
            componente.classList.remove('componente-nuevo');
        }, 2000);
    }
}

// Función para celebrar nivel subido
function celebrarNivel(componenteId) {
    const componente = document.getElementById(componenteId);
    if (componente) {
        componente.classList.add('nivel-subido');
        crearConfeti(50);
        setTimeout(() => {
            componente.classList.remove('nivel-subido');
        }, 500);
    }
}

// Función global para guardar progreso (ejemplo básico)
window.guardarProgresoUsuario = function() {
    // Recopila los datos que quieras guardar
    let inventoryToSend = [];
    if (Array.isArray(window.inventory)) {
        inventoryToSend = window.inventory;
    } else if (typeof window.inventory === 'string') {
        try {
            // si es string de ids, mantenlo; si es JSON intenta parsear
            if (/^[0-9]+$/.test(window.inventory)) {
                inventoryToSend = window.inventory;
            } else {
                inventoryToSend = JSON.parse(window.inventory);
            }
        } catch {
            inventoryToSend = [];
        }
    }
    const invField = (typeof window.getInventoryIdString === 'function') ? window.getInventoryIdString() :
                     (typeof inventoryToSend === 'string' ? inventoryToSend : JSON.stringify(inventoryToSend));
    const data = {
        bitcoin: window.bitcoin,
        incremento: window.incremento,
        autoclicks: window.autoclicks,
        autoclickerIncrement: window.autoclickerIncrement,
        maxMonedas: window.maxMonedas,
        gabinetepts: window.gabinetepts,
        gabcompradoM: window.gabcompradoM,
        gabcompradoR: window.gabcompradoR,
        gabcompradoC: window.gabcompradoC,
        gabcompradoG: window.gabcompradoG,
        Clevel: window.Clevel,
        Rlevel: window.Rlevel,
        Glevel: window.Glevel,
        Dlevel: window.Dlevel,
        Molevel: window.Molevel,
        Gablevel: window.Gablevel,
        Mlevel: window.Mlevel,
        Elevel: window.Elevel,
        fondoActual: window.fondoActual,
        fondoEquipado: window.fondoEquipado,
        inventario: invField,
        krystal: typeof window.krystal === 'number' ? window.krystal : 10000,
        equippedItemIndex: window.equippedItemIndex !== undefined ? window.equippedItemIndex : null,
        fondos_comprados: window.fondos_comprados ? JSON.stringify(window.fondos_comprados) : null,
        misiones_completadas: window.misiones_completadas ? JSON.stringify(window.misiones_completadas) : null,
        misiones_niveles: window.misiones_niveles ? JSON.stringify(window.misiones_niveles) : null,
        cajas_abiertas: window.cajas_abiertas || 0,
        max_bitcoins: window.max_bitcoins || 0,
        total_clicks: window.total_clicks || 0,
        total_bitcoins: window.total_bitcoins || 0,
        mejoras_compradas: window.mejoras_compradas ? JSON.stringify(window.mejoras_compradas) : null
    };
    fetch('api.php?save=1', {
         method: 'POST',
         credentials: 'same-origin',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify(data)
     })
    .then(res => {
        if (!res.ok) throw new Error('HTTP error ' + res.status);
        return res.json();
    })
    .then(resp => {
        if (resp && resp.ok) {
            //alert('¡Progreso guardado!');
        } else {
            alert('Error al guardar progreso: ' + (resp && resp.error ? resp.error : 'desconocido'));
        }
    })
    .catch(err => alert('Error al guardar progreso: ' + err.message));
};

// Evento para guardar progreso desde configuración
document.addEventListener('DOMContentLoaded', () => {
    const btnGuardar = document.getElementById('guardar-progreso-btn');
    if (btnGuardar) {
        btnGuardar.addEventListener('click', () => {
            if (typeof window.guardarProgresoUsuario === 'function') {
                window.guardarProgresoUsuario();
            } else {
                alert('Función de guardado no disponible.');
            }
        });
    }
});

