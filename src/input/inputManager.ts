import GamepadInput from "./gamepad";
import KeyboardInput from "./keyboard";

export default class InputManager {
    keyboard = new KeyboardInput();
    #gamepads: GamepadInput[] = [];
    gamepad: GamepadInput | undefined = undefined;

    constructor() {
        window.addEventListener('gamepadconnected', (e) => {
            const gamepad = new GamepadInput(e.gamepad.index);
            this.#gamepads.push(gamepad);

            if (!this.gamepad) {
                this.gamepad = gamepad;
            }

        });
        window.addEventListener('gamepaddisconnected', (e) => {
            const wasActiveGamepad = e.gamepad.index === this.gamepad?.gamepadIndex;
            this.#gamepads = this.#gamepads.filter(gamepad => gamepad.gamepadIndex != e.gamepad.index);
            if(wasActiveGamepad) {
                this.gamepad = this.#gamepads.find(x => true);
            }
        });
    }

    update(deltaTime: number): void {
        this.keyboard.update(deltaTime);
        this.gamepad?.update(deltaTime);
    }
}
