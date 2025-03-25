import * as PIXI from "pixi.js";
import gsap from "gsap";
import { Observable, Subject } from "rxjs";

import { addButton } from "./utils";

export abstract class BaseScenario extends PIXI.Container {
    private readonly _sendReturnCLickSubject$ = new Subject<void>();

    protected _returnButton: PIXI.Graphics;

    protected constructor() {
        super();
        this.visible = false;
        this._returnButton = addButton();
        this.addChild(this._returnButton as PIXI.DisplayObject);
    }

    public openScenario(): void {
        this.visible = true;
        this.startListenerButtons();
    }

    public get sendReturnCLick$(): Observable<void> {
        return this._sendReturnCLickSubject$;
    }

    protected closeScenario(): void {
        this.visible = false;
        this.stopListenerButtons();
        this._sendReturnCLickSubject$.next();
    }

    protected startListenerButtons(): void {
        this._returnButton
            .on("pointerdown", this.clickButton)
            .on("pointerover", this.pointerOverHandler)
            .on("pointerout", this.pointerOutHandler);
    }

    protected stopListenerButtons(): void {
        this._returnButton
            .off("pointerdown", this.clickButton)
            .off("pointerover", this.pointerOverHandler)
            .off("pointerout", this.pointerOutHandler);
    }

    protected clickButton = () => {
        this.closeScenario();
    };

    protected pointerOverHandler = () => {
        gsap.to(this._returnButton.scale, { x: 1.1, y: 1.1, duration: 0.15, ease: "power1.out" });
    };

    protected pointerOutHandler = () => {
        gsap.to(this._returnButton.scale, { x: 1, y: 1, duration: 0.15, ease: "power1.out" });
    };

    destroy(): void {
        super.destroy();
        this._sendReturnCLickSubject$.unsubscribe();
        this.stopListenerButtons();
    }
}
