/**
 * SceneManager class handles all Three.js scene setup and rendering operations
 * Responsible for camera, renderer, lighting, and general scene management
 */
class SceneManager {
    constructor() {
        // Initialize core Three.js components
        this.scene = new THREE.Scene();
        
        // Setup camera with perspective view
        // Parameters: FOV, aspect ratio, near clipping plane, far clipping plane
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        
        // Initialize renderer with antialiasing for smoother edges
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        
        // Configure renderer settings
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x87CEEB);  // Set sky blue background color
        document.body.appendChild(this.renderer.domElement);
        
        // Position camera away from scene center
        this.camera.position.z = 1000;

        // Initialize scene lighting
        this.setupLighting();

        // Setup window resize handler
        window.addEventListener('resize', () => this.handleResize());
    }

    /**
     * Sets up scene lighting with ambient and directional lights
     * Ambient light provides overall scene illumination
     * Directional light creates shadows and depth
     */
    setupLighting() {
        // Add ambient light for base illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        
        // Add directional light for shadows and highlighting
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        
        // Add lights to scene
        this.scene.add(ambientLight);
        this.scene.add(directionalLight);
    }

    /**
     * Handles window resize events to maintain proper display
     * Updates camera aspect ratio and renderer size
     */
    handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    /**
     * Renders the current state of the scene
     * Called each frame in the animation loop
     */
    render() {
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Helper method to add objects to the scene
     * @param {THREE.Object3D} object - The 3D object to add to the scene
     */
    add(object) {
        this.scene.add(object);
    }
}

export default SceneManager;