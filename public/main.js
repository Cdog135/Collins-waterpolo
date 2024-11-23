import * as THREE from 'three';

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
  window.innerWidth / -2,
  window.innerWidth / 2,
  window.innerHeight / 2,
  window.innerHeight / -2,
  1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Background rectangle
const rectangleGeometry = new THREE.PlaneGeometry(800, 600);
const rectangleMaterial = new THREE.MeshBasicMaterial({ color: 0x444444 });
const rectangle = new THREE.Mesh(rectangleGeometry, rectangleMaterial);
scene.add(rectangle);

// Ball (circle)
const ballGeometry = new THREE.CircleGeometry(20, 32);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
scene.add(ball);

// Set up camera position
camera.position.z = 5;

// Game state
let isMoving = false;
let targetPosition = new THREE.Vector3();
const corners = [
  new THREE.Vector3(-350, 250, 0),  // Top left
  new THREE.Vector3(350, 250, 0),   // Top right
  new THREE.Vector3(-350, -250, 0), // Bottom left
  new THREE.Vector3(350, -250, 0)   // Bottom right
];
let currentCornerIndex = 0;

// Handle spacebar press
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && !isMoving) {
    isMoving = true;
    targetPosition.copy(corners[currentCornerIndex]);
    currentCornerIndex = (currentCornerIndex + 1) % corners.length;
  }
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  if (isMoving) {
    // Move ball towards target
    const speed = 0.05;
    ball.position.lerp(targetPosition, speed);

    // Check if ball has reached target
    if (ball.position.distanceTo(targetPosition) < 1) {
      isMoving = false;
    }
  }

  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.left = width / -2;
  camera.right = width / 2;
  camera.top = height / 2;
  camera.bottom = height / -2;

  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

// Start animation
animate();