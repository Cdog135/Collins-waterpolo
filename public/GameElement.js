/**
 * GameElements class manages all 3D objects in the game
 * Handles creation and management of ball, water plane, and goal
 */
class GameElements {
    /**
     * @param {SceneManager} sceneManager - Reference to the scene manager
     */
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.ball = null;
        this.waterPlane = null;
        this.goal = null;

        // Initialize game objects
        this.createWater();
        this.createBall();
        this.createGoal();
    }

    /**
     * Creates the water plane with animation capabilities
     * Uses semi-transparent blue material for water effect
     */
    createWater() {
        // Create large plane for water surface
        const waterGeometry = new THREE.PlaneGeometry(5000, 2000);
        const waterMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x1E90FF,        // Ocean blue color
            shininess: 100,         // Reflective surface
            transparent: true,       // Enable transparency
            opacity: 0.8            // Slightly see-through
        });
        
        this.waterPlane = new THREE.Mesh(waterGeometry, waterMaterial);
        this.waterPlane.position.set(0, -300, -800);  // Position below scene
        this.waterPlane.rotation.x = -Math.PI / 4;    // Tilt for perspective
        
        this.sceneManager.add(this.waterPlane);
    }

    /**
     * Creates the water polo ball
     * Uses icosahedron geometry for more interesting shape
     */
    createBall() {
        // Create detailed sphere for the ball
        const sphereGeometry = new THREE.IcosahedronGeometry(40, 1);
        const sphereMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xFFFF00,        // Yellow color
            shininess: 100,         // Glossy finish
            flatShading: true       // Faceted appearance
        });
        
        this.ball = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.ball.position.set(0, -300, 0);  // Starting position
        
        this.sceneManager.add(this.ball);
    }

    /**
     * Creates the water polo goal structure
     * Includes posts, crossbar, and net
     */
    createGoal() {
        // Material for goal posts
        const postMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xFFFFFF,        // White color
            shininess: 100,         // Metallic look
            emissive: 0x444444      // Slight glow effect
        });

        // Set up goal dimensions
        const goalGroup = new THREE.Group();
        const postRadius = 8;
        const goalWidth = 1200;
        const goalHeight = 360;
        const goalDepth = 160;

        /**
         * Helper function to create goal posts
         * @param {number} x - X position
         * @param {number} y - Y position
         * @param {number} z - Z position
         * @param {number} height - Post height
         * @param {Array} rotation - Rotation angles [x,y,z]
         */
        function createPost(x, y, z, height, rotation = [0, 0, 0]) {
            const geometry = new THREE.CylinderGeometry(postRadius, postRadius, height);
            const post = new THREE.Mesh(geometry, postMaterial);
            post.position.set(x, y, z);
            post.rotation.set(...rotation);
            return post;
        }

        // Create main goal structure
        const leftPost = createPost(-goalWidth/2, -goalHeight/2 + goalHeight/2, -400, goalHeight);
        const rightPost = createPost(goalWidth/2, -goalHeight/2 + goalHeight/2, -400, goalHeight);
        const crossbar = createPost(0, goalHeight/2, -400, goalWidth, [0, 0, Math.PI/2]);

        // Assemble goal
        goalGroup.add(leftPost, rightPost, crossbar);

        this.goal = goalGroup;
        this.sceneManager.add(this.goal);
    }

    /**
     * Animates the water plane to create wave effect
     * Called each frame in the animation loop
     */
    animateWater() {
        if (this.waterPlane) {
            // Create gentle wave motion using sine wave
            this.waterPlane.rotation.x = -Math.PI / 4 + Math.sin(Date.now() * 0.001) * 0.05;
        }
    }
}

export default GameElements;