// Инициализация сцены
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

// Настройка камеры
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Создание рендерера
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.touchAction = 'none'; // Отключаем стандартные жесты
document.body.appendChild(renderer.domElement);

// Создание куба
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ 
    color: 0x00ff00,
    wireframe: false 
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Переменные для управления
let isDragging = false;
let previousPosition = { x: 0, y: 0 };

// Обработчики для мыши
function handleStart(e) {
    isDragging = true;
    previousPosition = getPosition(e);
}

function handleEnd() {
    isDragging = false;
}

function handleMove(e) {
    if (!isDragging) return;
    
    const currentPosition = getPosition(e);
    const deltaMove = {
        x: currentPosition.x - previousPosition.x,
        y: currentPosition.y - previousPosition.y
    };

    cube.rotation.y += deltaMove.x * 0.01;
    cube.rotation.x += deltaMove.y * 0.01;

    previousPosition = currentPosition;
    
    // Предотвращаем скролл страницы на мобильных
    e.preventDefault();
}

// Функция для получения позиции (универсальная для мыши и тача)
function getPosition(e) {
    if (e.touches) {
        return { 
            x: e.touches[0].clientX, 
            y: e.touches[0].clientY 
        };
    } else {
        return { 
            x: e.clientX, 
            y: e.clientY 
        };
    }
}

function handleTouchMove(e) {
    if (e.touches.length === 2) {
        // Обработка масштабирования двумя пальцами
    }
}

// Добавляем обработчики для мыши
document.addEventListener('mousedown', handleStart);
document.addEventListener('mouseup', handleEnd);
document.addEventListener('mousemove', handleMove);

// Добавляем обработчики для тач-устройств
document.addEventListener('touchstart', handleStart);
document.addEventListener('touchend', handleEnd);
document.addEventListener('touchmove', handleMove);

// Обработка изменения размера
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Анимация
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
