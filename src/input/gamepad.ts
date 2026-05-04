import { Config } from "../core/config";

export default class GamepadInput {
    gamepadIndex: number;
    #previousState: GamepadButton[] = Array.from({ length: 17 }, () => ({ pressed: false, touched: false, value: 0 }));
    #pollAccumulator = 0;

    constructor(gamepadIndex: number) {
        this.gamepadIndex = gamepadIndex;
    }

    update(deltaTime: number): void {
        this.#pollAccumulator += deltaTime;
        const gamepad = navigator.getGamepads()[this.gamepadIndex];
        if (gamepad) {
            this.#previousState = gamepad.buttons.map(btn => ({
                pressed: btn.pressed,
                touched: btn.touched,
                value: btn.value
            }))
        }
    }

    isButtonDown(button: Buttons): boolean {
        const gamepad = navigator.getGamepads()[this.gamepadIndex];
        if (gamepad) {
            return gamepad.buttons[button as number].pressed;
        }

        return false;
    }

    isButtonDownWithPolling(button: Buttons): boolean {
        if (this.#pollAccumulator > Config.POLL_RATE) {
            const gamepad = navigator.getGamepads()[this.gamepadIndex];
            if (gamepad && gamepad.buttons[button as number].pressed) {
                this.#pollAccumulator = 0;
                return true
            }
        }

        return false;
    }

    wasButtonJustPressed(button: Buttons): boolean {
        const buttonId = button as number;
        const gamepad = navigator.getGamepads()[this.gamepadIndex];
        if (gamepad && this.#previousState &&
            gamepad.buttons[buttonId].pressed &&
            !this.#previousState[buttonId].pressed) {
            this.#pollAccumulator = 0;
            return true;
        }

        return false;
    }

    wasButtonJustReleased(button: Buttons): boolean {
        const buttonId = button as number;
        const gamepad = navigator.getGamepads()[this.gamepadIndex];
        if (gamepad && this.#previousState &&
            !gamepad.buttons[buttonId].pressed &&
            this.#previousState[buttonId].pressed) {
            this.#pollAccumulator = 0;
            return true;
        }

        return false;
    }
}

export enum Buttons {
    A = 0,
    B = 1,
    RB = 5,
    Up = 12,
    Down = 13,
    Left = 14,
    Right = 15
}
