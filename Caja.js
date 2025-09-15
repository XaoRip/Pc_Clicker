document.addEventListener('DOMContentLoaded', () => {
    const items = [
        { src: 'img/Mouse Madera.png', alt: 'DruidGamerX', rarity: 'comun', color: 'gray', prob: 25, itemName: 'DruidGamerX' },            
        { src: 'img/Mouse Fire.png', alt: 'Mouse En Llamas', rarity: 'comun', color: 'gray', prob: 25, itemName: 'Mouse En Llamas' },
        { src: 'img/Mouse Taque.png', alt: 'EL TANQUE', rarity: 'raro', color: 'purple', prob: 30, itemName: 'tanque' },
        { src: 'img/Reroll.png', alt: '¡Girar De Nuevo!', rarity: 'epico', color: 'pink', prob: 15, itemName: 'Girar de nuevo' },
        { src: 'img/Mouse GoldFish.png', alt: 'DARWIN EL DEVORADOR DE MUNDOS', rarity: 'legendario', color: 'gold', prob: 4000.74, itemName: 'darwin' },
        { src: 'img/hotkey cb.png', alt: 'Item Mítico', rarity: 'mitico', color: 'red', prob: 0.26, itemName: 'telefono' },
        { src: 'img/Telefono.png', alt: 'EL SECRETO', rarity: 'secreto', color: 'black', prob: 0.01, itemName: 'streamdeck'}
    ];

    let inventory = [];
    let isOpening = false;

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

        const itemWidth = 160;
        const totalItems = ruletaInner.children.length;
        const centerIndex = Math.floor(totalItems / 2);
        const winnerPos = centerIndex * itemWidth;

        let currentPos = 0;
        let speed = 20;
        let decelerationStart = winnerPos - 800;
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
                    }, 1200); // Espera un poco para mostrar el mensaje
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
        inventory.unshift(item);
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
            // Equipar según el itemName
            switch(item.itemName) {
                case 'DruidGamerX':
                    window.druid = true;
                    break;
                case 'Mouse En Llamas':
                    window.llamas = true;
                    break;
                case 'darwin':
                    window.darwin = true;
                    break;
                case 'telefono':
                    window.telefono = true;
                    break;
                case 'streamdeck':
                    window.streamdeck = true;
                    break;
                case 'tanque':
                    window.tanque = true;
                    break;
                // Si quieres que "Girar de nuevo" haga algo, agrégalo aquí
            }
            updateInventory();
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
            updateInventory();
            actualizarKrystalUI();
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
            }
            itemBox.innerHTML = `<img src="${item.src}" alt="${item.alt}">`;
            itemBox.onclick = () => showItemModal(item, idx);
            imagenes.appendChild(itemBox);
        });
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
        updateKrystalBox();
        const resultItem = getRandomItem();
        spinRuleta(resultItem);
    });

    // Inicializar
    initRuleta();
    updateInventory();
    updateKrystalBox();
});

window.krystal = 1000; // Valor inicial en 0

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
