import * as PIXI from "pixi.js";
import gsap from "gsap";

import { BaseScenario, btnTextStyle } from "@/globalUtils";
import {
    spriteQuantity,
    descriptionText,
    cardsYPositionRevers,
    cardsYPosition,
    quantityOfCards,
    moveCardInterval
} from "./configs";
import { createSprites } from "./utils";

export class FirstScenarioView extends BaseScenario {
    private readonly _playCardsContainer: PIXI.Container;
    private readonly _playCards: PIXI.Sprite[] = [];
    private readonly _bottomText: PIXI.Text;
    private readonly _textureArray : Array<PIXI.Texture>;

    private _moveInterval: NodeJS.Timeout | null = null;
    private _topCardIndex = spriteQuantity - 1;
    private _isBuild = false;
    private _isReverse = false;

    constructor() {
        super();
        this._textureArray = createSprites();

        this._bottomText = new PIXI.Text(descriptionText, btnTextStyle);
        this._bottomText.style.fontSize = 30;
        this._bottomText.anchor.set(0.5);
        this._bottomText.y = 200;
        this.addChild(this._bottomText as PIXI.DisplayObject);

        this._playCardsContainer = new PIXI.Container();
        this._playCardsContainer.sortableChildren = true;
        this._playCardsContainer.eventMode = "static"
        this._playCardsContainer.cursor = "pointer";
        this._playCardsContainer.y = -150;
        this.addChild(this._playCardsContainer as PIXI.DisplayObject);
    }

    public openScenario():void {
        super.openScenario();
        this.buildCards();
    }

    private startAnimation(): void {
        if(this._moveInterval) {
            return;
        }
        this._bottomText.visible = false;
        this._moveInterval = setInterval(() => this.moveCard(), moveCardInterval);
    }

    protected closeScenario(): void {
        super.closeScenario();
        if (this._moveInterval) {
            this.clearInterval();
            this.resetCardMoving();
            this.setFinishPosition();
            this._playCards.reverse();
        }
        this.stopMovingCards();
    }

    protected setFinishPosition(): void {
        for(let i = 0; i < this._playCards.length; i++) {
            const card = this._playCards[i];
            const cardName = Number(card.name);
            card.x = this._isReverse ? (spriteQuantity - cardName - 1) * 2 : cardName * 2 ;
            card.y = this._isReverse ? cardsYPositionRevers : cardsYPosition;
            card.zIndex = this._isReverse ? spriteQuantity - cardName : cardName;
        }
    }

    protected startListenerButtons(): void {
        super.startListenerButtons();
        this._playCardsContainer.on("pointerdown", () => this.startAnimation());
    }

    private moveCard(): void {
        if(this._topCardIndex < 0) {
            this.reverseCardPosition();
            this.resetCardMoving();
            this.clearInterval();
            return;
        }
        const topCard = this._playCards[this._topCardIndex];
        const xPosition = this.x + (spriteQuantity - this._topCardIndex - 1) * 2;
        const yPosition = topCard.y === cardsYPosition ? cardsYPositionRevers : cardsYPosition;

        gsap.to(topCard, {
            x: xPosition,
            y: yPosition,
            duration: 2,
            ease: "power2.out",
            onStart: () => {
                topCard.zIndex = spriteQuantity - this._topCardIndex;
            }
        });
        this._topCardIndex--;
    }

    private clearInterval(): void {
        if (this._moveInterval) {
            clearInterval(this._moveInterval);
            this._moveInterval = null;
        }
    }

    private resetCardMoving(): void {
        this._isReverse = !this._isReverse;
        this._topCardIndex = spriteQuantity - 1;
        this._bottomText.visible = true;
    }

    private reverseCardPosition(): void {
        this._playCards.reverse();
        this._playCards.forEach(card => card.zIndex = 0);
    }

    private stopMovingCards() {
        this.clearInterval();
        gsap.killTweensOf(this._playCards);
    }

    private buildCards(): void {
        if(this._isBuild) {
            return;
        }
        this._isBuild = true;
        for(let i = 0; i < spriteQuantity; i++) {
            const numberOfCard = Math.floor(Math.random() * quantityOfCards);
            const cardTexture = this._textureArray[numberOfCard];
            const cardSprite = new PIXI.Sprite(cardTexture);
            cardSprite.name = i.toString();
            cardSprite.x = i * 2;
            this._playCards.push(cardSprite);
            this._playCardsContainer.addChild(cardSprite as PIXI.DisplayObject);
        }
        const { width, height } = this._playCardsContainer;
        this._playCardsContainer.pivot.set(width/2, height/2);

    }

    destroy(): void {
        super.destroy();
        this.stopMovingCards();
    }
}
