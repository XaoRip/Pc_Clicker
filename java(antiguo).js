document.addEventListener('DOMContentLoaded', () => {
    let bitcoin = 5000;
    let gabinetepts = 0;
    let incremento = 1;
    let autoclicks = 0;
    let autoclickerIncrement = 1;
    let maxMonedas = 5000;   
    let gabcompradoM = false;
    let gabcompradoR = false;
    let gabcompradoC = false;
    let gabcompradoG = false;
    let Clevel = 0;
    let Rlevel = 0;
    let Glevel = 0;
    let Dlevel = 0;
    let Molevel = 0;
    let Gablevel = 0;
    let Mlevel = 0;
    let Elevel = 0;
    let AutoBit = 4000/Glevel;
    let fondoActual = 'img/Fondo base.png';
    let fondoEquipado = null;
    let tiempo = 5;
    let intervalo;
    let multi = 1;
    let fuegos = 0;
    let gold = 0;
    let Boost = 1;
    let boostactual = 1;
    let luckytelefono = false;
    let inicadotel = false;
    const contador = document.getElementById('contador');

    // Elementos del DOM
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
    const ventanaExplorador2 = document.getElementById('ventana-explorador');
    const barraExplorador = document.querySelector('.barra-explorador');
    const configBtn = document.getElementById('config-btn');
    const ventanaConfig = document.getElementById('ventana-config');
    const cerrarConfigBtn = document.querySelector('.cerrar-config');
    const tiendaBtn = document.getElementById('tienda');
    const ventanaTienda = document.getElementById('ventana-tienda');
    const cerrarTiendaBtn = document.querySelector('.cerrar-tienda');
    const cajaBtn = document.getElementById('caja-btn');
    const ventanaCaja = document.getElementById('ventana-caja');
    const cerrarCajaBtn = document.querySelector('.cerrar-caja');
    const mouseImg = document.getElementById('mouse');
    const txtBonus = document.getElementById('Bonus-Celu');

    if (mouseImg) {
        mouseImg.addEventListener('click', (e) => {
            if (window.telefono === true) {
                if (luckytelefono === false) {
                mouseImg.src = 'img/Mouse Telefono sb.png';
                txtBonus.textContent = `¡BONUS!: ${Boost}`;
                boostactual = Boost;
                txtBonus.style.display = 'block';
                }
            }
        });
    }

function ContadorCelu() {
    tiempo = 5;
    inicadotel = true;
    clearInterval(intervalo);
    intervalo = setInterval(() => {
        tiempo--;
        if (tiempo === 0) {
            clearInterval(intervalo);
            Boost = Math.floor(Math.random() * 120)- 20;
            UpdpCelu();
            tiempo = 5;
            luckytelefono = true;
            boostactual = 1;
            inicadotel = false;
        }
    }, 1000);
}

function UpdpCelu() {
    txtBonus.style.display = 'none';
    mouseImg.src = 'img/telefono lucky.png';

}
    
function goldclick(e, incrementoBase) {
    let oroClicks = Math.floor(Math.random() * 32) + 1;
    const mouseImg = document.getElementById('mouse');
    const bitcoinElem = document.getElementById('bitcoin');
    if (!mouseImg || !bitcoinElem) return 0;
    const mouseRect = mouseImg.getBoundingClientRect();
    const x0 = mouseRect.left + mouseRect.width / 2;
    const y0 = mouseRect.top + mouseRect.height / 2;
    const bitcoinRect = bitcoinElem.getBoundingClientRect();
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
        // Bezier cuadrático: P0 (x0,y0), P1 (midX,midY), P2 (x1,y1)
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

// Animación de explosión y texto rojo sobre el bitcoin
function explosionBitcoin(suma) {
    // Posición aleatoria en la pantalla
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const randX = Math.random() * (vw - 200) + 100; // evita los bordes
    const randY = Math.random() * (vh - 200) + 100;

    // Crear explosión visual
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

    // Texto flotante rojo en la misma posición
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

    // Actualizar visualización
    actualizarBitcoin();
}

function iniciarContador() {
            document.body.classList.remove('red-bg');
            tiempo = 5;
            contador.textContent = tiempo;
            clearInterval(intervalo);
            intervalo = setInterval(() => {
                tiempo--;
                contador.textContent = tiempo;
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

    // Función para formatear números grandes
    function formatearNumero(num) {
        num = parseInt(num);
        if (num >= 1000000000) {
            const valor = num / 1000000000;
            return valor % 1 === 0 ? valor + 'B' : valor.toFixed(1) + 'B';
        }
        if (num >= 1000000) {
            const valor = num / 1000000;
            return valor % 1 === 0 ? valor + 'M' : valor.toFixed(1) + 'M';
        }
        if (num >= 1000) {
            const valor = num / 1000;
            return valor % 1 === 0 ? valor + 'K' : valor.toFixed(1) + 'K';
        }
        return num.toString();
    }

    // Configuración inicial de estilos
    if (clicker) {
        clicker.style.zIndex = '9999'; // Asegura que esté encima de todo
        clicker.style.pointerEvents = 'auto'; // Permite clicks
        clicker.style.display = 'block'; // Asegura que esté visible
        clicker.style.transition = 'transform 0.1s ease-out';
        clicker.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            let incrementoClick = incremento;
            // Si no hay mouse equipado, solo sumar bitcoins y mostrar texto flotante
            if (window.equippedItemIndex === undefined) {
                bitcoin += incrementoClick;
                if (bitcoin > maxMonedas) bitcoin = maxMonedas;
                actualizarBitcoin();
                crearTextoFlotante(e.clientX, e.clientY, `+${incrementoClick}`);
                // MISIÓN: click manual y bitcoins ganados SOLO si no está en el máximo
                if (bitcoin < maxMonedas) {
                    if (window.misionesClickManual) window.misionesClickManual();
                    if (window.misionesBitcoin) window.misionesBitcoin(incrementoClick);
                }
                return;
            }
            if (window.druid === true) {
                if (Math.random() < 0.5) {
                    incrementoClick *= 2;
                } else {
                    incrementoClick = 0;
                }
            }
            else if (window.llamas === true) {
                llamasclick();
                incrementoClick *= multi;
                if (incrementoClick < 1) incrementoClick = 1;
            }
            else if (window.darwin === true) {
                let ganado = goldclick(e, incremento);
                incrementoClick = ganado;
            } else if (window.tanque === true) {
                if(fuegos < 1){
                    ContadorTanque();
                }
                TanqueClick();
                return;
            }
            else if (window.telefono === true) {
                if (inicadotel === false) {
                    ContadorCelu();
                }
                incrementoClick *= boostactual;
            }
            else if (window.darwin){
                // escama normal para click manual
                const mouseImg = document.getElementById('mouse');
                const bitcoinElem = document.getElementById('bitcoin');
                if (mouseImg && bitcoinElem) {
                    const mouseRect = mouseImg.getBoundingClientRect();
                    const x0 = mouseRect.left + mouseRect.width / 2;
                    const y0 = mouseRect.top + mouseRect.height / 2;
                    const bitcoinRect = bitcoinElem.getBoundingClientRect();
                    const x1 = bitcoinRect.left + bitcoinRect.width / 2;
                    const y1 = bitcoinRect.top + bitcoinRect.height / 2;
                    crearEscamaNaranja(x0, y0, x1, y1);
                }
            }
            // Solo muestra decimales si no es entero
            let incrementoFormateado;
            if (Number.isInteger(incrementoClick)) {
                incrementoFormateado = incrementoClick;
            } else {
                incrementoFormateado = incrementoClick.toFixed(2);
            }
            // Solo mostrar el texto flotante si no es darwin (ya lo muestra goldclick)
            if (!window.darwin) {
                crearTextoFlotante(e.clientX, e.clientY, `+${incrementoFormateado}`);
            }
            bitcoin += incrementoClick;
            if (bitcoin > maxMonedas) bitcoin = maxMonedas;
            actualizarBitcoin();
            // MISIÓN: click manual y bitcoins ganados SOLO si no está en el máximo
            if (bitcoin < maxMonedas) {
                if (window.misionesClickManual) window.misionesClickManual();
                if (window.misionesBitcoin) window.misionesBitcoin(incrementoClick);
            }
        });
    }
    if (pc) pc.style.pointerEvents = 'none';
    if (teclado) teclado.style.pointerEvents = 'none';

    // Función para actualizar la visualización de bitcoins
    function actualizarBitcoin() {
        bitcoinElem.textContent = `Bitcoins: $${bitcoin}`;
        if (bitcoin >= maxMonedas) {
            bitcoinElem.style.color = '#ff3333';
            bitcoinElem.style.fontWeight = 'bold';
            bitcoinElem.style.textShadow = '0 0 8px #ff3333cc';
        } else {
            bitcoinElem.style.color = '';
            bitcoinElem.style.fontWeight = '';
            bitcoinElem.style.textShadow = '';
        }
        const bitcoinFormateado = formatearNumero(bitcoin);
        bitcoinElem.textContent = `Bitcoins: $${bitcoinFormateado}`;
        if (bitcoinTienda) {
            bitcoinTienda.textContent = `Bitcoins: $${bitcoinFormateado}`;
        }
    }

    // Función para actualizar la visualización de clicks por clic
    function actualizarClicks() {
        clicksElem.textContent = `Poder de Clicks: ${incremento}`;
    }

    // Función para actualizar la visualización de clicks automáticos
    function actualizarAutoClicks() {
        autoClicksElem.textContent = `Clicks automáticos: ${autoclicks}`;
    }

    // Función para crear texto flotante que aparece en la posición del mouse (ajustado por zoom) y se desvanece
    function crearTextoFlotante(x, y, texto) {
        // Ajustar por zoom al 80%
        const zoom = 0.8;
        const realX = x / zoom;
        const realY = y / zoom;
        const efecto = document.createElement('div');
        efecto.className = 'click-effect';
        efecto.textContent = texto;
        efecto.style.position = 'fixed';
        efecto.style.left = `${realX}px`;
        efecto.style.top = `${realY}px`;
        efecto.style.pointerEvents = 'none';
        efecto.style.zIndex = 9999;
        document.body.appendChild(efecto);
        setTimeout(() => {
            efecto.style.opacity = '0';
            efecto.style.transform = 'translateY(-40px) scale(1.2)';
        }, 10);
        setTimeout(() => {
            efecto.remove();
        }, 700);
    }

    // Función para actualizar niveles en la tienda
    function actualizarNivelesTienda() {
        document.querySelectorAll('.item').forEach(item => {
            const mejora = item.getAttribute('data-mejora');
            const nivelElem = item.querySelector('.item-nivel');
            const btnComprar = item.querySelector('.comprar-btn');
            const costo = parseInt(item.getAttribute('data-costo'));
            const costoFormateado = formatearNumero(costo);
            
            if (nivelElem) {
                let nivel;
                switch(mejora) {
                    case 'procesador': nivel = Clevel; break;
                    case 'ram': nivel = Rlevel; break;
                    case 'placa-video': nivel = Glevel; break;
                    case 'disco': nivel = Dlevel; break;
                    case 'monitor': nivel = Molevel; break;
                    case 'gabinete': nivel = Gablevel; break;
                    case 'motherboard': nivel = Mlevel; break;
                    case 'explorador': nivel = Elevel; break;
                    default: nivel = 0;
                }
                nivelElem.textContent = `Nivel: ${nivel}`;
            }
            
            if (btnComprar) {
                btnComprar.textContent = `Comprar ($${costoFormateado})`;
            }
        });
    }


    setInterval(() => {
        if (bitcoin >= maxMonedas) {
            bitcoin = maxMonedas;
        }
        if (gabcompradoG == true) {
            // Solo sumar autoclicks y misiones si no está en el máximo
            if (bitcoin < maxMonedas) {
                bitcoin += autoclicks;
                if (bitcoin > maxMonedas) bitcoin = maxMonedas;
                actualizarBitcoin();
                // MISIÓN: autoclicks y bitcoins ganados
                if (window.misionesAutoClick) window.misionesAutoClick(autoclicks);
                if (window.misionesBitcoin) window.misionesBitcoin(autoclicks);
            } else {
                actualizarBitcoin();
            }
        }
    }, AutoBit);

    // --- TIENDA ---
    if (tiendaBtn && ventanaTienda) {
        tiendaBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            ventanaTienda.style.display = ventanaTienda.style.display === 'none' ? 'flex' : 'none';
            actualizarNivelesTienda();
        });
    }

    if (cerrarTiendaBtn && ventanaTienda) {
        cerrarTiendaBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            ventanaTienda.style.display = 'none';
        });
    }

    // --- EXPLORADOR DE ARCHIVOS ---
    if (archivosBtn && ventanaExplorador) {
        archivosBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            ventanaExplorador.style.display = 'flex';
        });
    }

    if (cerrarExploradorBtn && ventanaExplorador) {
        cerrarExploradorBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            ventanaExplorador.style.display = 'none';
        });
    }

    // --- CAJA (Case Opening) ---
    if (cajaBtn && ventanaCaja) {
        cajaBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            ventanaCaja.style.display = 'flex';
        });
    }
    if (cerrarCajaBtn && ventanaCaja) {
        cerrarCajaBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            ventanaCaja.style.display = 'none';
        });
    }

    // Botones de compra directa
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
                        if (!gabcompradoC && gabinetepts < 1) {
                            mostrarAlertaJuego('Tu gabinete no tiene capacidad para este producto');
                            return;
                        }
                        if (Clevel >= Mlevel) {
                            mostrarAlertaJuego('El nivel del procesador no puede ser mayor que el de la motherboard');
                            return;
                        }
                        if (gabcompradoC == true){
                        Clevel += 1;
                        incremento += 1;
                        actualizarClicks();
                        } else {
                            gabinetepts -= 1;
                            gabcompradoC=true;   
                            Clevel += 1;
                            incremento += 1;
                            actualizarClicks();
                        }
                    break;
                        
                    case "ram":
                        if (!gabcompradoR && gabinetepts < 1) {
                            mostrarAlertaJuego('Tu gabinete no tiene capacidad para este producto');
                            return;
                        }
                        if (gabcompradoR == true){
                            Rlevel += 1;
                            autoclickerIncrement += 1;
                            autoclicks += autoclickerIncrement;
                            actualizarAutoClicks();
                        } else {
                            gabinetepts -= 1;
                            gabcompradoR=true;   
                            Rlevel += 1;
                            autoclickerIncrement += 1;
                            autoclicks += autoclickerIncrement;
                            actualizarAutoClicks();
                        }
                        break;
                        
                    case "placa-video":
                        if (!gabcompradoG && gabinetepts < 1) {
                            mostrarAlertaJuego('Tu gabinete no tiene capacidad para este producto');
                            return;
                        }
                            if (Glevel >= Mlevel) {
                            mostrarAlertaJuego('Esta placa de video no es compatible con la motherboard');
                            return;
                        }
                        if (gabcompradoG == true){
                            Glevel += 1;
                        } else {
                            gabinetepts -= 1;
                            gabcompradoG=true;   
                            Glevel += 1;
                            AutoBit = 4000;
                        }
                        break;
                        
                    case "disco":
                        Dlevel += 1;
                        maxMonedas = maxMonedas * 2;
                        nuevoCosto = maxMonedas;
                        break;
                        
                    case "monitor":
                        Molevel += 1;
                        const monitorImg = document.getElementById('pc');
                        const screenDiv = document.querySelector('.screen');
                        if (Molevel >= 5) {
                            monitorImg.src = "img/monitor-lv5.png";
                            screenDiv.classList.add('monitor-lv5');
                            screenDiv.classList.add('mouse-lv5')
                        } else {
                            monitorImg.src = "img/pc.png";
                            screenDiv.classList.remove('monitor-lv5');
                        }
                        break;
                        
                   case "gabinete":
                        if (gabinetepts >= 10) {
                            mostrarAlertaJuego('¡Has alcanzado el nivel máximo de gabinete!');
                            return;
                        }
                        Gablevel += 1;
                        gabinetepts += 1;
                        
                        if (Gablevel === 5) {
                            const tecladoImg = document.getElementById('teclado');
                            tecladoImg.src = 'img/teclado-lv5.png';
                            
                        }
                        
                        if (Gablevel >= 10 && Gablevel % 10 === 0) {
                            const gabineteImg = document.getElementById('gabinete');
                            gabineteImg.src = `img/gabinete-lv${Gablevel}.png`;
                            gabineteImg.classList.add('gabinete-mejorado');
                        } else {
                            const gabineteImg = document.getElementById('gabinete');
                            gabineteImg.classList.remove('gabinete-mejorado');
                        }
                        break;
                        
                    case "motherboard":
                        if (!gabcompradoM && gabinetepts < 1) {
                            mostrarAlertaJuego('Tu gabinete no tiene capacidad para este producto');
                            return;
                        }
    
                        if (gabcompradoM) {
                            Mlevel += 1;
                        } else {
                        gabinetepts -= 1;
                        gabcompradoM = true;
                        Mlevel += 1;    
                         }
                        break;
                    case "explorador":
                        Elevel += 1;
                        document.querySelector('.container').style.backgroundImage = "url('img/fondo_personalizado.png')";
                        break;
                }

                if (mejora !== "disco") {
                    nuevoCosto = Math.floor(costo * 1.5);
                    item.setAttribute('data-costo', nuevoCosto);
                } else {
                    nuevoCosto = maxMonedas;
                    item.setAttribute('data-costo', nuevoCosto);
                }

                bitcoin -= costo;
                actualizarBitcoin();
                actualizarNivelesTienda();
                
                item.style.transform = 'scale(1.05)';
                setTimeout(() => item.style.transform = 'scale(1)', 200);

                // MISIÓN: compra
                if (window.misionesCompra) window.misionesCompra();

                // Si la compra fue de monitor, desbloquea el botón de misiones
                if (mejora === "monitor" && window.misionesDesbloquearSiCorresponde) {
                    window.misionesDesbloquearSiCorresponde(Molevel);
                }
                
            } else {
                // Cuando no hay bitcoins suficientes
                mostrarAlertaJuego("¡No tienes suficientes bitcoins!");
            }
        });
    });

    // Hacer la ventana del explorador arrastrable y limitada a la pantalla
    if (ventanaExplorador2 && barraExplorador) {
        makeDraggableLimitado(ventanaExplorador2, barraExplorador, false);
    }

    // Hacer la ventana de misiones arrastrable y limitada a la pantalla
    const ventanaMisiones = document.getElementById('ventana-misiones');
    const barraMisiones = document.querySelector('.barra-misiones');
    if (ventanaMisiones && barraMisiones) {
        makeDraggableLimitado(ventanaMisiones, barraMisiones, false);
    }
    
    // Manejar clics en los fondos del explorador
    document.querySelectorAll('.area-archivos .archivo[data-fondo]').forEach(fondo => {
        fondo.addEventListener('click', function() {
            // El precio real es el valor mostrado en el segundo <span> (ej: ($15000))
            let precioSpan = this.querySelectorAll('span')[1];
            let precio = 0;
            if (precioSpan) {
                // Extraer número de ($15000) o ($5500)
                const match = precioSpan.textContent.match(/\$(\d+)/);
                if (match) precio = parseInt(match[1]);
            } else {
                // Fallback al atributo data-precio
                precio = parseInt(this.getAttribute('data-precio'));
            }
            const nombreFondo = this.getAttribute('data-fondo');
            const rutaFondo = `img/${nombreFondo}.png`;

            // Si ya está equipado, al hacer click lo desactiva (vuelve al fondo base)
            if (fondoEquipado === rutaFondo) {
                fondoEquipado = null;
                document.querySelector('.container').style.backgroundImage = `url('${fondoActual}')`;
                mostrarAlertaJuego('Fondo desactivado. ¡Has vuelto al fondo base!', 'info');
                // Quitar clase 'equipado' de todos
                document.querySelectorAll('.area-archivos .archivo[data-fondo]').forEach(f => f.classList.remove('equipado'));
                return;
            }

            // Si no está equipado, intenta comprar o equipar
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

                // Quitar clase 'equipado' de todos y poner solo al actual
                document.querySelectorAll('.area-archivos .archivo[data-fondo]').forEach(f => f.classList.remove('equipado'));
                this.classList.add('equipado');
            } else {
                mostrarAlertaJuego('No tienes suficientes bitcoins para comprar este fondo');
            }
        });
    });

    // Sistema de clicks automáticos
    setInterval(() => {
        if (autoclicks > 0) {
            // Solo sumar autoclicks y misiones si no está en el máximo
            if (bitcoin < maxMonedas) {
                bitcoin += autoclicks;
                if (bitcoin > maxMonedas) bitcoin = maxMonedas;
                actualizarBitcoin();
                // MISIÓN: autoclicks y bitcoins ganados
                if (window.misionesAutoClick) window.misionesAutoClick(autoclicks);
                if (window.misionesBitcoin) window.misionesBitcoin(autoclicks);
            } else {
                actualizarBitcoin();
            }
        }
    }, 1000);

    // Función para posicionar elementos relativos
    function positionElements() {
        actualizarBitcoin();
        actualizarClicks();
        actualizarAutoClicks();
    }

    // Función para hacer elementos arrastrables y que no se salgan de la pantalla
    function makeDraggableLimitado(ventana, barra, permitirMover) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (!permitirMover) barra.onmousedown = dragMouseDown;
        else barra.onmousedown = dragMouseDown;
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            let newTop = ventana.offsetTop - pos2;
            let newLeft = ventana.offsetLeft - pos1;
            // Limitar a la pantalla solo si permitirMover es true
            if (permitirMover) {
                const minLeft = 0;
                const minTop = 0;
                const maxLeft = window.innerWidth - ventana.offsetWidth;
                const maxTop = window.innerHeight - ventana.offsetHeight;
                if (newLeft < minLeft) newLeft = minLeft;
                if (newTop < minTop) newTop = minTop;
                if (newLeft > maxLeft) newLeft = maxLeft;
                if (newTop > maxTop) newTop = maxTop;
            }
            ventana.style.left = newLeft + "px";
            ventana.style.top = newTop + "px";
        }
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Mostrar ventana de configuración
    if (configBtn && ventanaConfig) {
        configBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            ventanaConfig.style.display = 'block';
        });
    }

    // Cerrar ventana
    if (cerrarConfigBtn && ventanaConfig) {
        cerrarConfigBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            ventanaConfig.style.display = 'none';
        });
    }

    // Inicialización
    positionElements();
    window.addEventListener('resize', positionElements);
    actualizarBitcoin();
    actualizarClicks();
    actualizarAutoClicks();

    function mostrarAlertaJuego(mensaje, tipo = "error") {
        const alerta = document.getElementById('alerta-juego');
        if (!alerta) return;
        let icono = "⚠️";
        if (tipo === "error") icono = "🚨";
        if (tipo === "ok") icono = "✅";
        if (tipo === "info") icono = "ℹ️";
        alerta.innerHTML = `<span class="icono-alerta">${icono}</span> ${mensaje}`;
        alerta.classList.add('mostrar');
        setTimeout(() => {
            alerta.classList.remove('mostrar');
        }, 2200);
    }
});
document.querySelectorAll('.area-archivos .archivo[data-fondo]').forEach(fondo => {
    fondo.classList.remove('equipado');
});

// Agrega la animación de giro rápido para las escamas (puedes poner esto al final del archivo o en tu CSS)
const style = document.createElement('style');
style.textContent = `
@keyframes escama-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(720deg); }
}
.escama-naranja {
    animation: escama-spin 0.7s linear infinite;
}
`;
document.head.appendChild(style);