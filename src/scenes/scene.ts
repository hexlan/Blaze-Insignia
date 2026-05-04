export default interface Scene {
    initialize(): void;
    update(deltaTime: number): void;
    draw(deltaTime: number): void;
}