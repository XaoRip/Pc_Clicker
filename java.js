document.addEventListener('DOMContentLoaded', () => {
    let contador = 0;
    let incremento = 1; // Por clic manual
    let autoclicks = 0; // Clicks automáticos por segundo
    let autoclickerIncrement = 1; // Cuánto suma cada mejora de RAM
    let autoclickerCosto = 200;
    let maxMonedas = 1000;
    let areaClick = 1;
    let componentesExtra = 0;
    let compatibilidad = 1;
    let fondoPersonalizado = false;

    const img = document.getElementById('clicker-pc');
    const contadorElem = document.getElementById('contador');
    const botonesMejora = document.querySelectorAll('.buy-button');
    const cpsElem = document.getElementById('poder-clicks');
    // Elimina referencias a autoclickerP si botonAutoclicker es null
    const botonAutoclicker = document.querySelector('.buy-autoclicker');
    let autoclickerP = null;
    if (botonAutoclicker) {
        autoclickerP = botonAutoclicker.parentElement.querySelector('p');
    }

    img.addEventListener('click', () => {
        if (contador < maxMonedas) {
            contador += incremento;
            if (contador > maxMonedas) contador = maxMonedas;
            contadorElem.textContent = contador;
            actualizarCPS();
        }
    });

    botonesMejora.forEach(boton => {
        boton.addEventListener('click', () => {
            const mejora = boton.getAttribute('data-mejora');
            let costo = parseInt(boton.getAttribute('data-costo'));

            if (contador >= costo) {
                contador -= costo;
                contadorElem.textContent = contador;

                switch (mejora) {
                    case "procesador":
                        incremento += 1;
                        break;
                    case "ram":
                        autoclickerIncrement += 1;
                        break;
                    case "disco":
                        maxMonedas += 1000;
                        break;
                    case "monitor":
                        areaClick += 1;
                        img.style.width = `${30 + areaClick * 5}%`;
                        break;
                    case "gabinete":
                        componentesExtra += 1;
                        break;
                    case "motherboard":
                        compatibilidad += 1;
                        break;
                    case "explorador":
                        fondoPersonalizado = true;
                        document.body.style.background = "#222 url('fondo1.jpg') center/cover no-repeat";
                        boton.disabled = true;
                        boton.textContent = "¡Personalizado!";
                        break;
                }
                // Duplica el costo para la próxima vez
                boton.textContent = `Mejorar (${costo * 2})`;
                boton.setAttribute('data-costo', costo * 2);
                actualizarCPS();
            } else {
                alert('No tienes suficientes puntos');
            }
        });
    });

    // Placa de Video (autoclicker)
    if (botonAutoclicker) {
        botonAutoclicker.addEventListener('click', () => {
            let costo = parseInt(botonAutoclicker.getAttribute('data-costo'));
            if (contador >= costo) {
                contador -= costo;
                autoclicks += autoclickerIncrement;
                contadorElem.textContent = contador;

                autoclickerIncrement = Math.ceil(autoclickerIncrement * 1.5);
                costo = Math.ceil(costo * 2);

                botonAutoclicker.setAttribute('data-costo', costo);
                botonAutoclicker.textContent = `Comprar (${costo})`;
                actualizarCPS();
            } else {
                alert('No tienes suficientes puntos');
            }
        });
    }

    // Autoclicker loop
    setInterval(() => {
        if (autoclicks > 0 && contador < maxMonedas) {
            contador += autoclicks;
            if (contador > maxMonedas) contador = maxMonedas;
            contadorElem.textContent = contador;
            actualizarCPS();
        }
    }, 1000);

    // Actualiza el texto de mejoras
    function actualizarCPS() {
        cpsElem.textContent = `Clicks por clic: ${incremento} | Clicks automáticos por segundo: ${autoclicks} | Máx. monedas: ${maxMonedas}`;
    }

    // Inicializa el texto al cargar
    actualizarCPS();

    // --- TIENDA ZAMAZON ---
    const toggleTienda = document.getElementById('toggle-tienda');
    const ventanaNavegador = document.getElementById('ventana-navegador');

    function abrirTienda() {
        ventanaNavegador.style.display = 'flex';
        ventanaNavegador.classList.remove('oculto');
        ventanaNavegador.classList.add('abierta');
        toggleTienda.classList.add('abierta');
        toggleTienda.textContent = '✖';
        toggleTienda.title = 'Cerrar tienda';
    }
    function cerrarTiendaFn() {
        ventanaNavegador.classList.remove('abierta');
        toggleTienda.classList.remove('abierta');
        setTimeout(() => {
            ventanaNavegador.classList.add('oculto');
            ventanaNavegador.style.display = 'none';
            toggleTienda.textContent = '🛒';
            toggleTienda.title = 'Abrir tienda Zamazon';
        }, 250);
    }

    toggleTienda.addEventListener('click', function(e) {
        e.stopPropagation();
        if (ventanaNavegador.classList.contains('abierta')) {
            cerrarTiendaFn();
        } else {
            abrirTienda();
        }
    });
    // --- FIN TIENDA ZAMAZON ---

    // Selección de producto y panel
    const items = document.querySelectorAll('#tienda .item');
    const panel = document.getElementById('panel-producto');
    const panelImg = document.getElementById('panel-img');
    const panelTitulo = document.getElementById('panel-titulo');
    const panelDesc = document.getElementById('panel-desc');
    const panelPrecio = document.getElementById('panel-precio');
    const panelBtn = document.getElementById('panel-comprar-btn');
    const cerrarPanel = document.querySelector('.cerrar-panel');

    let productoActual = null;

    items.forEach(item => {
        item.addEventListener('click', () => {
            productoActual = item;
            panelImg.src = item.getAttribute('data-img');
            panelTitulo.textContent = item.getAttribute('data-titulo');
            panelDesc.textContent = item.getAttribute('data-desc');
            panelPrecio.textContent = `$${item.getAttribute('data-precio')}`;
            panelBtn.textContent = (item.getAttribute('data-mejora') === 'placa-video') ? 'Comprar' : 'Mejorar';
            panel.classList.remove('oculto');
            panelBtn.dataset.mejoratipo = item.getAttribute('data-mejora');
            panelBtn.dataset.costo = item.getAttribute('data-costo');
        });
    });

    cerrarPanel.addEventListener('click', () => {
        panel.classList.add('oculto');
    });

    panelBtn.addEventListener('click', () => {
        if (!productoActual) return;
        const mejora = panelBtn.dataset.mejoratipo;
        const costo = parseInt(panelBtn.dataset.costo);
        if (contador >= costo) {
            contador -= costo;
            contadorElem.textContent = contador;
            switch (mejora) {
                case "procesador":
                    incremento += 1;
                    break;
                case "ram":
                    autoclickerIncrement += 1;
                    break;
                case "disco":
                    maxMonedas += 1000;
                    break;
                case "monitor":
                    areaClick += 1;
                    img.style.width = `${30 + areaClick * 5}%`;
                    break;
                case "gabinete":
                    componentesExtra += 1;
                    break;
                case "motherboard":
                    compatibilidad += 1;
                    break;
                case "explorador":
                    fondoPersonalizado = true;
                    document.body.style.background = "#222 url('fondo1.jpg') center/cover no-repeat";
                    break;
                case "placa-video":
                    autoclicks += autoclickerIncrement;
                    break;
            }
            const nuevoCosto = costo * 2;
            productoActual.setAttribute('data-costo', nuevoCosto);
            productoActual.setAttribute('data-precio', nuevoCosto);
            actualizarCPS();
            panel.classList.add('oculto');
        } else {
            alert('No tienes suficientes puntos');
        }
    });
});