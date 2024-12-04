class GameElements {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.createWater();
        this.createBall();
        this.createGoal();
    }

    createWater() {
        const waterGeometry = new THREE.PlaneGeometry(5000, 2000);
        const waterMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x1E90FF,
            shininess: 100,
            transparent: true,
            opacity: 0.8
        });
        
        this.waterPlane = new THREE.Mesh(waterGeometry, waterMaterial);
        this.waterPlane.position.set(0, -300, -800);
        this.waterPlane.rotation.x = -Math.PI / 4;
        this.sceneManager.add(this.waterPlane);
    }

    createBall() {
        const sphereGeometry = new THREE.IcosahedronGeometry(40, 1);
        const sphereMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xFFFF00,
            shininess: 100,
            flatShading: true
        });
        
        this.ball = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.ball.position.set(0, -300, 0);
        this.sceneManager.add(this.ball);
    }

    createGoal() {
        const postMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xFFFFFF,
            shininess: 100,
            emissive: 0x444444
        });

        const goalGroup = new THREE.Group();
        const postRadius = 8;
        const goalWidth = 1200;
        const goalHeight = 360;
        const goalDepth = 160;

        const createPost = (x, y, z, height, rotation = [0, 0, 0]) => {
            const geometry = new THREE.CylinderGeometry(postRadius, postRadius, height);
            const post = new THREE.Mesh(geometry, postMaterial);
            post.position.set(x, y, z);
            post.rotation.set(...rotation);
            return post;
        };

        const leftPost = createPost(-goalWidth/2, -goalHeight/2 + goalHeight/2, -400, goalHeight);
        const rightPost = createPost(goalWidth/2, -goalHeight/2 + goalHeight/2, -400, goalHeight);
        const crossbar = createPost(0, goalHeight/2, -400, goalWidth, [0, 0, Math.PI/2]);
        const sideBarLeft = createPost(-goalWidth/2, 0, -400-goalDepth/2, goalDepth, [Math.PI/2, 0, 0]);
        const sideBarRight = createPost(goalWidth/2, 0, -400-goalDepth/2, goalDepth, [Math.PI/2, 0, 0]);
        const backBar = createPost(0, 0, -400-goalDepth, goalWidth, [0, 0, Math.PI/2]);

        goalGroup.add(leftPost, rightPost, crossbar, sideBarLeft, sideBarRight, backBar);

        this.createNet(goalGroup, goalWidth, goalHeight, goalDepth);

        this.goal = goalGroup;
        this.sceneManager.add(this.goal);
    }

    createNet(goalGroup, goalWidth, goalHeight, goalDepth) {
        const netMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.3 });
        const netSegmentsWidth = 40;
        const netSegmentsHeight = 20;

        // Vertical net lines
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

        // Horizontal net lines
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
    }

    animateWater() {
        if (this.waterPlane) {
            this.waterPlane.rotation.x = -Math.PI / 4 + Math.sin(Date.now() * 0.001) * 0.05;
        }
    }
}

export default GameElements;