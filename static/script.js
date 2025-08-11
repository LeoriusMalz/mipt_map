let scene, camera, renderer, cube, composer;

function init() {
    // Сцена
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Камера
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Рендерер
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Куб
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00,
        wireframe: true
    });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Настройка ASCII-эффекта
    const renderPass = new THREE.RenderPass(scene, camera);
    const asciiPass = new THREE.ShaderPass(THREE.ASCIIShader);
    asciiPass.uniforms['resolution'].value = new THREE.Vector2(window.innerWidth, window.innerHeight);
    asciiPass.uniforms['resolution'].value.multiplyScalar(window.devicePixelRatio);
    asciiPass.uniforms['size'].value = new THREE.Vector2(8, 16);
    asciiPass.renderToScreen = true;

    composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(asciiPass);

    // Обработка событий мыши
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    document.addEventListener('mousedown', () => isDragging = true);
    document.addEventListener('mouseup', () => isDragging = false);
    document.addEventListener('mousemove', (event) => {
        if (!isDragging) return;
        
        const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y
        };

        cube.rotation.y += deltaMove.x * 0.01;
        cube.rotation.x += deltaMove.y * 0.01;

        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    });

    window.addEventListener('resize', onWindowResize);
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    composer.render();
}

init();