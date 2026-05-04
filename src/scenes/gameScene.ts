import ContentManager from "../core/contentManager";
import Cursor from "../core/cursor";
import ServiceLocator from "../core/serviceLocator";
import Graphics, { Color, Texture } from "../graphics/graphics";
import InputManager from "../input/inputManager";
import { Keys } from "../input/keyboard";
import Scene from "./scene";
import { drawHealthBar } from "../utils/utils";
import { Config } from "../core/config";
import { Buttons } from "../input/gamepad";

export default class GameScene implements Scene {
    #cursor: Cursor = new Cursor();
    // Test Variable
     hp = 20;

    initialize(): void {

    }

    update(deltaTime: number): void {
        this.#cursor.update(deltaTime);
    }

    draw(deltaTime: number): void {
        const graphics = ServiceLocator.getInstance().get(Graphics);
        const input = ServiceLocator.getInstance().get(InputManager);
        const content = ServiceLocator.getInstance().get(ContentManager);

        // Character Info Pane
        graphics.drawRect(1, 8, 10, 1, Color.Red);
        graphics.drawRect(1, 9, 10, 2, Color.White);
        graphics.drawString('Soldier', 2, 8, Color.White);
        graphics.drawString(`HP ${this.hp}/32`, 2, 9, Color.Black);
        drawHealthBar(this.hp, 32, 2, 10, 8);

        if (input.keyboard.isKeyDown(Keys.Tab) || input.gamepad?.isButtonDown(Buttons.RB)) {
            graphics.drawTexture(content.get<Texture>('Eirika.png'), 0, 0);
        }


        this.#cursor.draw(deltaTime);
    }
}