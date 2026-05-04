import Graphics, { Color } from "../graphics/graphics";
import { Buttons } from "../input/gamepad";
import InputManager from "../input/inputManager";
import { Keys } from "../input/keyboard";
import { Config } from "./config";
import ServiceLocator from "./serviceLocator";

export default class Cursor {
    #x: number = 0;
    #y: number = 0;
    #blinkAccumulator: number = 0;
    #isHidden: boolean = false;
    #isBlinking: boolean = false

    #handleInupt(deltaTime: number): void {
        const input = ServiceLocator.getInstance().get(InputManager);

        if (input.keyboard.wasKeyJustPressed(Keys.ArrowRight) ||
            input.keyboard.isKeyDownWithPolling(Keys.ArrowRight) ||
            input.gamepad?.wasButtonJustPressed(Buttons.Right) ||
            input.gamepad?.isButtonDownWithPolling(Buttons.Right)) {
            this.moveCursor(this.#x + 1, this.#y);
        }
        if (input.keyboard.wasKeyJustPressed(Keys.ArrowLeft) ||
            input.keyboard.isKeyDownWithPolling(Keys.ArrowLeft) ||
            input.gamepad?.wasButtonJustPressed(Buttons.Left) ||
            input.gamepad?.isButtonDownWithPolling(Buttons.Left)) {
            this.moveCursor(this.#x - 1, this.#y);
        }
        if (input.keyboard.wasKeyJustPressed(Keys.ArrowDown) ||
            input.keyboard.isKeyDownWithPolling(Keys.ArrowDown) ||
            input.gamepad?.wasButtonJustPressed(Buttons.Down) ||
            input.gamepad?.isButtonDownWithPolling(Buttons.Down)) {
            this.moveCursor(this.#x, this.#y + 1);
        }
        if (input.keyboard.wasKeyJustPressed(Keys.ArrowUp) ||
            input.keyboard.isKeyDownWithPolling(Keys.ArrowUp) ||
            input.gamepad?.wasButtonJustPressed(Buttons.Up) ||
            input.gamepad?.isButtonDownWithPolling(Buttons.Up)) {
            this.moveCursor(this.#x, this.#y - 1);
        }
    }

    update(deltaTime: number): void {
        this.#handleInupt(deltaTime);

        this.#blinkAccumulator += deltaTime;

        if (this.#blinkAccumulator > 500) {
            this.#isBlinking = !this.#isBlinking;
            this.#blinkAccumulator -= 500;
        }
    }

    draw(deltaTime: number): void {
        if (!this.#isBlinking && !this.#isHidden) {
            ServiceLocator.getInstance().get(Graphics).drawCharacter('\u2588', this.#x, this.#y, Color.White);
        }
    }

    moveCursor(x: number, y: number): void {
        this.#blinkAccumulator = 0;
        this.#isBlinking = false;
        if (x >= 0 && x < Config.COLS && y >= 0 && y < Config.ROWS) {
            this.#x = x;
            this.#y = y;
        }
    }

    hideCursor(): void {
        this.#isHidden = true;
    }

    showCursor(): void {
        this.#isHidden = false;
    }
}