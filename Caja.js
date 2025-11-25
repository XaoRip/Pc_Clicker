document.addEventListener('DOMContentLoaded', () => {
    // Esperar a que los datos se carguen desde el servidor
    function waitForProgress() {
        if (!window._progressLoaded) {
            console.log('Esperando a que se carguen los datos...');
            setTimeout(waitForProgress, 100);
            return;
        }
        console.log('Datos cargados, inicializando inventario:', window.inventory);
        initializeInventory();
    }

    function initializeInventory() {
    // Items: ahora incluyen un id (un dígito cada uno). Mantén la correspondencia aquí.
    const items = [
        { id: 3, src: 'img/Mouse Madera.png', alt: 'DruidGamerX', rarity: 'comun', color: 'gray', prob: 25, itemName: 'DruidGamerX', imgmosue: 'img/Mouse Madera sb.png'},            
        { id: 1, src: 'img/Mouse Fire.png', alt: 'Mouse En Llamas', rarity: 'comun', color: 'gray', prob: 25, itemName: 'Mouse En Llamas', imgmosue: 'img/Mouse Fire sb.png'},
        { id: 2, src: 'img/Mouse Taque.png', alt: 'EL TANQUE', rarity: 'raro', color: 'purple', prob: 30, itemName: 'tanque', imgmosue: 'img/Mouse Tanque sb.png'},
        { id: 4, src: 'img/Reroll.png', alt: '¡Girar De Nuevo!', rarity: 'epico', color: 'pink', prob: 15, itemName: 'Girar de nuevo', imgmosue: 'img/Reroll.png'},
        { id: 5, src: 'img/Mouse GoldFish.png', alt: 'DARWIN EL DEVORADOR DE MUNDOS', rarity: 'legendario', color: 'gold', prob: 0.4, itemName: 'darwin', imgmosue: 'img/Mouse GoldFish sb.png'},
        { id: 6, src: 'img/hotkey cb.png', alt: 'streamdeck', rarity: 'mitico', color: 'red', prob: 0.26, itemName: 'Stream Deck', imgmosue: 'img/hotkey.png'},
        { id: 7, src: 'img/Mouse Telefono.png', alt: 'Telefono', rarity: 'secreto', color: 'black', prob: 0.02, itemName: 'Telefono', imgmouse: 'img/Mouse Telefono sb.png'}
    ];

    // Helper global: convierte inventario (array de objetos item) en string compacto de IDs (ej "1,2,1")
    window.getInventoryIdString = function() {
        try {
            if (!Array.isArray(inventory)) return (typeof window.inventory === 'string' ? window.inventory : '');
            return inventory.map(it => it && it.id ? String(it.id) : '').join(',');
        } catch (e) { return (typeof window.inventory === 'string' ? window.inventory : ''); }
    };

    // Helper global: parsea string de IDs en array de objetos (clones desde items)
    window.parseInventoryIdString = function(idString) {
        const out = [];
        if (typeof idString !== 'string') return out;
        // Split the string by commas if present, otherwise process each character
        const ids = idString.includes(',') ? idString.split(',') : idString.split('');
        for (let idStr of ids) {
            if (!/^\d+$/.test(idStr)) continue;
            const id = Number(idStr);
            const found = items.find(it => it.id === id);
            if (found) {
                // clonar propiedades mínimas para evitar referencias compartidas
                out.push(Object.assign({}, found));
            }
        }
        return out;
    };

    // Inicializa inventario y krystal desde window (NO sobrescribas con valores por defecto)
    // CORREGIDO: Si window.inventory es un string (por error de doble JSON) o string de ids, conviértelo a array
    let inventory = [];
    console.log('Initializing inventory from:', window.inventory);
    if (Array.isArray(window.inventory)) {
        inventory = window.inventory;
    } else if (typeof window.inventory === 'string' && window.inventory !== '') {
        // Si es cadena de dígitos (p.e. "12112") o dígitos con comas (p.e. "1,2,1,1,2") interpretarla como IDs
        if (/^[0-9,]+$/.test(window.inventory)) {
            inventory = window.parseInventoryIdString(window.inventory);
            console.log('Parsed inventory from ID string:', window.inventory, 'Result:', inventory);
        } else {
            try {
                inventory = JSON.parse(window.inventory);
                if (!Array.isArray(inventory)) {
                    console.warn('Parsed inventory is not an array:', inventory);
                    inventory = [];
                }
            } catch (e) {
                console.warn('Failed to parse inventory string:', window.inventory, e);
                inventory = [];
            }
        }
        window.inventory = inventory;
    } else {
        console.log('No initial inventory found, starting empty');
        inventory = [];
        window.inventory = [];
    }
    let isOpening = false;
    // Usa el valor real de krystal cargado desde la base de datos
    window.krystal = typeof window.krystal === 'number' ? window.krystal : 10000;

    // (Eliminado: declaración duplicada de 'items')

    window.krystal = window.krystal || 0;

    function updateCreditosBox() {
        const creditosText = document.getElementById('creditos-text');
        if (creditosText) {
            creditosText.textContent = window.krystal;
        }
    }

    function initRuleta(resultItem = null) {
        const ruletaInner = document.getElementById('ruleta-inner');
        ruletaInner.innerHTML = '';

        const totalItems = 50;
        const centerIndex = Math.floor(totalItems / 2);

        for (let i = 0; i < totalItems; i++) {
            let itemToShow;
            if (resultItem && i === centerIndex) {
                itemToShow = resultItem;
            } else {
                let randomItem;
                do {
                    randomItem = items[Math.floor(Math.random() * items.length)];
                } while (
                    (resultItem && i !== centerIndex && randomItem === resultItem) ||
                    randomItem.rarity === 'secreto'
                );
                itemToShow = randomItem;
            }
            const itemElement = document.createElement('div');
            itemElement.className = 'ruleta-item';
            let imgSrc = itemToShow.src;
            if (itemToShow.rarity === 'mitico' || itemToShow.rarity === 'secreto') {
                imgSrc = 'img/LuckyBlock.png';
            }
            itemElement.innerHTML = `<img src="${imgSrc}" alt="${itemToShow.alt}">`;
            ruletaInner.appendChild(itemElement);
        }
    }

    function getRandomItem() {
        const total = items.reduce((sum, item) => sum + item.prob, 0);
        let random = Math.random() * total;
        for (const item of items) {
            if (random < item.prob) {
                return item;
            }
            random -= item.prob;
        }
        return items[0];
    }

    function spinRuleta(resultItem, callback) {
        if (isOpening) return;
        isOpening = true;

        initRuleta(resultItem);

        const ruletaInner = document.getElementById('ruleta-inner');
        const mensaje = document.getElementById('mensaje');
        mensaje.style.opacity = '0';

        const itemWidth = 220; // actualizado a 220px para coincidir con CSS
        const totalItems = ruletaInner.children.length;
        const centerIndex = Math.floor(totalItems / 2);
        // Calcular la posición ganadora teniendo en cuenta el padding centrador en CSS
        const winnerPos = centerIndex * itemWidth;

        let currentPos = 0;
        let speed = 20;
        let decelerationStart = Math.max(0, winnerPos - 1000);
        let animationFrame;

        function animate() {
            if (currentPos < decelerationStart) {
                currentPos += speed;
            } else if (currentPos < winnerPos) {
                speed = Math.max(speed * 0.96, 2);
                currentPos += speed;
            } else {
                currentPos = winnerPos;
            }
            ruletaInner.style.transform = `translateX(-${currentPos}px)`;

            if (currentPos < winnerPos) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                isOpening = false;
                ruletaInner.style.transform = `translateX(-${winnerPos}px)`;

                mensaje.textContent = `¡${resultItem.alt}!`;
                mensaje.style.backgroundColor = resultItem.color;
                mensaje.style.opacity = '1';

                // Si el item es 'Girar de nuevo', no lo añadas al inventario y vuelve a girar
                if (resultItem.itemName === 'Girar de nuevo') {
                    setTimeout(() => {
                        const nuevoItem = getRandomItem();
                        spinRuleta(nuevoItem, callback);
                    }, 200); // Espera un poco para mostrar el mensaje
                } else {
                    addToInventory(resultItem);
                    if (resultItem.rarity === 'legendario' || resultItem.rarity === 'mitico' || resultItem.rarity === 'secreto') {
                        createConfetti();
                    }
                    if (callback) callback();
                }
            }
        }

        animate();
    }

    function addToInventory(item) {
        if (!Array.isArray(inventory)) {
            console.warn('Inventory was not an array, resetting...', inventory);
            inventory = [];
        }
        inventory.unshift(item);
        window.inventory = inventory; // Actualiza el global
        console.log('Added item to inventory:', item.itemName, 'New inventory:', window.getInventoryIdString());
        guardarCajaProgreso(); // Guarda cada vez que se obtiene un item
        updateInventory();
    }

    function showItemModal(item, index) {
        let modal = document.getElementById('item-modal');
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'item-modal';
        modal.className = 'item-modal-bg';
        modal.innerHTML = `
            <div class="item-modal" style="border: 5px solid ${item.color};">
                <img src="${item.src}" alt="${item.alt}" class="item-modal-img">
                <div class="item-modal-actions">
                    <button id="equiparBtn">Equipar</button>
                    <button id="venderBtn">Vender</button>
                    <button id="cerrarModalBtn">&times;</button>
                </div>
                <div class="item-modal-info">
                    <span>${item.alt || 'Sin nombre'}</span>
                    <span>Rareza: ${item.rarity}</span>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Cerrar modal
        modal.querySelector('#cerrarModalBtn').onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

        // Equipar
        modal.querySelector('#equiparBtn').onclick = () => {
            window.equippedItemIndex = index;
            // Desactiva todos los flags antes de equipar uno nuevo
            window.llamas = false;
            window.druid = false;
            window.darwin = false;
            window.telefono = false;
            window.streamdeck = false;
            window.tanque = false;
            // Equipar según el item.id para evitar problemas con mayúsculas/espacios
            let mouseClass = '';
            switch(item.id) {
                case 3: // DruidGamerX
                    window.druid = true;
                    mouseClass = 'mouse-madera';
                    break;
                case 1: // Mouse En Llamas
                    window.llamas = true;
                    mouseClass = 'mouse-fire';
                    break;
                case 5: // darwin
                    window.darwin = true;
                    mouseClass = 'mouse-goldfish';
                    break;
                case 7: // Telefono
                    window.telefono = true;
                    mouseClass = 'mouse-hotkey';
                    break;
                case 6: // Stream Deck
                    window.streamdeck = true;
                    mouseClass = 'mouse-telefono';
                    break;
                case 2: // tanque
                    window.tanque = true;
                    mouseClass = 'mouse-tanque';
                    break;
            }
            const mouseImg = document.getElementById('mouse');
            if (mouseImg) {
                mouseImg.src = item.imgmouse || item.imgmosue || 'img/Mouse Base.png';
                mouseImg.classList.remove('mouse-madera','mouse-fire','mouse-tanque','mouse-goldfish','mouse-hotkey','mouse-telefono');
                if (mouseClass) mouseImg.classList.add(mouseClass);
            }
            updateInventory();
            window.inventory = inventory; // Actualiza el global
            window.equippedItemIndex = index; // Actualiza el global
            guardarCajaProgreso(); // Guarda después de equipar
            modal.remove();
        };

        // Vender
        modal.querySelector('#venderBtn').onclick = () => {
            let krystalGanado = 0;
            switch(item.rarity) {
                case 'comun': krystalGanado = 10; break;
                case 'raro': krystalGanado = 30; break;
                case 'epico': krystalGanado = 100; break;
                case 'legendario': krystalGanado = 500; break;
                case 'mitico': krystalGanado = 2000; break;
                case 'secreto': krystalGanado = 10000; break;
            }
            window.krystal += krystalGanado;
            inventory.splice(index, 1);
            window.inventory = inventory;
            // Si vendiste el mouse equipado, desactiva el equipamiento
            if (window.equippedItemIndex === index) {
                window.equippedItemIndex = undefined;
            }
            updateInventory();
            window.equippedItemIndex = window.equippedItemIndex;
            actualizarKrystalUI();
            guardarCajaProgreso(); // Guarda después de vender
            mostrarAlerta(`¡Vendiste el item por ${krystalGanado} krystal!`);
            modal.remove();
        };
    }

    function updateInventory() {
        const imagenes = document.getElementById('imagenes');
        imagenes.innerHTML = '';
        inventory.forEach((item, idx) => {
            const itemBox = document.createElement('div');
            itemBox.className = 'item-box';
            if (window.equippedItemIndex === idx) {
                itemBox.classList.add('highlight');
                // Cambiar imagen del mouse si el item tiene imgmouse o imgmosue y aplicar clase
                const mouseImg = document.getElementById('mouse');
                if (mouseImg) {
                    mouseImg.src = item.imgmouse || item.imgmosue || 'img/Mouse Base.png';
                    let mouseClass = '';
                    switch(item.id) {
                        case 3: mouseClass = 'mouse-madera'; break; // DruidGamerX
                        case 1: mouseClass = 'mouse-fire'; break;   // Mouse En Llamas
                        case 5: mouseClass = 'mouse-goldfish'; break; // darwin
                        case 7: mouseClass = 'mouse-hotkey'; break; // Telefono
                        case 6: mouseClass = 'mouse-telefono'; break; // Stream Deck
                        case 2: mouseClass = 'mouse-tanque'; break; // tanque
                    }
                    mouseImg.classList.remove('mouse-madera','mouse-fire','mouse-tanque','mouse-goldfish','mouse-hotkey','mouse-telefono','mouse-default');
                    if (mouseClass) mouseImg.classList.add(mouseClass);
                }
                // Asegurar que los flags globales coincidan con el mouse equipado
                window.llamas = false;
                window.druid = false;
                window.darwin = false;
                window.telefono = false;
                window.streamdeck = false;
                window.tanque = false;
                switch(item.id) {
                    case 3: window.druid = true; break;
                    case 1: window.llamas = true; break;
                    case 5: window.darwin = true; break;
                    case 7: window.telefono = true; break;
                    case 6: window.streamdeck = true; break;
                    case 2: window.tanque = true; break;
                }
            }
            itemBox.innerHTML = `<img src="${item.src}" alt="${item.alt}">`;
            itemBox.onclick = () => showItemModal(item, idx);
            imagenes.appendChild(itemBox);
        });
        // Si no hay mouse equipado, poner el default
        const mouseImg = document.getElementById('mouse');
        if (mouseImg && window.equippedItemIndex === undefined) {
            mouseImg.src = 'img/Mouse Base.png';
            mouseImg.classList.remove('mouse-madera','mouse-fire','mouse-tanque','mouse-goldfish','mouse-hotkey','mouse-telefono');
            mouseImg.classList.add('mouse-default');
        }
    }

    function createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'efecto-confeti';
        document.body.appendChild(confettiContainer);

        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confeti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = `hsl(${Math.random() * 60 + 30}, 100%, 50%)`;
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confettiContainer.appendChild(confetti);

            setTimeout(() => {
                confetti.style.opacity = '1';
                confetti.style.transform = `translate(${Math.random() * 400 - 200}px, ${Math.random() * 800 + 400}px) rotate(${Math.random() * 720}deg)`;
                confetti.style.transition = `all ${Math.random() * 3 + 2}s ease-out`;
            }, 0);
        }

        setTimeout(() => {
            confettiContainer.remove();
        }, 5000);
    }

    function updateKrystalBox() {
        actualizarKrystalUI();
        // Sólo guardar si ya se cargó el progreso desde el servidor
        if (window._progressLoaded) {
            guardarCajaProgreso();
        } else {
            // evita guardados prematuros que sobrescriben el inventario en la BD
            window.inventory = inventory;
            window.krystal = typeof window.krystal === 'number' ? window.krystal : 0;
        }
    }

    // Unica definición de guardarCajaProgreso: respeta la bandera window._progressLoaded
    function guardarCajaProgreso() {
        // Mantén globals sincronizados con el inventario local
        window.inventory = inventory;
        window.krystal = typeof window.krystal === 'number' ? window.krystal : 0;

        // Si no se han cargado aún los datos del usuario desde la API, no sobrescribas la BD
        if (!window._progressLoaded) {
            return;
        }

        if (typeof window.guardarProgresoUsuario === 'function') {
            window.guardarProgresoUsuario();
            return;
        }
        // Fallback directo al endpoint: enviar inventario como string de IDs cuando sea posible
        const invToSend = (typeof window.getInventoryIdString === 'function') ? window.getInventoryIdString() :
                          (typeof window.inventory === 'string' ? window.inventory : JSON.stringify(window.inventory));
        fetch('api.php?save=1', {
             method: 'POST',
             credentials: 'same-origin',
             headers: {'Content-Type': 'application/json'},
             body: JSON.stringify({
                 inventario: invToSend,
                 krystal: window.krystal,
                 equippedItemIndex: window.equippedItemIndex !== undefined ? window.equippedItemIndex : null
             })
         }).catch(err => console.error('Error guardando caja:', err));
    }

    document.getElementById('generarBtn').addEventListener('click', () => {
        if (isOpening) return;
        const costo = 100;
        if (window.krystal < costo) {
            const faltan = costo - window.krystal;
            mostrarAlerta(`¡Te faltan ${faltan} krystal para abrir la caja!`);
            return;
        }
        window.krystal -= costo;
        window.inventory = inventory;
        updateKrystalBox();
        // Guardar sólo si ya cargamos progreso (evita sobrescribir BD al inicio)
        if (window._progressLoaded) guardarCajaProgreso();
        const resultItem = getRandomItem();
        spinRuleta(resultItem, () => {
            if (typeof window.onCajaAbierta === 'function') window.onCajaAbierta();
            // Guardar resultado final sólo si ya estamos sincronizados
            if (window._progressLoaded) guardarCajaProgreso();
        });
    });

    // Inicializar
    initRuleta();
    updateInventory();
    updateKrystalBox();
    }

    // Comenzar el proceso de inicialización
    waitForProgress();
});

function actualizarKrystalUI() {
    const caja = document.getElementById('krystal-caja');
    const misiones = document.getElementById('krystal-misiones');
    if (caja) caja.textContent = window.krystal;
    if (misiones) misiones.textContent = window.krystal;
}

// Puedes poner esto al inicio de Caja.js o en un archivo común
function mostrarAlerta(mensaje) {
    const alerta = document.getElementById('alerta-juego');
    if (!alerta) return;
    alerta.textContent = mensaje;
    alerta.classList.add('mostrar');
    setTimeout(() => {
        alerta.classList.remove('mostrar');
    }, 2000);
}
