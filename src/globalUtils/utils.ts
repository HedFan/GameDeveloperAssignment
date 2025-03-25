import * as PIXI from "pixi.js";

import { btnTextStyle } from "./configs";

export function addButton(): PIXI.Graphics {
    const buttonBg = new PIXI.Graphics()
        .beginFill(0xFFA500)
        .drawRoundedRect(0, 0, 150, 80, 20)
        .lineStyle(3, 0xFF4500)
        .endFill();
    buttonBg.eventMode = "static"
    buttonBg.cursor = "pointer";
    buttonBg.pivot.set(75, 40);
    buttonBg.x = 0;
    buttonBg.y = -300;

    const buttonText = new PIXI.Text("Return", btnTextStyle);
    buttonText.anchor.set(0.5);
    buttonText.x = 77;
    buttonText.y = 40;
    buttonBg.addChild(buttonText as PIXI.DisplayObject);
    return buttonBg;
}
