import * as PIXI from "pixi.js";
import { Emitter } from "@pixi/particle-emitter";

import { BaseScenario } from "@/globalUtils";
import { emitterConfig } from "./configs";

export class ThirdScenarioView extends BaseScenario {
    private readonly _emitter: Emitter;

    private readonly _particleContainer: PIXI.Container;
    private _animationFrame: number | null = null;
    constructor() {
        super();

        this._particleContainer = new PIXI.Container();
        this._particleContainer.y = 200;
        this.addChild(this._particleContainer as PIXI.DisplayObject);
        const particle: PIXI.Texture = PIXI.Texture.from("assets/images/particle.png");
        const fire: PIXI.Texture = PIXI.Texture.from("assets/images/fire.png");
        const firePlace: PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.from("assets/images/fireplace.png"));
        firePlace.anchor.set(0.5);
        firePlace.y = 200;

        this.addChild(firePlace as PIXI.DisplayObject);

        emitterConfig.behaviors.find((b: any) => b.type === "textureRandom")!.config.textures = [particle, fire];
        this._emitter = new Emitter(this._particleContainer, emitterConfig);
    }

    public openScenario(): void {
        super.openScenario();
        this._emitter.emit = true;
        let elapsed = Date.now();
        this.startParticles(elapsed);
    }

    protected closeScenario(): void {
        super.closeScenario();
        this._emitter.emit = false;
        this._emitter.cleanup();
        if (this._animationFrame) {
            cancelAnimationFrame(this._animationFrame);
            this._animationFrame = null;
        }
    }

    private startParticles(elapsed: number): void {
        if (!this._emitter) return;
        const emitter = this._emitter;
        const now = Date.now();
        emitter.update((now - elapsed) * 0.001);

        this._animationFrame = requestAnimationFrame(() => this.startParticles(now));
    }
}
