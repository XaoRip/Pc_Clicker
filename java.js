document.addEventListener('DOMContentLoaded', () => {
    // Variables del juego
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
    let fondoEquipado = null; // Nuevo: guarda el fondo actualmente equipado

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
        clicker.style.zIndex = '10';
        clicker.style.pointerEvents = 'auto';
        clicker.style.transition = 'transform 0.1s ease-out';
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

    // Evento de clic básico con efecto de texto flotante
    if (clicker) {
        clicker.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            crearTextoFlotante(e.clientX, e.clientY, `+${incremento}`);

            bitcoin += incremento;
            if (bitcoin > maxMonedas) bitcoin = maxMonedas;
            actualizarBitcoin();
            // MISIÓN: click manual y bitcoins ganados SOLO si no está en el máximo
            if (bitcoin < maxMonedas) {
                if (window.misionesClickManual) window.misionesClickManual();
                if (window.misionesBitcoin) window.misionesBitcoin(incremento);
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
this.classList.add('equipado');