import { Config } from "../core/config";
import Asset from "../core/asset";

export interface Texture extends Asset {
    width: number;
    height: number;
    data: ImageDataArray;
}

export enum Color {
    Black = '#320011',
    DarkRed = '#933942',
    Red = '#c33846',
    DarkOrange = '#c66f5e',
    Orange = '#e78c5b',
    Yellow = '#f7d554',
    White = '#ece8c2',
    Green = '#8da24e',
    DarkGreen = '#627057',
    Purple = '#5f3a60',
    Blue = '#5e80b2',
    LightBlue = '#6db7c3',
    LightGreen = '#d2cb3e',
    Tan = '#e8bf92',
    DarkGray = '#876672',
    LightGray = '#b7a39d'
}

class CellData {
    bgColor = Color.Green;
    text = '';
    textColor = Color.White;
}

export default class Graphics {
    #canvas: HTMLCanvasElement;
    #cellBuffer: CellData[];
    #ctx: CanvasRenderingContext2D;

    constructor() {
        this.#canvas = document.getElementById(Config.CANVAS_NAME) as HTMLCanvasElement;
        this.#canvas.width = Config.COLS * Config.CELL_WIDTH;
        this.#canvas.height = Config.ROWS * Config.CELL_HEIGHT;

        this.#ctx = this.#canvas.getContext('2d')!;
        this.#ctx.font = Config.FONT;
        this.#ctx.textAlign = 'left';
        this.#ctx.textBaseline = 'top';

        this.#cellBuffer = Array.from({ length: Config.ROWS * Config.COLS }, () => new CellData());
    }

    drawBackground(x: number, y: number, color: Color): void {
        let index = y * Config.COLS + x;
        this.#cellBuffer[index].bgColor = color;
    }

    drawCharacter(char: string, x: number, y: number, color: Color): void {
        let index = y * Config.COLS + x;
        this.#cellBuffer[index].text = char;
        this.#cellBuffer[index].textColor = color;
    }

    drawString(text: string, x: number, y: number, color: Color): void {
        for (let i = 0; i < text.length; i++) {
            this.drawCharacter(text[i], x + i, y, color)
        }
    }

    drawRect(x: number, y: number, width: number, height: number, color: Color): void {
        for (let h = 0; h < height; h++) {
            for (let w = 0; w < width; w++) {
                this.drawBackground(x + w, y + h, color);
            }
        }
    }

    drawTexture(texture: Texture, x: number, y: number): void {
        for (let h = 0; h < texture.height; h += 2) {
            for (let w = 0; w < texture.width; w++) {
                const pixelOneIndex = (h * texture.width + w) * 4;
                const pixelTwoIndex = ((h + 1) * texture.width + w) * 4;

                const pixelOneAlpha = texture.data[pixelOneIndex + 3] === 0
                const pixelTwoAlpha = texture.data[pixelTwoIndex + 3] === 0

                const pixelOneColor = getColorFromArr(Array.from(texture.data.slice(pixelOneIndex, pixelOneIndex + 3)));
                const pixelTwoColor = getColorFromArr(Array.from(texture.data.slice(pixelTwoIndex, pixelTwoIndex + 3)));

                if (pixelTwoAlpha || pixelOneAlpha) {
                    if (pixelOneAlpha && pixelTwoAlpha) {
                        continue;
                    }

                    if (pixelTwoAlpha) {
                        this.drawCharacter('\u2580', x + w, y + Math.floor(h / 2), pixelOneColor);
                    } else {
                        this.drawCharacter('\u2584', x + w, y + Math.floor(h / 2), pixelTwoColor);
                    }
                } else {
                    this.drawBackground(x + w, y + Math.floor(h / 2), pixelOneColor);
                    this.drawCharacter('\u2584', x + w, y + Math.floor(h / 2), pixelTwoColor);
                }
            }
        }
    }

    render(): void {
        for (let i = 0; i < Config.ROWS * Config.COLS; i++) {
            const x = i % Config.COLS;
            const y = Math.floor(i / Config.COLS);
            const cellData = this.#cellBuffer[i];

            this.#ctx.fillStyle = cellData.bgColor;
            this.#ctx.fillRect(x * Config.CELL_WIDTH, y * Config.CELL_HEIGHT, Config.CELL_WIDTH, Config.CELL_HEIGHT);
            this.#ctx.fillStyle = cellData.textColor;
            this.#ctx.fillText(cellData.text, x * Config.CELL_WIDTH, y * Config.CELL_HEIGHT + 3);
        }

        this.#clear();
    }

    #clear(): void {
        this.#cellBuffer = Array.from({ length: Config.ROWS * Config.COLS }, () => new CellData());
    }
}

function getColorFromArr(arr: number[]): Color {
    return Object.values(Color).find(c => c === '#' + arr.map(v => v.toString(16).padStart(2, '0')).join('')) || Color.Black;
}