import ServiceLocator from "./core/serviceLocator";
import InputManager from "./input/inputManager";
import Graphics, { Color } from "./graphics/graphics";
import ContentManager from "./core/contentManager";
import SceneManager from "./scenes/sceneManager";
import GameScene from "./scenes/gameScene";

ServiceLocator.getInstance().register(new InputManager());
ServiceLocator.getInstance().register(new Graphics());
const DATA_ROOT = __DATA_PATH__;
ServiceLocator.getInstance().register(new ContentManager(DATA_ROOT));
ServiceLocator.getInstance().register(new SceneManager());

const input = ServiceLocator.getInstance().get(InputManager);
const graphics = ServiceLocator.getInstance().get(Graphics);
const content = ServiceLocator.getInstance().get(ContentManager);
const sceneManager = ServiceLocator.getInstance().get(SceneManager);

let previousTime = performance.now();

async function loadContent(): Promise<void> {
    await Promise.all([
        content.loadTexture('Eirika.png',)
    ]);
}

await loadContent();

sceneManager.changeScene(new GameScene());

function gameLoop(currentTime: number): void {
    const deltaTime = currentTime - previousTime;
    previousTime = currentTime;

    update(deltaTime);
    draw(deltaTime);

    requestAnimationFrame(gameLoop);
}

function update(deltaTime: number): void {
    sceneManager.update(deltaTime);

    input.update(deltaTime);
}



function draw(deltaTime: number): void {
    sceneManager.draw(deltaTime);

    graphics.render();
}


requestAnimationFrame(gameLoop);
