// Инициализация сцены
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

// Настройка камеры
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// Создание рендерера
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.touchAction = 'none';
document.body.appendChild(renderer.domElement);

// Массив кубов и их исходные цвета
const cubes = [];
const originalColor = 0x00ff00;
const selectedColor = 0xff0000;
let selectedCube = null;
const cubePositions = [
    { x: -2, y: 2, z: 0 },
    { x: 2, y: 2, z: 0 },
    { x: -2, y: -2, z: 0 },
    { x: 2, y: -2, z: 0 }
];

// Создаем группу для всех кубов
const cubeGroup = new THREE.Group();
scene.add(cubeGroup);

// Создаем 4 куба и добавляем их в группу
for (let i = 0; i < 4; i++) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ 
        color: originalColor,
        wireframe: false 
    });
    const cube = new THREE.Mesh(geometry, material);
    
    cube.position.set(cubePositions[i].x, cubePositions[i].y, cubePositions[i].z);
    cube.userData.index = i + 1;
    
    cubeGroup.add(cube);
    cubes.push(cube);
}

// Переменные для управления
let isDragging = false;
let previousPosition = { x: 0, y: 0 };
let zoom = 1;

// Функция для получения позиции
function getPosition(e) {
    const source = e.touches ? e.touches[0] : e;
    return { x: source.clientX, y: source.clientY };
}

// Обработчики событий
function handleStart(e) {
    isDragging = true;
    previousPosition = getPosition(e);
    
    // Проверяем клик по кубу
    const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
    );
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObjects(cubes);
    if (intersects.length > 0) {
        const clickedCube = intersects[0].object;
        
        if (selectedCube === clickedCube) {
            clickedCube.material.color.setHex(originalColor);
            document.getElementById('cube-title').textContent = 'Кисе!';
            selectedCube = null;
        } else {
            if (selectedCube) {
                selectedCube.material.color.setHex(originalColor);
            }
            
            clickedCube.material.color.setHex(selectedColor);
            document.getElementById('cube-title').textContent = `Кисе куб ${clickedCube.userData.index}`;
            selectedCube = clickedCube;
        }
    }
    
    e.preventDefault();
}

function handleEnd() {
    isDragging = false; // Просто сбрасываем флаг перетаскивания
}

function handleMove(e) {
    if (!isDragging) return;
    
    const currentPosition = getPosition(e);
    const deltaMove = {
        x: currentPosition.x - previousPosition.x,
        y: currentPosition.y - previousPosition.y
    };

    // Вращаем всю группу кубов
    cubeGroup.rotation.y += deltaMove.x * 0.005;
    cubeGroup.rotation.x += deltaMove.y * 0.005;

    previousPosition = currentPosition;
    e.preventDefault();
}

function handleWheel(e) {
    zoom += e.deltaY * -0.001;
    zoom = Math.min(Math.max(0.5, zoom), 2);
    camera.position.z = 10 / zoom;
    e.preventDefault();
}

// Добавляем обработчики
document.addEventListener('mousedown', handleStart);
document.addEventListener('mouseup', handleEnd);
document.addEventListener('mousemove', handleMove);
document.addEventListener('wheel', handleWheel, { passive: false });

document.addEventListener('touchstart', handleStart);
document.addEventListener('touchend', handleEnd);
document.addEventListener('touchmove', handleMove, { passive: false });

// Обработка изменения размера
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Анимация (упрощенная версия без замедления)
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera); // Просто рендерим сцену
}

animate();
