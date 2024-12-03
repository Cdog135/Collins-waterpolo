// ===============================
// INITIAL SETUP AND SCENE CREATION
// ===============================

// Create the basic 3D environment
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87CEEB); // Sky blue background
document.body.appendChild(renderer.domElement);

// ===============================
// WATER SETUP
// ===============================

// Create the water surface
const waterGeometry = new THREE.PlaneGeometry(5000, 2000);
const waterMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x1E90FF,    // Deep blue color
    shininess: 100,     // Makes water look reflective
    transparent: true,  // Allows transparency
    opacity: 0.8        // Semi-transparent
});
const waterPlane = new THREE.Mesh(waterGeometry, waterMaterial);
waterPlane.position.set(0, -300, -800);
waterPlane.rotation.x = -Math.PI / 4;
scene.add(waterPlane);

// Function to animate water movement
function animateWater() {
    waterPlane.rotation.x = -Math.PI / 4 + Math.sin(Date.now() * 0.001) * 0.05;
}

// ===============================
// LIGHTING SETUP
// ===============================

// Add ambient light for overall scene brightness
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

// Add directional light for shadows and depth
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// ===============================
// GOAL CREATION
// ===============================

function createGoalPosts() {
    // Material for the goal posts
    const postMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xFFFFFF,
        shininess: 100,
        emissive: 0x444444
    });
    const goalGroup = new THREE.Group();

    // Define goal dimensions
    const postRadius = 8;
    const goalWidth = 1200;
    const goalHeight = 360;
    const goalDepth = 160;

    // Helper function to create goal posts
    function createPost(x, y, z, height, rotation = [0, 0, 0]) {
        const geometry = new THREE.CylinderGeometry(postRadius, postRadius, height);
        const post = new THREE.Mesh(geometry, postMaterial);
        post.position.set(x, y, z);
        post.rotation.set(...rotation);
        return post;
    }

    // Create all posts for the goal
    const leftPost = createPost(-goalWidth/2, -goalHeight/2 + goalHeight/2, -400, goalHeight);
    const rightPost = createPost(goalWidth/2, -goalHeight/2 + goalHeight/2, -400, goalHeight);
    const crossbar = createPost(0, goalHeight/2, -400, goalWidth, [0, 0, Math.PI/2]);
    const sideBarLeft = createPost(-goalWidth/2, 0, -400-goalDepth/2, goalDepth, [Math.PI/2, 0, 0]);
    const sideBarRight = createPost(goalWidth/2, 0, -400-goalDepth/2, goalDepth, [Math.PI/2, 0, 0]);
    const backBar = createPost(0, 0, -400-goalDepth, goalWidth, [0, 0, Math.PI/2]);

    // Add all posts to the goal group
    goalGroup.add(leftPost, rightPost, crossbar, sideBarLeft, sideBarRight, backBar);

    // Create the net
    const netMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.3 });
    const netSegmentsWidth = 40;
    const netSegmentsHeight = 20;

    // Create vertical net lines
    for (let i = 0; i <= netSegmentsWidth; i++) {
        const x = (goalWidth * i / netSegmentsWidth) - goalWidth/2;
        const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x, -goalHeight/2, -400),
            new THREE.Vector3(x, goalHeight/2, -400),
            new THREE.Vector3(x, goalHeight/2, -400-goalDepth),
            new THREE.Vector3(x, -goalHeight/2, -400-goalDepth)
        ]);
        const line = new THREE.Line(geometry, netMaterial);
        goalGroup.add(line);
    }

    // Create horizontal net lines
    for (let i = 0; i <= netSegmentsHeight; i++) {
        const y = (goalHeight * i / netSegmentsHeight) - goalHeight/2;
        const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-goalWidth/2, y, -400),
            new THREE.Vector3(goalWidth/2, y, -400),
            new THREE.Vector3(goalWidth/2, y, -400-goalDepth),
            new THREE.Vector3(-goalWidth/2, y, -400-goalDepth)
        ]);
        const line = new THREE.Line(geometry, netMaterial);
        goalGroup.add(line);
    }

    return goalGroup;
}

// Create and add goal to scene
const goal = createGoalPosts();
scene.add(goal);

