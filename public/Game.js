import SceneManager from './SceneManager.js';
import GameElements from './GameElements.js';

/**
 * InputManager handles all user interactions with the game
 * Manages ball dragging, shooting, and movement
 */
class InputManager {
    /**
     * @param {GameElements} gameElements - Reference to game elements
     */
    constructor(gameElements) {
        this.gameElements = gameElements;
        
        // Game state variables
        this.isMoving = false;
        this.targetPosition = new THREE.Vector3();
        this.canShoot = true;
        this.isDragging = false;

        // Input handling setup
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.mousePlaneZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 400);
        this.intersectionPoint = new THREE.Vector3();

        this.setupEventListeners();
    }

    /**
     * Sets up all event listeners for mouse and touch input
     */
    setupEventListeners() {
        const renderer = this.gameElements.sceneManager.renderer;
        
        // Mouse event listeners
        renderer.domElement.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.handleInputStart(e.clientX, e.clientY);
        });

        renderer.domElement.addEventListener('mousemove', (e) => {
            e.preventDefault();
            this.handleInputMove(e.clientX, e.clientY);
        });

        renderer.domElement.addEventListener('mouseup', (e) => {
            e.preventDefault();
            this.handleInputEnd(e.clientX, e.clientY);
        });

        // Touch event listeners for mobile devices
        renderer.domElement.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.handleInputStart(touch.clientX, touch.clientY);
        });

        renderer.domElement.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.handleInputMove(touch.clientX, touch.clientY);
        });

        renderer.domElement.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            this.handleInputEnd(touch.clientX, touch.clientY);
        });
    }

    /**
     * Handles the start of input (mousedown/touchstart)
     * @param {number} clientX - X coordinate of input
     * @param {number} clientY - Y coordinate of input
     */
    handleInputStart(clientX, clientY) {
        if (!this.isMoving && this.canShoot) {
            // Convert screen coordinates to normalized device coordinates
            this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;
            
            // Check if ball was clicked/touched
            this.raycaster.setFromCamera(this.mouse, this.gameElements.sceneManager.camera);
            const intersects = this.raycaster.intersectObject(this.gameElements.ball);
            
            if (intersects.length > 0) {
                this.isDragging = true;
            }
        }
    }

    /**
     * Handles input movement (mousemove/touchmove)
     * @param {number} clientX - X coordinate of input
     * @param {number} clientY - Y coordinate of input
     */
    handleInputMove(clientX, clientY) {
        if (this.isDragging) {
            this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;
        }
    }

    /**
     * Handles end of input (mouseup/touchend)
     * Calculates shot direction and initiates ball movement
     * @param {number} clientX - X coordinate of input
     * @param {number} clientY - Y coordinate of input
     */
    handleInputEnd(clientX, clientY) {
        if (this.isDragging) {
            this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;

            // Calculate where the ball should go
            this.raycaster.setFromCamera(this.mouse, this.gameElements.sceneManager.camera);
            this.raycaster.ray.intersectPlane(this.mousePlaneZ, this.intersectionPoint);

            // Check if shot is within valid goal area
            if (Math.abs(this.intersectionPoint.x) <= 600 && 
                Math.abs(this.intersectionPoint.y) <= 180 && 
                this.intersectionPoint.z <= -300) {
                
                // Set target position for ball movement
                this.targetPosition.copy(new THREE.Vector3(
                    this.intersectionPoint.x,
                    this.intersectionPoint.y,
                    -400
                ));
                
                this.isMoving = true;
                this.canShoot = false;
            }

            this.isDragging = false;
        }
    }

    /**
     * Updates ball position and rotation
     * Called each frame in the animation loop
     */
    update() {
        if (this.isMoving) {
            const ball = this.gameElements.ball;
            const speed = 0.05;
            
            // Move ball towards target
            ball.position.lerp(this.targetPosition, speed);
            
            // Rotate ball for visual effect
            ball.rotation.x += 0.05;
            ball.rotation.y += 0.05;

            // Check if ball reached target
            if (ball.position.distanceTo(this.targetPosition) < 1) {
                this.isMoving = true;
                this.targetPosition.set(0, -300, 0);  // Return to start position
                
                // Reset game state when ball returns
                if (ball.position.y < -290) {
                    this.isMoving = false;
                    this.canShoot = true;
                }
            }
        }
    }
}

/**
 * Main Game class that coordinates all game components
 * Handles game initialization and main loop
 */
class Game {
    constructor() {
        // Initialize core components
        this.sceneManager = new SceneManager();
        this.gameElements = new GameElements(this.sceneManager);
        this.inputManager = new InputManager(this.gameElements);
        
        // Bind animation loop and start game
        this.animate = this.animate.bind(this);
        this.animate();
    }

    /**
     * Main animation loop
     * Updates all game components each frame
     */
    animate() {
        requestAnimationFrame(this.animate);
        
        this.gameElements.animateWater();
        this.inputManager.update();
        this.sceneManager.render();
    }
}

// Initialize the game
const game = new Game();

export default Game;