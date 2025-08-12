document.addEventListener('DOMContentLoaded', () => {
    const items = [
        { src: 'img/comun2.png', alt: '', rarity: 'comun', color: 'gray', prob: 25 },            
        { src: 'img/comun1.png', alt: 'Mouse En Llamas', rarity: 'comun', color: 'gray', prob: 25 },
        { src: 'img/raro.png', alt: 'EL TANQUE', rarity: 'raro', color: 'purple', prob: 30 },
        { src: 'img/epico.jpg', alt: 'Item Épico', rarity: 'epico', color: 'pink', prob: 15 },
        { src: 'img/legendario.png', alt: 'DARWIN EL DEVORADOR DE MUNDOS', rarity: 'legendario', color: 'gold', prob: 4.74 },
        { src: 'img/mitico.jpg', alt: 'Item Mítico', rarity: 'mitico', color: 'red', prob: 0.26 },
        { src: 'img/secreto.png', alt: 'EL SECRETO', rarity: 'secreto', color: 'black', prob: 90 }
    ];

    let inventory = [];
    let isOpening = false;
    let credits = 100000;

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

                addToInventory(resultItem);

                if (resultItem.rarity === 'legendario' || resultItem.rarity === 'mitico' || resultItem.rarity === 'secreto') {
                    createConfetti();
                }

                if (callback) callback();
            }
        }

        animate();
    }

    function addToInventory(item) {
        inventory.unshift(item);
        updateInventory();
    }

    function updateInventory() {
        const imagenes = document.getElementById('imagenes');
        imagenes.innerHTML = '';
        inventory.forEach(item => {
            const itemBox = document.createElement('div');
            itemBox.className = 'item-box';
            // Mostrar siempre la imagen real en el inventario
            itemBox.innerHTML = `<img src="${item.src}" alt="${item.alt}">`;
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

    document.getElementById('generarBtn').addEventListener('click', () => {
        if (isOpening) return;
        if (credits < 100) {
            alert('¡No tienes suficientes créditos!');
            return;
        }
        credits -= 100;
        document.getElementById('generarBtn').textContent = `Abrir Caja (${credits} créditos)`;
        const resultItem = getRandomItem();
        spinRuleta(resultItem);
    });

    // Inicializar
    initRuleta();
    updateInventory();
});
    // Inicializar
    initRuleta();
    updateInventory();
