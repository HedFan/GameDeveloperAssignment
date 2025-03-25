import * as PIXI from "pixi.js";
import { Observable, Subject } from "rxjs";
import gsap from "gsap";

import { btnTextStyle } from "@/globalUtils";
import { buttonPositionY, buttonTitle } from "./configs";

export class MenuView extends PIXI.Container {
    private readonly _sendMenuCLickSubject$ = new Subject<string>();
    private readonly _buttonsContainer: PIXI.Container;
    private readonly _buttonsList: PIXI.Graphics[] = [];

    constructor() {
        super();
        this._buttonsContainer = new PIXI.Container();
        this._buttonsContainer.x = this.width / 2;
        this._buttonsContainer.y = this.height / 2;
        this.addChild(this._buttonsContainer as PIXI.DisplayObject);

        this.generateButtons();
    }

    public get sendResult$(): Observable<string> {
        return this._sendMenuCLickSubject$;
    }

    public restorePage(): void {
        this.visible = true;
        this._buttonsList.forEach(button => {
            button.scale.set(1);
            this.startListenerButtons(button as PIXI.DisplayObject);
        });
    }

    private clickButton(event: PIXI.DisplayObject): void {
        this._sendMenuCLickSubject$.next(`${event.name}`);
        this._buttonsList.forEach(button => {
            this.stopListenerButtons(button as PIXI.DisplayObject);
        });
        this.visible = false;
    };

    private generateButtons(): void {
        for (let i = 0; i < 3; i++) {
            const buttonBg = new PIXI.Graphics()
                .beginFill(0xFFA500)
                .drawRoundedRect(0, 0, 350, 80, 20)
                .lineStyle(3, 0xFF4500)
                .endFill();
            buttonBg.eventMode = "static"
            buttonBg.cursor = "pointer";
            buttonBg.pivot.set(175, 40);
            buttonBg.y = buttonPositionY[i];
            buttonBg.name = i.toString();

            const buttonText = new PIXI.Text(buttonTitle[i], btnTextStyle);
            buttonText.anchor.set(0.5);
            buttonText.x = 170;
            buttonText.y = 40;
            buttonBg.addChild(buttonText as PIXI.DisplayObject);
            this._buttonsList.push(buttonBg);
            this._buttonsContainer.addChild(buttonBg as PIXI.DisplayObject);
            this.startListenerButtons(buttonBg as PIXI.DisplayObject);
        }
    }

    private startListenerButtons(button: PIXI.DisplayObject): void {
        button
            .on("pointerdown", this.clickButtonHandler)
            .on("pointerover", this.pointerOverHandler)
            .on("pointerout", this.pointerOutHandler);
    }

    private stopListenerButtons(button: PIXI.DisplayObject): void {
        button
            .off("pointerdown",  this.clickButtonHandler)
            .off("pointerover", this.pointerOverHandler)
            .off("pointerout", this.pointerOutHandler);
    }

    private clickButtonHandler = (event: PIXI.FederatedPointerEvent) => {
        this.clickButton(event.currentTarget as PIXI.DisplayObject);
    };

    private pointerOverHandler = (event: PIXI.FederatedPointerEvent) => {
        gsap.to((event.currentTarget as PIXI.DisplayObject).scale, { x: 1.1, y: 1.1, duration: 0.15, ease: "power1.out" });
    };

    private pointerOutHandler = (event: PIXI.FederatedPointerEvent) => {
        gsap.to((event.currentTarget as PIXI.DisplayObject).scale, {x: 1, y: 1, duration: 0.15, ease: "power1.out"});
    };

    destroy(): void {
        super.destroy();
        this._sendMenuCLickSubject$.unsubscribe();
        this._buttonsList.forEach(button => {
            this.stopListenerButtons(button as PIXI.DisplayObject);
        });
    }
}
