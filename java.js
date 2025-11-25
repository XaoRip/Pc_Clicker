document.addEventListener('DOMContentLoaded', () => {
    // --- CARGA DE DATOS DESDE PHP ---
    function cargarDatosUsuario(callback) {
        fetch('api.php?load=1', { credentials: 'same-origin' })
            .then(res => res.json())
            .then(data => {
                if (data && data.ok && data.progress) {
                    bitcoin = Number(data.progress.bitcoin) || 0;
                    incremento = Number(data.progress.incremento) || 1;
                    autoclicks = Number(data.progress.autoclicks) || 0;
                    autoclickerIncrement = Number(data.progress.autoclickerIncrement) || 1;
                    maxMonedas = Number(data.progress.maxMonedas) || 500;
                    gabinetepts = Number(data.progress.gabinetepts) || 0;
                    gabcompradoM = Boolean(Number(data.progress.gabcompradoM));
                    gabcompradoR = Boolean(Number(data.progress.gabcompradoR));
                    gabcompradoC = Boolean(Number(data.progress.gabcompradoC));
                    gabcompradoG = Boolean(Number(data.progress.gabcompradoG));
                    Clevel = Number(data.progress.Clevel) || 0;
                    Rlevel = Number(data.progress.Rlevel) || 0;
                    Glevel = Number(data.progress.Glevel) || 0;
                    Dlevel = Number(data.progress.Dlevel) || 0;
                    Molevel = Number(data.progress.Molevel) || 0;
                    Gablevel = Number(data.progress.Gablevel) || 0;
                    Mlevel = Number(data.progress.Mlevel) || 0;
                    Elevel = Number(data.progress.Elevel) || 0;
                    fondoActual = data.progress.fondoActual || 'img/Fondo base.png';
                    fondoEquipado = data.progress.fondoEquipado || null;
                    try {
                        console.log('Loading inventory from server:', data.progress.inventario);
                        // inventario: puede ser array o string de ids (ej "12112")
                        if (Array.isArray(data.progress.inventario)) {
                            window.inventory = data.progress.inventario;
                            console.log('Loaded array inventory:', window.inventory);
                        } else if (typeof data.progress.inventario === 'string' && data.progress.inventario !== '') {
                            // guardamos la string tal cual; Caja.js la interpretará si está presente
                            window.inventory = data.progress.inventario;
                            console.log('Loaded string inventory:', window.inventory);
                        } else {
                            console.log('No valid inventory found in progress data');
                            window.inventory = [];
                        }
                    } catch (e) {
                        console.error('Error loading inventory:', e);
                        window.inventory = [];
                    }
                    window.krystal = typeof data.progress.krystal === 'number'
                        ? data.progress.krystal
                        : (Number(data.progress.krystal) || 10000);
                    window.equippedItemIndex = data.progress.equippedItemIndex !== null ? Number(data.progress.equippedItemIndex) : undefined;

                    // Indicador: ahora el progreso fue cargado desde la API
                    window._progressLoaded = true;

                    // Si la API devolvió un ARRAY de objetos, migrar inmediatamente a cadena de IDs
                    // y guardar para que la BD deje de contener JSON-objects.
                    if (Array.isArray(data.progress.inventario) && typeof window.getInventoryIdString === 'function') {
                        try {
                            const idStr = window.getInventoryIdString();
                            if (idStr && idStr !== '') {
                                // actualizar la base de datos con la representación de ids
                                guardarDatosUsuario();
                            }
                        } catch (e) {
                            console.error('Error migrando inventario a id-string:', e);
                        }
                    }
                }
                if (typeof callback === 'function') callback();
            });
    }

    // --- GUARDAR DATOS EN PHP ---
    function guardarDatosUsuario() {
        let inventoryToSend = [];
        if (Array.isArray(window.inventory)) {
            inventoryToSend = window.inventory;
        } else if (typeof window.inventory === 'string') {
            // si ya es string de ids guardarlo tal cual; si es JSON, intentar parse
            if (/^[0-9,]+$/.test(window.inventory)) {
                inventoryToSend = window.inventory; // string de ids
            } else {
                try {
                    inventoryToSend = JSON.parse(window.inventory);
                } catch {
                    inventoryToSend = [];
                }
            }
        }
        // Ahora siempre prioriza getInventoryIdString (definida en animaciones.js / Caja.js)
        const invField = (typeof window.getInventoryIdString === 'function') ? window.getInventoryIdString() :
                         (typeof inventoryToSend === 'string' ? inventoryToSend : JSON.stringify(inventoryToSend));
        const data = {
            bitcoin, incremento, autoclicks, autoclickerIncrement, maxMonedas,
            gabinetepts, gabcompradoM, gabcompradoR, gabcompradoC, gabcompradoG,
            Clevel, Rlevel, Glevel, Dlevel, Molevel, Gablevel, Mlevel, Elevel,
            fondoActual, fondoEquipado,
            inventario: invField,
            krystal: typeof window.krystal === 'number' ? window.krystal : 0,
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
                // Progreso guardado correctamente
            } else {
                alert('Error al guardar progreso: ' + (resp && resp.error ? resp.error : 'desconocido'));
            }
        })
        .catch(err => alert('Error al guardar progreso: ' + err.message));
    }

    // Exponer el guardado globalmente para que Caja.js/animaciones.js lo utilicen
    window.guardarProgresoUsuario = guardarDatosUsuario;
    window.guardarDatosUsuario = guardarDatosUsuario;

    // --- VARIABLES PRINCIPALES ---
    let bitcoin = 0, gabinetepts = 0, incremento = 1, autoclicks = 0, autoclickerIncrement = 1, maxMonedas = 500;
    let gabcompradoM = false, gabcompradoR = false, gabcompradoC = false, gabcompradoG = false;
    let Clevel = 0, Rlevel = 0, Glevel = 0, Dlevel = 0, Molevel = 0, Gablevel = 0, Mlevel = 0, Elevel = 0;
    let fondoActual = 'img/Fondo base.png', fondoEquipado = null;
    let tiempo = 5, intervalo, multi = 1, fuegos = 0, gold = 0, Boost = 1, boostactual = 1, luckytelefono = false, inicadotel = false;

    // --- ELEMENTOS DEL DOM ---
    const contador = document.getElementById('contador') || (() => {
        const div = document.createElement('div'); div.id = 'contador'; div.style.display = 'none'; document.body.appendChild(div); return div;
    })();
    const clicker = document.getElementById('clicker');
    const bitcoinElem = document.getElementById('bitcoin');
    const clicksElem = document.getElementById('clicks');
    const autoClicksElem = document.getElementById('auto-clicks');
    const pc = document.getElementById('pc');
    const teclado = document.getElementById('teclado');
    const bitcoinTienda = document.getElementById('bitcoin-tienda');
    const archivosBtn = document.getElementById('archivos');
    const ventanaExplorador = document.getElementById('ventana-explorador');
    const cerrarExploradorBtn = document.querySelector('.cerrar-explorador');
    const configBtn = document.getElementById('config-btn');
    const ventanaConfig = document.getElementById('ventana-config');
    const cerrarConfigBtn = document.querySelector('.cerrar-config');
    const tiendaBtn = document.getElementById('tienda');
    const ventanaTienda = document.getElementById('ventana-tienda');
    const cerrarTiendaBtn = document.querySelector('.cerrar-tienda');
    const mouseImg = document.getElementById('mouse');
    const txtBonus = document.getElementById('Bonus-Celu');

    // --- FUNCIONES DE ACTUALIZACIÓN ---
    function actualizarBitcoin() {
        bitcoinElem.textContent = `Bitcoins: $${formatearNumero(bitcoin)}`;
        if (bitcoinTienda) bitcoinTienda.textContent = `Bitcoins: $${formatearNumero(bitcoin)}`;
        window.bitcoin = bitcoin;
        window.maxMonedas = maxMonedas;

        // Si llegó al máximo, pone el texto en rojo
        if (bitcoin >= maxMonedas) {
            bitcoinElem.style.color = 'red';
            if (bitcoinTienda) bitcoinTienda.style.color = 'red';
        } else {
            bitcoinElem.style.color = '';
            if (bitcoinTienda) bitcoinTienda.style.color = '';
        }
    }
    function actualizarClicks() { clicksElem.textContent = `Poder de Clicks: ${incremento}`; window.incremento = incremento; }
    function actualizarAutoClicks() { autoClicksElem.textContent = `Clicks automáticos: ${autoclicks}`; window.autoclicks = autoclicks; window.autoclickerIncrement = autoclickerIncrement; }
    function actualizarNivelesTienda() {
        document.querySelectorAll('.item').forEach(item => {
            const mejora = item.getAttribute('data-mejora');
            let nivel = 0;
            switch(mejora) {
                case "procesador": nivel = Clevel; break;
                case "ram": nivel = Rlevel; break;
                case "placa-video": nivel = Glevel; break;
                case "disco": nivel = Dlevel; break;
                case "monitor": nivel = Molevel; break;
                case "gabinete": nivel = Gablevel; break;
                case "motherboard": nivel = Mlevel; break;
                case "explorador": nivel = Elevel; break;
            }
            const nivelSpan = item.querySelector('.item-nivel');
            if (nivelSpan) nivelSpan.textContent = `Nivel: ${nivel}`;
        });
    }
    // Nueva función para actualizar precios según nivel
    function actualizarPreciosTienda() {
        document.querySelectorAll('.item').forEach(item => {
            const mejora = item.getAttribute('data-mejora');
            let baseCosto = parseInt(item.getAttribute('data-precio')) || 0;
            let nivel = 0;
            switch(mejora) {
                case "procesador": nivel = Clevel; break;
                case "ram": nivel = Rlevel; break;
                case "placa-video": nivel = Glevel; break;
                case "disco": nivel = Dlevel; break;
                case "monitor": nivel = Molevel; break;
                case "gabinete": nivel = Gablevel; break;
                case "motherboard": nivel = Mlevel; break;
                case "explorador": nivel = Elevel; break;
            }
            let costo = baseCosto;
            if (mejora === "disco") {
                costo = maxMonedas;
            } else {
                for (let i = 1; i <= nivel; i++) {
                    costo = Math.floor(costo * 1.5);
                }
            }
            item.setAttribute('data-costo', costo);
            const btn = item.querySelector('.comprar-btn');
            if (btn) btn.textContent = `Comprar ($${costo})`;
        });
    }
    function formatearNumero(num) {
        num = parseInt(num);
        if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }
    function mostrarAlertaJuego(mensaje, tipo = "error") {
        const alerta = document.getElementById('alerta-juego');
        if (!alerta) return;
        let icono = "⚠️";
        if (tipo === "error") icono = "🚨";
        if (tipo === "ok") icono = "✅";
        if (tipo === "info") icono = "ℹ️";
        alerta.innerHTML = `<span class="icono-alerta">${icono}</span> ${mensaje}`;
        alerta.classList.add('mostrar');
        setTimeout(() => { alerta.classList.remove('mostrar'); }, 2200);
    }
    function crearTextoFlotante(x, y, texto) {
        const tf = document.createElement('div');
        tf.className = 'texto-flotante';
        tf.textContent = texto;
        tf.style.left = `${x}px`;
        tf.style.top = `${y}px`;
        document.body.appendChild(tf);
        setTimeout(() => tf.remove(), 1000);
    }

    // --- FUNCIONES DE MOUSE (portadas desde java(antiguo).js) ---
    function ContadorCelu() {
        tiempo = 5;
        inicadotel = true;
        clearInterval(intervalo);
        intervalo = setInterval(() => {
            tiempo--;
            if (tiempo === 0) {
                clearInterval(intervalo);
                Boost = Math.floor(Math.random() * 120) - 20;
                UpdpCelu();
                tiempo = 5;
                luckytelefono = true;
                boostactual = 1;
                inicadotel = false;
            }
        }, 1000);
    }

    function UpdpCelu() {
        if (txtBonus) txtBonus.style.display = 'none';
        const mouseImgEl = document.getElementById('mouse');
        if (mouseImgEl) mouseImgEl.src = 'img/telefono lucky.png';
    }

    function goldclick(e, incrementoBase) {
        let oroClicks = Math.floor(Math.random() * 32) + 1;
        const mouseImgEl = document.getElementById('mouse');
        const bitcoinElemEl = document.getElementById('bitcoin');
        if (!mouseImgEl || !bitcoinElemEl) return 0;
        const mouseRect = mouseImgEl.getBoundingClientRect();
        const x0 = mouseRect.left + mouseRect.width / 2;
        const y0 = mouseRect.top + mouseRect.height / 2;
        const bitcoinRect = bitcoinElemEl.getBoundingClientRect();
        const x1 = bitcoinRect.left + bitcoinRect.width / 2;
        const y1 = bitcoinRect.top + bitcoinRect.height / 2;
        for (let i = 0; i < oroClicks; i++) {
            setTimeout(() => {
                if (bitcoin < maxMonedas) {
                    bitcoin += incrementoBase;
                    crearEscamaNaranja(x0, y0, x1, y1);
                    actualizarBitcoin();
                }
            }, i * 1);
        }
        return oroClicks * incrementoBase;
    }

    function crearEscamaNaranja(x0, y0, x1, y1) {
        const escamaImgs = ['escama1.png', 'escama2.png', 'escama3.png'];
        const imgSrc = 'img/' + escamaImgs[Math.floor(Math.random() * escamaImgs.length)];
        const escama = document.createElement('img');
        escama.className = 'escama-naranja';
        escama.src = imgSrc;
        escama.style.position = 'fixed';
        escama.style.left = `${x0}px`;
        escama.style.top = `${y0}px`;
        escama.style.width = '18px';
        escama.style.height = '18px';
        escama.style.zIndex = 9999;
        escama.style.pointerEvents = 'none';
        escama.style.opacity = '1';
        escama.style.animation = 'escama-spin 0.7s linear infinite';

        document.body.appendChild(escama);

        // Trayectoria curva: mouse -> bitcoin (círculo grande)
        const angle = Math.random() * 2 * Math.PI;
        const distance = 180 + Math.random() * 120;
        const midX = x0 + Math.cos(angle) * distance;
        const midY = y0 + Math.sin(angle) * distance;

        const duration = 700; // ms
        const start = performance.now();

        function animateEscama(now) {
            const t = Math.min((now - start) / duration, 1);
            const x = (1-t)*(1-t)*x0 + 2*(1-t)*t*midX + t*t*x1;
            const y = (1-t)*(1-t)*y0 + 2*(1-t)*t*midY + t*t*y1;
            escama.style.left = `${x}px`;
            escama.style.top = `${y}px`;
            escama.style.opacity = `${1-t*0.8}`;
            if (t < 1) {
                requestAnimationFrame(animateEscama);
            } else {
                escama.remove();
            }
        }
        requestAnimationFrame(animateEscama);
    }

    function TanqueClick(){
        fuegos++;
    }

    function ContadorTanque() {
        tiempo = 5;
        clearInterval(intervalo);
        intervalo = setInterval(() => {
            tiempo--;
            if (tiempo === 0) {
                clearInterval(intervalo);
                const suma = fuegos * 10;
                bitcoin += suma;
                // Animación de explosión sobre el bitcoin
                explosionBitcoin(suma);
                fuegos = 0;
            }
        }, 1000);
    }

    function explosionBitcoin(suma) {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        const randX = Math.random() * (vw - 200) + 100;
        const randY = Math.random() * (vh - 200) + 100;

        const explosion = document.createElement('div');
        explosion.className = 'explosion-bitcoin';
        explosion.style.position = 'fixed';
        explosion.style.left = `${randX - 80}px`;
        explosion.style.top = `${randY - 80}px`;
        explosion.style.width = '160px';
        explosion.style.height = '160px';
        explosion.style.background = 'radial-gradient(circle, #ff3c00 60%, #ffb347 100%)';
        explosion.style.borderRadius = '50%';
        explosion.style.opacity = '0.85';
        explosion.style.zIndex = 9999;
        explosion.style.pointerEvents = 'none';
        explosion.style.boxShadow = '0 0 40px 20px #ff3c00';
        explosion.style.transition = 'transform 2.5s, opacity 2.5s';

        document.body.appendChild(explosion);

        setTimeout(() => {
            explosion.style.transform = 'scale(2)';
            explosion.style.opacity = '0';
        }, 100);

        setTimeout(() => {
            explosion.remove();
        }, 5000);

        const texto = document.createElement('div');
        texto.textContent = `+${suma} Bitcoins`;
        texto.style.position = 'fixed';
        texto.style.left = `${randX}px`;
        texto.style.top = `${randY - 60}px`;
        texto.style.transform = 'translate(-50%, 0)';
        texto.style.color = '#ff3333';
        texto.style.fontWeight = 'bold';
        texto.style.fontSize = '2.5em';
        texto.style.textShadow = '0 0 8px #ff3333cc';
        texto.style.zIndex = 9999;
        texto.style.pointerEvents = 'none';
        texto.style.opacity = '1';
        texto.style.transition = 'opacity 2.5s, transform 2.5s';

        document.body.appendChild(texto);

        setTimeout(() => {
            texto.style.opacity = '0';
            texto.style.transform = 'translate(-50%, -40px)';
        }, 100);

        setTimeout(() => {
            texto.remove();
        }, 3000);

        actualizarBitcoin();
    }

    function iniciarContador() {
        document.body.classList.remove('red-bg');
        tiempo = 5;
        if (contador) contador.textContent = tiempo;
        clearInterval(intervalo);
        intervalo = setInterval(() => {
            tiempo--;
            if (contador) contador.textContent = tiempo;
            if (tiempo === 0) {
                clearInterval(intervalo);
                fuegos = 0;
                multi = 1;
            }
        }, 1000);
    }

    function Multiplicador() {
        fuegos++;
        multi = 1 + fuegos / 100;
    }
    function llamasclick() {
        iniciarContador();
        Multiplicador();
    }

    // --- INICIALIZACIÓN DESPUÉS DE CARGAR DATOS ---
    cargarDatosUsuario(() => {
        actualizarBitcoin();
        actualizarClicks();
        actualizarAutoClicks();
        actualizarNivelesTienda();
        actualizarPreciosTienda();
        actualizarMonitorPorNivel();

// --- FUNCIÓN PARA ACTUALIZAR IMAGEN DEL MONITOR SEGÚN NIVEL ---
    function actualizarMonitorPorNivel() {
        const monitorImg = document.getElementById('pc');
        const screenDiv = document.querySelector('.screen');
        
        if (monitorImg && screenDiv) {
            // Remover todas las clases de nivel anteriores
            screenDiv.classList.remove('monitor-lv5', 'monitor-lv10', 'monitor-lv15', 'monitor-lv20', 
                                     'monitor-lv25', 'monitor-lv30', 'monitor-lv35', 'monitor-lv40');
            
            // Determinar qué imagen y clase CSS usar según el nivel
            if (Molevel >= 40) {
                monitorImg.src = "img/Monitor lvl-40.png";
                screenDiv.classList.add('monitor-lv40');
            } else if (Molevel >= 35) {
                monitorImg.src = "img/Monitor lvl-35.png";
                screenDiv.classList.add('monitor-lv35');
            } else if (Molevel >= 30) {
                monitorImg.src = "img/Monitor lvl-30.png";
                screenDiv.classList.add('monitor-lv30');
            } else if (Molevel >= 25) {
                monitorImg.src = "img/Monitor lvl-25.png";
                screenDiv.classList.add('monitor-lv25');
            } else if (Molevel >= 20) {
                monitorImg.src = "img/Monitor lvl-20.png";
                screenDiv.classList.add('monitor-lv20');
            } else if (Molevel >= 15) {
                monitorImg.src = "img/Monitor lvl-15.png";
                screenDiv.classList.add('monitor-lv15');
            } else if (Molevel >= 10) {
                monitorImg.src = "img/Monitor lvl-10.png";
                screenDiv.classList.add('monitor-lv10');
            } else if (Molevel >= 5) {
                monitorImg.src = "img/Monitor lvl-5.png";
                screenDiv.classList.add('monitor-lv5');
            } else {
                monitorImg.src = "img/pc.png";
            }
        }
    }

        // --- MOSTRAR BOTÓN DE MISIONES Y CAJA SI CORRESPONDE ---
        const misionesBtn = document.getElementById('misiones-btn');
        const cajaBtn = document.getElementById('caja-btn');
        if (Molevel >= 5) {
            if (misionesBtn) misionesBtn.style.display = 'block';
            if (cajaBtn) cajaBtn.style.display = 'block';
        } else {
            if (misionesBtn) misionesBtn.style.display = 'none';
            if (cajaBtn) cajaBtn.style.display = 'none';
        }

        // --- LISTENERS DE INTERACCIÓN ---
        if (tiendaBtn && ventanaTienda) {
            tiendaBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                ventanaTienda.style.display = 'block';
            });
        }
        if (cerrarTiendaBtn && ventanaTienda) {
            cerrarTiendaBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                ventanaTienda.style.display = 'none';
            });
        }
        if (archivosBtn && ventanaExplorador) {
            archivosBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                ventanaExplorador.style.display = 'block';
            });
        }
        if (cerrarExploradorBtn && ventanaExplorador) {
            cerrarExploradorBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                ventanaExplorador.style.display = 'none';
            });
        }
        if (configBtn && ventanaConfig) {
            configBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                ventanaConfig.style.display = 'block';
            });
        }
        if (cerrarConfigBtn && ventanaConfig) {
            cerrarConfigBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                ventanaConfig.style.display = 'none';
            });
        }
        // Listener para abrir/cerrar la ventana de cajas
        const ventanaCaja = document.getElementById('ventana-caja');
        const cerrarCajaBtn = document.querySelector('.cerrar-caja');
        if (cajaBtn && ventanaCaja) {
            cajaBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                ventanaCaja.style.display = 'block';
            });
        }
        if (cerrarCajaBtn && ventanaCaja) {
            cerrarCajaBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                ventanaCaja.style.display = 'none';
            });
        }
        // Listener para abrir/cerrar la ventana de misiones
        const ventanaMisiones = document.getElementById('ventana-misiones');
        const cerrarMisionesBtn = document.querySelector('.cerrar-misiones');
        if (misionesBtn && ventanaMisiones) {
            misionesBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                ventanaMisiones.style.display = 'block';
            });
        }
        if (cerrarMisionesBtn && ventanaMisiones) {
            cerrarMisionesBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                ventanaMisiones.style.display = 'none';
            });
        }

        // --- COMPRAS EN LA TIENDA ---
        document.querySelectorAll('.comprar-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const item = this.closest('.item');
                const mejora = item.getAttribute('data-mejora');
                let costo = parseInt(item.getAttribute('data-costo'));
                let nuevoCosto;
                if (bitcoin >= costo) {
                    switch(mejora) {
                        case "procesador":
                            if (!gabcompradoC && gabinetepts < 1) { mostrarAlertaJuego('Tu gabinete no tiene capacidad para este producto'); return; }
                            if (Clevel >= Mlevel) { mostrarAlertaJuego('El nivel del procesador no puede ser mayor que el de la motherboard'); return; }
                            if (gabcompradoC) { Clevel += 1; incremento *= 2; } else { gabinetepts -= 1; gabcompradoC = true; Clevel += 1; incremento += 1; }
                            actualizarClicks();
                            break;
                        case "ram":
                            if (!gabcompradoR && gabinetepts < 1) { mostrarAlertaJuego('Tu gabinete no tiene capacidad para este producto'); return; }
                            if (gabcompradoR) { Rlevel += 1; autoclickerIncrement += 1; autoclicks += autoclickerIncrement; } else { gabinetepts -= 1; gabcompradoR = true; Rlevel += 1; autoclickerIncrement += 1; autoclicks += autoclickerIncrement; }
                            actualizarAutoClicks();
                            break;
                        case "placa-video":
                            if (!gabcompradoG && gabinetepts < 1) { mostrarAlertaJuego('Tu gabinete no tiene capacidad para este producto'); return; }
                            if (Glevel >= Mlevel) { mostrarAlertaJuego('Esta placa de video no es compatible con la motherboard'); return; }
                            if (gabcompradoG) { Glevel += 1; } else { gabinetepts -= 1; gabcompradoG = true; Glevel += 1; }
                            break;
                        case "disco":
                            Dlevel += 1; maxMonedas = maxMonedas * 2; nuevoCosto = maxMonedas; break;
                        case "monitor":
                            Molevel += 1;
                            actualizarMonitorPorNivel(); 
                            break;
                        case "gabinete":
                            if (gabinetepts >= 10) { mostrarAlertaJuego('¡Has alcanzado el nivel máximo de gabinete!'); return; }
                            Gablevel += 1; gabinetepts += 1;
                            if (Gablevel === 5) { const tecladoImg = document.getElementById('teclado'); tecladoImg.src = 'img/teclado-lv5.png'; }
                            if (Gablevel >= 10 && Gablevel % 10 === 0) { const gabineteImg = document.getElementById('gabinete'); gabineteImg.src = `img/gabinete-lv${Gablevel}.png`; gabineteImg.classList.add('gabinete-mejorado'); }
                            else { const gabineteImg = document.getElementById('gabinete'); gabineteImg.classList.remove('gabinete-mejorado'); }
                            break;
                        case "motherboard":
                            if (!gabcompradoM && gabinetepts < 1) { mostrarAlertaJuego('Tu gabinete no tiene capacidad para este producto'); return; }
                            if (gabcompradoM) { Mlevel += 1; } else { gabinetepts -= 1; gabcompradoM = true; Mlevel += 1; }
                            break;
                        case "explorador":
                            Elevel += 1;
                            document.querySelector('.container').style.backgroundImage = "url('img/fondo_personalizado.png')";
                            break;
                    }
                    if (mejora !== "disco") { nuevoCosto = Math.floor(costo * 1.5); item.setAttribute('data-costo', nuevoCosto); }
                    else { nuevoCosto = maxMonedas; item.setAttribute('data-costo', nuevoCosto); }
                    bitcoin -= costo;
                    actualizarBitcoin();
                    actualizarNivelesTienda();
                    actualizarPreciosTienda();
                    guardarDatosUsuario();
                    item.style.transform = 'scale(1.05)';
                    setTimeout(() => item.style.transform = 'scale(1)', 200);
                    if (window.misionesCompra) window.misionesCompra();
                    if (mejora === "monitor" && window.misionesDesbloquearSiCorresponde) window.misionesDesbloquearSiCorresponde(Molevel);
                } else {
                    mostrarAlertaJuego("¡No tienes suficientes bitcoins!");
                }
            });
        });

        // --- FONDOS EN EXPLORADOR ---
        document.querySelectorAll('.area-archivos .archivo[data-fondo]').forEach(fondo => {
            fondo.addEventListener('click', function() {
                let precioSpan = this.querySelectorAll('span')[1];
                let precio = 0;
                if (precioSpan) {
                    const match = precioSpan.textContent.match(/\$(\d+)/);
                    if (match) precio = parseInt(match[1]);
                } else {
                    precio = parseInt(this.getAttribute('data-precio'));
                }
                const nombreFondo = this.getAttribute('data-fondo');
                const rutaFondo = `img/${nombreFondo}.png`;
                if (fondoEquipado === rutaFondo) {
                    fondoEquipado = null;
                    document.querySelector('.container').style.backgroundImage = `url('${fondoActual}')`;
                    mostrarAlertaJuego('Fondo desactivado. ¡Has vuelto al fondo base!', 'info');
                    document.querySelectorAll('.area-archivos .archivo[data-fondo]').forEach(f => f.classList.remove('equipado'));
                    guardarDatosUsuario();
                    return;
                }
                if (bitcoin >= precio || this.classList.contains('comprado')) {
                    if (!this.classList.contains('comprado')) {
                        bitcoin -= precio;
                        mostrarAlertaJuego('¡Fondo comprado y equipado con éxito!', 'ok');
                        this.classList.add('comprado');
                    } else {
                        mostrarAlertaJuego('¡Fondo equipado!', 'ok');
                    }
                    fondoEquipado = rutaFondo;
                    document.querySelector('.container').style.backgroundImage = `url('${rutaFondo}')`;
                    actualizarBitcoin();
                    document.querySelectorAll('.area-archivos .archivo[data-fondo]').forEach(f => f.classList.remove('equipado'));
                    this.classList.add('equipado');
                    guardarDatosUsuario();
                } else {
                    mostrarAlertaJuego('No tienes suficientes bitcoins para comprar este fondo');
                }
            });
        });

        // --- GUARDAR PROGRESO DESDE CONFIGURACIÓN ---
        const btnGuardar = document.getElementById('guardar-progreso-btn');
        if (btnGuardar) {
            btnGuardar.addEventListener('click', () => {
                guardarDatosUsuario();
                alert('¡Progreso guardado!');
            });
        }

        // --- INICIALIZACIÓN FINAL ---
        actualizarBitcoin();
        actualizarClicks();
        actualizarAutoClicks();
        actualizarNivelesTienda();
        actualizarPreciosTienda();
        window.addEventListener('resize', () => {
            actualizarBitcoin();
            actualizarClicks();
            actualizarAutoClicks();
            actualizarNivelesTienda();
        });

        // --- CLICK MANUAL EN EL CLICKER ---
        if (clicker) {
                clicker.replaceWith(clicker.cloneNode(true));
                const newClicker = document.getElementById('clicker');
                newClicker.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                let incrementoClick = incremento;
                // Si no hay mouse equipado, solo sumar bitcoins y mostrar texto flotante
                if (window.equippedItemIndex === undefined) {
                    bitcoin += incrementoClick;
                    if (bitcoin > maxMonedas) bitcoin = maxMonedas;
                    actualizarBitcoin();
                    crearTextoFlotante(e.clientX, e.clientY, `+${incrementoClick}`);
                    guardarDatosUsuario();
                    // MISIÓN: click manual y bitcoins ganados SOLO si no está en el máximo
                    if (bitcoin < maxMonedas) {
                        if (window.misionesClickManual) window.misionesClickManual();
                        if (window.misionesBitcoin) window.misionesBitcoin(incrementoClick);
                    }
                    return;
                }
                // Lógica por mouse (ported desde la versión antigua)
                // Comportamientos soportados: druid, llamas, darwin, tanque, telefono
                if (window.druid === true) {
                    // 50% de probabilidad de x2, sino 0
                    if (Math.random() < 0.5) {
                        incrementoClick *= 2;
                    } else {
                        incrementoClick = 0;
                    }
                } else if (window.llamas === true) {
                    // Llamas: multiplicador basado en 'fuegos' temporal
                    // Iniciar contador solo si no está ya activo
                    if (tiempo === 5 && typeof iniciarContador === 'function') iniciarContador();
                    // aumentar contador de fuegos y recalcular multiplicador
                    if (typeof Multiplicador === 'function') Multiplicador();
                    incrementoClick *= multi;
                    if (incrementoClick < 1) incrementoClick = 1;
                } else if (window.darwin === true) {
                    // Darwin: genera muchas "escamas" y suma múltiples veces
                    if (typeof goldclick === 'function') {
                        const ganado = goldclick(e, incremento);
                        incrementoClick = ganado;
                    }
                } else if (window.tanque === true) {
                    // Tanque: cada click agrega fuegos; al terminar el contador explota y otorga bitcoin
                    if (fuegos < 1 && typeof ContadorTanque === 'function') {
                        ContadorTanque();
                    }
                    if (typeof TanqueClick === 'function') TanqueClick();
                    // No añadimos bitcoins en el click directo
                    return;
                } else if (window.telefono === true) {
                    // Telefono: activa contador y aplica boost temporal
                    if (inicadotel === false && typeof ContadorCelu === 'function') {
                        ContadorCelu();
                    }
                    incrementoClick *= boostactual;
                }

                // Crear texto flotante salvo cuando darwin ya creó sus propias animaciones
                if (!window.darwin) {
                    let incrementoFormateado = Number.isInteger(incrementoClick) ? incrementoClick : incrementoClick.toFixed(2);
                    crearTextoFlotante(e.clientX, e.clientY, `+${incrementoFormateado}`);
                }

                bitcoin += incrementoClick;
                if (bitcoin > maxMonedas) bitcoin = maxMonedas;
                actualizarBitcoin();
                guardarDatosUsuario();
                if (bitcoin < maxMonedas) {
                    if (window.misionesClickManual) window.misionesClickManual();
                    if (window.misionesBitcoin) window.misionesBitcoin(incrementoClick);
                }
            });
        }

        // --- SISTEMA DE CLICKS AUTOMÁTICOS ---
        setInterval(() => {
            if (autoclicks > 0) {
                if (bitcoin < maxMonedas) {
                    bitcoin += autoclicks;
                    if (bitcoin > maxMonedas) bitcoin = maxMonedas;
                    actualizarBitcoin();
                    guardarDatosUsuario();
                    // MISIÓN: autoclicks y bitcoins ganados
                    if (window.misionesAutoClick) window.misionesAutoClick(autoclicks);
                    if (window.misionesBitcoin) window.misionesBitcoin(autoclicks);
                } else {
                    actualizarBitcoin();
                }
            }
        }, 1000);
    });
});