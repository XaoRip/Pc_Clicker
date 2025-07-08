document.addEventListener('DOMContentLoaded', () => {
    // --- CLICKER ---
    let bitcoins = 0;
    let incremento = 1;
    let autoclicks = 0;
    let autoclickerIncrement = 1;
    let maxMonedas = 1000;
    let areaClick = 1;
    let componentesExtra = 0;
    let compatibilidad = 1;
    let fondoPersonalizado = false;

    const clicker = document.getElementById('clicker');
    const bitcoinElem = document.getElementById('bitcoin');

    function actualizarBitcoin() {
        bitcoinElem.textContent = `Bitcoins: $${bitcoins}`;
    }

    clicker.addEventListener('click', () => {
        if (bitcoins < maxMonedas) {
            bitcoins += incremento;
            if (bitcoins > maxMonedas) bitcoins = maxMonedas;
            actualizarBitcoin();
        }
    });

    // Autoclicker loop
    setInterval(() => {
        if (autoclicks > 0 && bitcoins < maxMonedas) {
            bitcoins += autoclicks;
            if (bitcoins > maxMonedas) bitcoins = maxMonedas;
            actualizarBitcoin();
        }
    }, 1000);

    // --- TIENDA ZAMAZON ---
    const tiendaBtn = document.getElementById('tienda');
    const ventanaTienda = document.getElementById('ventana-tienda');

    tiendaBtn.addEventListener('click', () => {
        ventanaTienda.style.display = (ventanaTienda.style.display === 'none' || ventanaTienda.style.display === '') ? 'block' : 'none';
    });

    // Panel de producto
    const items = document.querySelectorAll('.item');
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
            panelPrecio.textContent = `$${item.getAttribute('data-costo')}`;
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
        let costo = parseInt(panelBtn.dataset.costo);
        if (bitcoins >= costo) {
            bitcoins -= costo;
            actualizarBitcoin();
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
                    clicker.style.width = `${30 + areaClick * 5}%`;
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
            // Duplica el costo para la próxima vez
            const nuevoCosto = costo * 2;
            productoActual.setAttribute('data-costo', nuevoCosto);
            productoActual.querySelector('.item-desc').textContent = productoActual.getAttribute('data-desc');
            panelPrecio.textContent = `$${nuevoCosto}`;
            panelBtn.dataset.costo = nuevoCosto;
            panel.classList.add('oculto');
        } else {
            alert('No tienes suficientes puntos');
        }
    });

    // Inicializa el contador al cargar
    actualizarBitcoin();
});