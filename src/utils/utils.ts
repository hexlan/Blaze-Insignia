import ServiceLocator from "../core/serviceLocator";
import Graphics, { Color } from "../graphics/graphics";

export function drawHealthBar(
    currentHp: number,
    maxHp: number,
    x: number,
    y: number,
    length: number): void {
    let greenBars = Math.floor((currentHp / maxHp) * length);


    if (greenBars === 0 && currentHp > greenBars) {
        greenBars = 1;
    }

    
    const graphics = ServiceLocator.getInstance().get(Graphics);
    for (let i = 0; i < length; i++) {
        graphics.drawCharacter('\u2580', x + i, y, i < greenBars ? Color.Green : Color.Red);
    }
}