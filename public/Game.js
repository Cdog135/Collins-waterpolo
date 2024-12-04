import SceneManager from './SceneManager.js';
import GameElements from './GameElements.js';
import GameController from './GameController.js';

class Game { 
    constructor() {
        this.sceneManager = new SceneManager();
        this.gameElements = new GameElements(this.sceneManager);
        this.gameController = new GameController(this.sceneManager, this.gameElements);
        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.gameElements.animateWater();
        this.gameController.update();
        this.sceneManager.render();
    }
}

// Create a new game instance when the module loads
new Game();