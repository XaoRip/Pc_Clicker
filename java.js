document.addEventListener('DOMContentLoaded', () => {
    // Variables del juego
    let bitcoin = 10000000;
    let gabinetepts = 0;
    let incremento = 1;
    let autoclicks = 0;
    let autoclickerIncrement = 1;
    let maxMonedas = 10000000;   
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

    // Función para crear texto flotante
    function crearTextoFlotante(x, y, texto) {
        const textoFlotante = document.createElement('div');
        textoFlotante.className = 'texto-flotante';
        textoFlotante.textContent = texto;
        textoFlotante.style.left = `${x}px`;
        textoFlotante.style.top = `${y}px`;
        
        const offsetX = (Math.random() - 0.5) * 30;
        const offsetY = (Math.random() - 0.5) * 30;
        textoFlotante.style.setProperty('--tx', `${offsetX}px`);
        textoFlotante.style.setProperty('--ty', `${-100 + offsetY}px`);
        
        document.body.appendChild(textoFlotante);
        
        setTimeout(() => {
            textoFlotante.remove();
        }, 1000);
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
        clicker.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const rect = clicker.getBoundingClientRect();
            const centerX = rect.left + rect.width/2;
            const centerY = rect.top + rect.height/2;
            
            crearTextoFlotante(centerX, centerY, `+${incremento}`);
            
            clicker.style.transform = 'scale(0.95)';
            setTimeout(() => {
                clicker.style.transform = 'scale(1)';
            }, 100);
            
            bitcoin += incremento;
            if (bitcoin > maxMonedas) bitcoin = maxMonedas;
            
            actualizarBitcoin();
        });
    }

    setInterval(() => {
        if (bitcoin >= maxMonedas) {
            bitcoin = maxMonedas;
        }
        if (gabcompradoG == true) {
            bitcoin += autoclicks;
            actualizarBitcoin();
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
                            alert('🚨 Tu gabinete no tiene capacidad para este producto 🚨');
                            return;
                        }
                        if (Clevel >= Mlevel) {
                            alert('🚨 El nivel del procesador no puede ser mayor que el de la motherboard 🚨');
                            return;
                        }
                        if (gabcompradoC == true){
                        Clevel += 1;
                        incremento += 1;
                        actualizarClicks();
                        }

                        else{
                            gabinetepts -= 1;
                            gabcompradoC=true;   
                            Clevel += 1;
                            incremento += 1;
                            actualizarClicks();
                            }
                        
                    break;
                        
                    case "ram":
                        if (!gabcompradoR && gabinetepts < 1) {
                            alert('🚨 Tu gabinete no tiene capacidad para este producto 🚨');
                            return;
                        }
                        if (gabcompradoR == true){
                            Rlevel += 1;
                            autoclickerIncrement += 1;
                            autoclicks += autoclickerIncrement;
                            actualizarAutoClicks();
                        }

                            else{
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
                            alert('🚨 Tu gabinete no tiene capacidad para este producto 🚨');
                            return;
                        }
                            if (Glevel >= Mlevel) {
                            alert('🚨 Esta placa de video no es compatible con la motherboard 🚨');
                            return;
                        }
                        if (gabcompradoG == true){
                            Glevel += 1;
                        }

                            else{
                                gabinetepts -= 1;
                                gabcompradoG=true;   
                                Glevel += 1;
                                AutoBit = 4000
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
                            monitorImg.src = `img/monitor-lv${Molevel}.png`;
                            // Aplica clase al contenedor .screen
                            screenDiv.classList.add('monitor-lv5');
                        } else {
                            // Quita clase si baja de nivel
                            screenDiv.classList.remove('monitor-lv5');
                        }
                        break;
                        
                   case "gabinete":
                        if (gabinetepts >= 10) {
                            alert('🚨 Tu gabinete ya está al máximo de capacidad 🚨');
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
                        alert('🚨 Tu gabinete no tiene capacidad para este producto 🚨');
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
                
            } else {
                alert('🚨 No tienes suficientes bitcoins 🚨');
            }
        });
    });

    // Hacer la ventana del explorador arrastrable
    if (ventanaExplorador2 && barraExplorador) {
        makeDraggable(ventanaExplorador2, barraExplorador);
    }
    
    // Manejar clics en los fondos del explorador
    document.querySelectorAll('.area-archivos .archivo[data-fondo]').forEach(fondo => {
        fondo.addEventListener('click', function() {
            const precio = parseInt(this.getAttribute('data-precio'));
            const nombreFondo = this.getAttribute('data-fondo');
            
            if (bitcoin >= precio) {
                bitcoin -= precio;
                fondoActual = `img/${nombreFondo}.png`;
                document.querySelector('.container').style.backgroundImage = `url('img/${nombreFondo}.png')`;
                actualizarBitcoin();
                alert('¡Fondo comprado y aplicado con éxito!');
            } else {
                alert('No tienes suficientes bitcoins para comprar este fondo');
            }
        });
    });

    // Sistema de clicks automáticos
    setInterval(() => {
        if (autoclicks > 0) {
            bitcoin += autoclicks;
            if (bitcoin > maxMonedas) bitcoin = maxMonedas;
            actualizarBitcoin();
        }
    }, 1000);

    // Función para posicionar elementos relativos
    function positionElements() {
        actualizarBitcoin();
        actualizarClicks();
        actualizarAutoClicks();
    }

    // Función para hacer elementos arrastrables
    function makeDraggable(ventana, barra) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        barra.onmousedown = dragMouseDown;
        
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
            ventana.style.top = (ventana.offsetTop - pos2) + "px";
            ventana.style.left = (ventana.offsetLeft - pos1) + "px";
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
});