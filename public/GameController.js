class GameController {
    constructor(sceneManager, gameElements) {
        this.sceneManager = sceneManager;
        this.gameElements = gameElements;
        this.isMoving = false;
        this.targetPosition = new THREE.Vector3();
        this.canShoot = true;
        this.isDragging = false;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.mousePlaneZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 400);
        this.intersectionPoint = new THREE.Vector3();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const renderer = this.sceneManager.renderer;
        
        // Mouse events
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

        // Touch events
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

    handleInputStart(clientX, clientY) {
        if (!this.isMoving && this.canShoot) {
            this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;
            
            this.raycaster.setFromCamera(this.mouse, this.sceneManager.camera);
            const intersects = this.raycaster.intersectObject(this.gameElements.ball);
            
            if (intersects.length > 0) {
                this.isDragging = true;
            }
        }
    }

    handleInputMove(clientX, clientY) {
        if (this.isDragging) {
            this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;
        }
    }

    handleInputEnd(clientX, clientY) {
        if (this.isDragging) {
            this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.sceneManager.camera);
            this.raycaster.ray.intersectPlane(this.mousePlaneZ, this.intersectionPoint);

            if (Math.abs(this.intersectionPoint.x) <= 600 && 
                Math.abs(this.intersectionPoint.y) <= 180 && 
                this.intersectionPoint.z <= -300) {
                
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

    update() {
        if (this.isMoving) {
            const ball = this.gameElements.ball;
            const speed = 0.05;
            ball.position.lerp(this.targetPosition, speed);
            ball.rotation.x += 0.05;
            ball.rotation.y += 0.05;

            if (ball.position.distanceTo(this.targetPosition) < 1) {
                this.isMoving = true;
                this.targetPosition.set(0, -300, 0);
                
                if (ball.position.y < -290) {
                    this.isMoving = false;
                    this.canShoot = true;
                }
            }
        }
    }
}

export default GameController;