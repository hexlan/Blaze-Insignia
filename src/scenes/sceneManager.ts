import Scene from "./scene";

export default class SceneManager {
    #activeScene?: Scene;
    #nextScene?: Scene;

    changeScene(scene: Scene): void {
        if (this.#activeScene != scene) {
            this.#nextScene = scene;
        }
    }

    #transitionScene(): void {
        this.#activeScene = this.#nextScene;
        this.#nextScene = undefined;

        if(this.#activeScene) {
            this.#activeScene.initialize();
        }
    }

    update(deltaTime: number): void {
        if (this.#nextScene) {
            this.#transitionScene();
        }

        if (this.#activeScene) {
            this.#activeScene.update(deltaTime);
        }
    }

    draw(deltaTime: number): void {
        if (this.#activeScene) {
            this.#activeScene.draw(deltaTime);
        }
    }
}
