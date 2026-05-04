import { Config } from "../core/config";

export default class KeyboardInput {
    #currentState = new KeyboardState();
    #previousState = new KeyboardState();
    #pollAccumulator = 0;

    constructor() {
        this.#addKeyDownListener();
        this.#addKeyUpListener();
    }

    #addKeyDownListener(): void {
        document.addEventListener('keydown', (e) => {
            if (e.key in Keys) {
                e.preventDefault();
                this.#currentState[e.key as keyof typeof Keys] = true;
            }
        });
    }

    #addKeyUpListener(): void {
        document.addEventListener('keyup', (e) => {
            if (e.key in Keys) {
                e.preventDefault();
                this.#currentState[e.key as keyof typeof Keys] = false;
            }
        });
    }

    update(deltaTime: number): void {
        this.#pollAccumulator += deltaTime;
        this.#previousState = { ...this.#currentState };
    }

    isKeyDown(key: Keys): boolean { return this.#currentState[key as keyof typeof Keys]; }

    isKeyDownWithPolling(key: Keys): boolean {
        if (this.#pollAccumulator > Config.POLL_RATE && this.#currentState[key as keyof typeof Keys]) {
            this.#pollAccumulator = 0;
            return true
        }

        return false;
    }

    wasKeyJustPressed(key: Keys): boolean {
        const keyProp = key as keyof typeof Keys;
        if (this.#currentState[keyProp] && !this.#previousState[keyProp]) {
            this.#pollAccumulator = 0;
            return true;
        }

        return false;
    }

    wasKeyJustReleased(key: Keys): boolean {
        const keyProp = key as keyof typeof Keys;
        return !this.#currentState[keyProp] && this.#previousState[keyProp];
    }
}

export enum Keys {
    ArrowUp = 'ArrowUp',
    ArrowDown = 'ArrowDown',
    ArrowRight = 'ArrowRight',
    ArrowLeft = 'ArrowLeft',
    Escape = 'Escape',
    Enter = 'Enter',
    Tab = 'Tab',
}

class KeyboardState {
    ArrowDown = false;
    ArrowLeft = false;
    ArrowRight = false;
    ArrowUp = false;
    Enter = false;
    Escape = false;
    Tab = false;
}