import * as PIXI from "pixi.js";

import { cardHeight, cardsPerRow, cardWidth, quantityOfCards } from "./configs";

export function createSprites(): Array<PIXI.Texture> {
    const cardsTexture = PIXI.Texture.from("assets/images/playing-cards.png");
    const textureArray = [];

    for (let i = 0; i < quantityOfCards; i++) {
        const colIndex = Math.floor(i / cardsPerRow);
        const rowIndex = i % cardsPerRow;

        const texture = new PIXI.Texture(
            cardsTexture.baseTexture,
            new PIXI.Rectangle(rowIndex * cardWidth, colIndex * cardHeight, cardWidth, cardHeight)
        );
        textureArray.push(texture);
    }
    return textureArray;
}