// ===============================
// BALL SETUP
// ===============================

// Create the ball with a more interesting geometry than a simple sphere
const sphereGeometry = new THREE.IcosahedronGeometry(40, 1);
const sphereMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xFFFF00,     // Yellow color
    shininess: 100,      // Makes ball look shiny
    flatShading: true    // Gives it a faceted look
});
const ball = new THREE.Mesh(sphereGeometry, sphereMaterial);
ball.position.set(0, -300, 0); // Starting position
scene.add(ball);

// Set camera position
camera.position.z = 1000;

// ===============================
// GAME STATE AND VARIABLES
// ===============================

let isMoving = false;        // Is the ball currently moving
let targetPosition = new THREE.Vector3();  // Where the ball is moving to
let canShoot = true;         // Can the player shoot
let isDragging = false;      // Is the player dragging the ball
const raycaster = new THREE.Raycaster();  // For detecting clicks on the ball
const mouse = new THREE.Vector2();         // Store mouse position
const mousePlaneZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 400);  // Plane for shot calculation
const intersectionPoint = new THREE.Vector3();  // Where the shot will go

// ===============================
// INPUT HANDLING
// ===============================

// Handle start of input (mouse down or touch start)
function handleInputStart(clientX, clientY) {
    if (!isMoving && canShoot) {
        mouse.x = (clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(ball);
        
        if (intersects.length > 0) {
            isDragging = true;
        }
    }
}

// Handle input movement (mouse move or touch move)
function handleInputMove(clientX, clientY) {
    if (isDragging) {
        mouse.x = (clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(clientY / window.innerHeight) * 2 + 1;
    }
}

// Handle end of input (mouse up or touch end)
function handleInputEnd(clientX, clientY) {
    if (isDragging) {
        mouse.x = (clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        raycaster.ray.intersectPlane(mousePlaneZ, intersectionPoint);

        // Check if shot is within goal bounds
        if (Math.abs(intersectionPoint.x) <= 600 && 
            Math.abs(intersectionPoint.y) <= 180 && 
            intersectionPoint.z <= -300) {
            
            targetPosition.copy(new THREE.Vector3(
                intersectionPoint.x,
                intersectionPoint.y,
                -400
            ));
            
            isMoving = true;
            canShoot = false;
        }

        isDragging = false;
    }
}

// ===============================
// EVENT LISTENERS
// ===============================

// Mouse event listeners
renderer.domElement.addEventListener('mousedown', (event) => {
    event.preventDefault();
    handleInputStart(event.clientX, event.clientY);
});

renderer.domElement.addEventListener('mousemove', (event) => {
    event.preventDefault();
    handleInputMove(event.clientX, event.clientY);
});

renderer.domElement.addEventListener('mouseup', (event) => {
    event.preventDefault();
    handleInputEnd(event.clientX, event.clientY);
});

// Touch event listeners for mobile devices
renderer.domElement.addEventListener('touchstart', (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    handleInputStart(touch.clientX, touch.clientY);
});

renderer.domElement.addEventListener('touchmove', (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    handleInputMove(touch.clientX, touch.clientY);
});

renderer.domElement.addEventListener('touchend', (event) => {
    event.preventDefault();
    const touch = event.changedTouches[0];
    handleInputEnd(touch.clientX, touch.clientY);
});

// ===============================
// ANIMATION AND GAME LOOP
// ===============================

function animate() {
    requestAnimationFrame(animate);

    animateWater();  // Animate water movement

    // Handle ball movement
    if (isMoving) {
        const speed = 0.05;
        ball.position.lerp(targetPosition, speed);
        ball.rotation.x += 0.05;  // Make ball spin
        ball.rotation.y += 0.05;

        // Check if ball has reached target
        if (ball.position.distanceTo(targetPosition) < 1) {
            isMoving = true;
            targetPosition.set(0, -300, 0);  // Return to start position
            
            // Reset game state when ball returns
            if (ball.position.y < -290) {
                isMoving = false;
                canShoot = true;
            }
        }
    }

    renderer.render(scene, camera);
}

// ===============================
// WINDOW RESIZE HANDLING
// ===============================

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});

// Start the game
animate();