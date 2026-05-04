import Asset from "./asset";
import { Texture } from "../graphics/graphics";

export default class ContentManager {
    #content = new Map<string, Asset>();
    #root: string;

    constructor(root: string) {
        this.#root = root;
    }

    get<T extends Asset>(asset: string): T {
        if (this.#content.has(asset)) {
            return this.#content.get(asset) as T;
        } else {
            throw new Error(`"${asset}" not loaded\nInclude "${asset}" in the loadContent function in main.js`);
        }
    }

    async loadTexture(asset: string): Promise<void> {
        const path = `${this.#root}images/${asset}`;
        const image = await this.#loadImage(path);
        this.#content.set(asset, image);
    }

    #loadImage(path: string): Promise<Texture> {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            const img = new Image();

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                resolve({
                    width: img.width,
                    height: img.height,
                    data: ctx.getImageData(0, 0, img.width, img.height).data
                });
            };

            img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
            img.src = path;
        });
    }
}
