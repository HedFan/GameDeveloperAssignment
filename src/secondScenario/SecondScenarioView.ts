import * as PIXI from "pixi.js";
import gsap from "gsap";

import { BaseScenario } from "@/globalUtils";
import { MagicWordsService } from "./MagicWordsService";
import {
    dialogElementPosition,
    dialogueTextStyle,
    dialogueTimeStep,
    dialogueTitleTextStyle,
    dialogueYInitPosition,
    dialogueYStep,
    iFetchData
} from "./configs";

export class SecondScenarioView extends BaseScenario {
    private readonly _speechTexture: PIXI.Texture;
    private readonly _dialogContainer: PIXI.Container;
    private readonly _speechList: Array<PIXI.Container> = [];

    private _timeInterval: NodeJS.Timeout | null = null;
    private _dialogueIndex = 0;
    private _removedDialogueIndex = 0;

    constructor() {
        super();
        this._speechTexture = PIXI.Texture.from("assets/images/speech.png");
        this._dialogContainer = new PIXI.Container();
        this._dialogContainer.y = dialogueYInitPosition;
        this.addChild(this._dialogContainer as PIXI.DisplayObject);
    }

    public openScenario(): void {
        super.openScenario();
        MagicWordsService.getInstance()
            .then(service => this.parceData(service.getData()))
            .then(() => this.runAnimation());
    }

    protected closeScenario(): void {
        super.closeScenario();
        this.resetAnimation();
    }

    protected runAnimation(): void {
        if(this._timeInterval) {
            return;
        }
        this._timeInterval = setInterval(() => this.startTyping(), dialogueTimeStep);
    }

    private resetAnimation() {
        this.clearInterval();
        this.killAnimation();
        this._dialogContainer.y = dialogueYInitPosition;
        this._dialogueIndex = 0;
        this._removedDialogueIndex = 0;
        this._speechList.forEach(element => {
            element.visible = false;
            element.alpha = 0;
        });
    }

    private killAnimation(): void {
        gsap.killTweensOf(this._speechList);
        gsap.killTweensOf(this._dialogContainer);
    }

    private clearInterval(): void {
        if (this._timeInterval) {
            this.killAnimation();
            clearInterval(this._timeInterval);
            this._timeInterval = null;
        }
    }

    protected startTyping(): void {
        if(this._dialogueIndex === this._speechList.length) {
            this.clearInterval();
            return;
        }
        const dialogueCard = this._speechList[this._dialogueIndex];
        dialogueCard.visible = true;

        gsap.to(dialogueCard, {
            alpha: 1,
            duration: 0.2,
            ease: "power2.out"
        });
        if(this._dialogueIndex > 3) {
            gsap.to(this._dialogContainer, {
                y: this._dialogContainer.y + (this._speechTexture.height + dialogueYStep)/2 + 15,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                    this._speechList[this._removedDialogueIndex].visible = false;
                    this._speechList[this._removedDialogueIndex].alpha = 0;
                    this._removedDialogueIndex++;
                }
            });
        }

        this._dialogueIndex++;
    }

    protected parceData(data: iFetchData | null): void {
        if(!data || !!this._speechList.length) {
            return;
        }
        this.generateDialogue(data);
    }


    private generateDialogue(data: iFetchData): void {
        const { dialogue, emojies, avatars } = data;
        const {
            speechLeftXPosition,
            speechRightXPosition,
            titleLeft,
            avatarLeft,
            titleRight,
            avatarRight,
            titleNeutral,
            lineHeight
        } = dialogElementPosition;
        const tempText = new PIXI.Text("", dialogueTextStyle);

        for(let i = 0; i < dialogue.length; i++) {
            const dialogContainer = new PIXI.Container();
            const textContainer = new PIXI.Container();
            const speechBG = new PIXI.Sprite(this._speechTexture);
            const { text, name } = dialogue[i];

            speechBG.anchor.set(0.5);
            dialogContainer.addChild(speechBG as PIXI.DisplayObject);
            dialogContainer.addChild(textContainer as PIXI.DisplayObject);
            const avatar = avatars.find(avatar => avatar.name === name);

            const titleName = new PIXI.Text(name, dialogueTitleTextStyle);
            dialogContainer.addChild(titleName as PIXI.DisplayObject);

            if(avatar) {
                const emojiSprite = PIXI.Sprite.from(avatar.url);
                emojiSprite.anchor.set(0.5);
                emojiSprite.scale.set(0.8);
                dialogContainer.addChild(emojiSprite as PIXI.DisplayObject);

               if(avatar.position === "left") {
                   dialogContainer.x = speechLeftXPosition;
                   speechBG.scale.x = 1;
                   titleName.anchor.set(0);
                   titleName.position.copyFrom(titleLeft);
                   emojiSprite.position.copyFrom(avatarLeft);
               }
               else {
                   dialogContainer.x = speechRightXPosition;
                   speechBG.scale.x = -1;
                   titleName.position.copyFrom(titleRight);
                   titleName.anchor.set(1);
                   emojiSprite.position.copyFrom(avatarRight);
               }
            }
            else {
                titleName.anchor.set(0.5);
                titleName.position.copyFrom(titleNeutral);
            }
            dialogContainer.y = -i * dialogueYStep;

            const textObject = new PIXI.Text(text, dialogueTextStyle);
            textContainer.addChild(textObject as PIXI.DisplayObject);
            let xOffset = 0;
            let currentLineHeight = 3;
            const words = text.split(/(\{.*?\}|\s+)/g);
            textObject.text = "";
            for (const word of words) {
                const emojiMatch = word.match(/\{(.*?)\}/);
                if (emojiMatch) {
                    const emojiName = emojiMatch[1];
                    const emojiData = emojies.find(e => e.name === emojiName);

                    if (emojiData) {
                        const emojiSprite = PIXI.Sprite.from(emojiData.url);
                        emojiSprite.width = 20;
                        emojiSprite.height = 20;
                        emojiSprite.x = xOffset;
                        emojiSprite.y = currentLineHeight;
                        textContainer.addChild(emojiSprite as PIXI.DisplayObject);
                        textObject.text += " _ ";
                        xOffset += 25;
                    }
                } else {
                    textObject.text += word;
                    tempText.text = word;
                    if(xOffset > speechBG.width - 50) {
                        currentLineHeight = lineHeight;
                        xOffset = tempText.width;
                    }
                    xOffset += (tempText.width + 1);
                }
            }

            textContainer.pivot.set(speechBG.width/2, speechBG.height/2);
            textContainer.position.set(10, 5);
            dialogContainer.visible = false;
            dialogContainer.alpha = 0;
            this._speechList.push(dialogContainer);
            this._dialogContainer.addChild(dialogContainer as PIXI.DisplayObject);
        }
    }

    destroy(): void {
        super.destroy();
        this.killAnimation();
        this.clearInterval();
    }
}
