document.addEventListener('DOMContentLoaded', () => {
    // Variables del juego
    let bitcoin = 0;
    let gabinetepts = 0;
    let incremento = 1;
    let autoclicks = 0;
    let autoclickerIncrement = 1;
    let maxMonedas = 500;   
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
        
        // Pequeña variación aleatoria
        const offsetX = (Math.random() - 0.5) * 30;
        const offsetY = (Math.random() - 0.5) * 30;
        textoFlotante.style.setProperty('--tx', `${offsetX}px`);
        textoFlotante.style.setProperty('--ty', `${-100 + offsetY}px`);
        
        document.body.appendChild(textoFlotante);
        
        // Eliminar después de la animación
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
            
            // Posición del clicker
            const rect = clicker.getBoundingClientRect();
            const centerX = rect.left + rect.width/2;
            const centerY = rect.top + rect.height/2;
            
            // Crear texto flotante
            crearTextoFlotante(centerX, centerY, `+${incremento}`);
            
            // Efecto de escala en el Bitcoin
            clicker.style.transform = 'scale(0.95)';
            setTimeout(() => {
                clicker.style.transform = 'scale(1)';
            }, 100);
            
            // Añadir bitcoins
            bitcoin += incremento;
            if (bitcoin > maxMonedas) bitcoin = maxMonedas;
            
            // Actualizar la interfaz
            actualizarBitcoin();
        });
    }

    // Sistema de clicks automáticos
    setInterval(() => {
        if (autoclicks > 0) {
            bitcoin += autoclicks;
            if (bitcoin > maxMonedas) bitcoin = maxMonedas;
            actualizarBitcoin();
        }
    }, 1000);

    // --- TIENDA ---
    const tiendaBtn = document.getElementById('tienda');
    const ventanaTienda = document.getElementById('ventana-tienda');
    const cerrarTiendaBtn = document.querySelector('.cerrar-tienda');

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
                        Clevel += 1;
                        incremento += 1;
                        actualizarClicks();
                        if (!gabcompradoC) gabinetepts -= 1;
                        break;
                        
                    case "ram":
                        if (!gabcompradoR && gabinetepts < 1) {
                            alert('🚨 Tu gabinete no tiene capacidad para este producto 🚨');
                            return;
                        }
                        Rlevel += 1;
                        autoclickerIncrement += 1;
                        if (!gabcompradoR) gabinetepts -= 1;
                        break;
                        
                    case "placa-video":
                        if (!gabcompradoG && gabinetepts < 1) {
                            alert('🚨 Tu gabinete no tiene capacidad para este producto 🚨');
                            return;
                        }
                        Glevel += 1;
                        autoclicks += autoclickerIncrement;
                        actualizarAutoClicks();
                        if (!gabcompradoG) gabinetepts -= 1;
                        break;
                        
                    case "disco":
                        Dlevel += 1;
                        maxMonedas = maxMonedas * 2;
                        nuevoCosto = maxMonedas;
                        break;
                        
                    case "monitor":
                        Molevel += 1;
                        clicker.style.width = (parseInt(clicker.style.width) || 60) + 10 + 'px';
                        clicker.style.height = (parseInt(clicker.style.height) || 60) + 10 + 'px';
                        break;
                        
                    case "gabinete":
                        if (gabinetepts >= 5) {
                            alert('🚨 Tu gabinete ya está al máximo de capacidad 🚨');
                            return;
                        }
                        Gablevel += 1;
                        gabinetepts += 1;
                        break;
                        
                    case "motherboard":
                        if (!gabcompradoM && gabinetepts < 1) {
                            alert('🚨 Tu gabinete no tiene capacidad para este producto 🚨');
                            return;
                        }
                        Mlevel += 1;
                        if (!gabcompradoM) gabinetepts -= 1;
                        break;
                        
                    case "explorador":
                        Elevel += 1;
                        document.querySelector('.container').style.backgroundImage = "url('fondo_personalizado.png')";
                        break;
                }

                // Actualizar costos
                if (mejora !== "disco") {
                    nuevoCosto = Math.floor(costo * 1.5);
                    item.setAttribute('data-costo', nuevoCosto);
                } else {
                    nuevoCosto = maxMonedas;
                    item.setAttribute('data-costo', nuevoCosto);
                }

                // Actualizar interfaz
                bitcoin -= costo;
                actualizarBitcoin();
                actualizarNivelesTienda();
                
                // Efecto visual al comprar
                item.style.transform = 'scale(1.05)';
                setTimeout(() => item.style.transform = 'scale(1)', 200);
                
            } else {
                alert('🚨 No tienes suficientes bitcoins 🚨');
            }
        });
    });

    // Inicialización
    actualizarBitcoin();
    actualizarClicks();
    actualizarAutoClicks();
});