import * as PIXI from "pixi.js";

export interface iFetchData {
    readonly avatars: Array<iAvatars>;
    readonly dialogue: Array<iDialogue>;
    readonly emojies: Array<iEmojies>;
}

export interface iAvatars {
    readonly name: string;
    readonly url: string;
    readonly position: "left" | "right";
}

export interface iDialogue {
    readonly name: string;
    readonly text: string;
}

export interface iEmojies {
    readonly name: string;
    readonly url: string;
}

export const dialogueTextStyle: Partial<PIXI.ITextStyle> = {
    fontFamily: "Comic Sans MS",
    fontSize: 16,
    fill: "#323232",
    dropShadow: false,
    wordWrap: true,
    wordWrapWidth: 350
};

export const dialogueTitleTextStyle: Partial<PIXI.ITextStyle> = {
    fontFamily: "Comic Sans MS",
    fontSize: 20,
    fill: "#121212",
    dropShadow: false
};

export const dialogElementPosition = {
    lineHeight: 25,
    speechLeftXPosition: -60,
    speechRightXPosition: 60,
    titleLeft: {x: -185, y: -76},
    avatarLeft: {x: -205, y: 25},
    titleRight: {x: 177, y: -48},
    avatarRight: {x: 206, y: 31},
    titleNeutral: {x: -130, y: -65}
}

export const dialogueYInitPosition = 270;
export const dialogueYStep = 130;
export const dialogueTimeStep = 1500;
