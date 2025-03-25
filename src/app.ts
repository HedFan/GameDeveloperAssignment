import * as PIXI from "pixi.js";
import { merge } from "rxjs";

import { Env, canvasConfig } from "@/environment";
import { FirstScenarioView } from "@/firstScenario";
import { SecondScenarioView } from "@/secondScenario";
import { ThirdScenarioView } from "@/thirdScenario";
import { MenuView } from "@/menu";

export class ProjectGame extends PIXI.Container  {
    private app: PIXI.Application | undefined;
    private _firstScenarioView: FirstScenarioView | undefined;
    private _secondScenarioView: SecondScenarioView | undefined;
    private _thirdScenarioView: ThirdScenarioView | undefined;
    private _menuView: MenuView | undefined;

    public initialize(): void {
        const htmlElement: HTMLElement | null = document.querySelector("#app");
        if(!htmlElement) {
            return;
        }
        const appOptions: any = {
            backgroundColor: canvasConfig.backgroundColor,
            resizeTo: htmlElement,
            resolution: Env.canvasResolution()
        };

        this.app = new PIXI.Application(appOptions);
        // @ts-ignore
        globalThis.__PIXI_APP__ = this.app;

        htmlElement.appendChild(this.app.view as HTMLCanvasElement);
        this.app.stage.addChild(this as PIXI.DisplayObject);
        this.app.renderer.render(this.app.stage);

        this._menuView = new MenuView();
        this.addChild(this._menuView as PIXI.DisplayObject);

        this._firstScenarioView = new FirstScenarioView();
        this.addChild(this._firstScenarioView as PIXI.DisplayObject);
        this._secondScenarioView = new SecondScenarioView();
        this.addChild(this._secondScenarioView as PIXI.DisplayObject);
        this._thirdScenarioView = new ThirdScenarioView();
        this.addChild(this._thirdScenarioView as PIXI.DisplayObject);

        const { sendResult$ } = this._menuView;
        const sendReturnClick$ = merge(
            this._firstScenarioView.sendReturnCLick$,
            this._secondScenarioView.sendReturnCLick$,
            this._thirdScenarioView.sendReturnCLick$
        );
        sendReturnClick$.subscribe(() => {
            if(this._menuView) {
                this._menuView.restorePage();
            }
        });
        sendResult$.subscribe(page => {
            const scenario = [this._firstScenarioView, this._secondScenarioView, this._thirdScenarioView][Number(page)]
            if(scenario) {
                scenario.openScenario();
            }
        });
        this.runFPS();
        this.onResize();
        this.gamePosition();
        window.addEventListener("resize", () => {
            this.onResize();
            this.gamePosition();
        });
    }

    protected gamePosition(): void {
        if (!this.app) return;
        const xPosition = Env.windowSize().width / 2 / this.app.stage.scale.x;
        const yPosition = Env.windowSize().height / 2 / this.app.stage.scale.y;
        this.position.set(xPosition, yPosition);
    }

    protected onResize() {
        if (!this.app) return;
        this.app.stage.scale.set(Env.scale());
    }

    protected runFPS(): void {
        if(!this.app) {
            return;
        }
        // can be limited with
        // this.app.ticker.maxFPS = 60;
        let lastFpsUpdate = performance.now();
        let frameCount = 0;
        let fps = 0;

        let fpsText = new PIXI.Text("FPS: 0", { fontSize: 16, fill: 0xffffff });
        fpsText.position.set(10);
        this.app.stage.addChild(fpsText as PIXI.DisplayObject);

        this.app.ticker.add(() => {
            let now = performance.now();
            frameCount++;

            if (now - lastFpsUpdate >= 1000) {
                fps = Math.round((frameCount * 1000) / (now - lastFpsUpdate));
                fpsText.text = `FPS: ${fps}`;
                lastFpsUpdate = now;
                frameCount = 0;
            }
        });
    }
}
