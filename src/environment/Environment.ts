import { iViewPortSize, canvasConfig } from "./configs";

class Environment {
    private static _instance: Environment = new Environment();

    constructor() {}

    static getInstance(): Environment {
        return this._instance;
    }

    public canvasResolution(): number {
        return Math.min(window.devicePixelRatio || 1, 2);
    }

    public scale(): number {
        let scale = 1;
        const canvas: HTMLElement | null = document.querySelector("canvas");
        if(canvas) {
            if (this.hasCalculationToWidth()) {
                scale = canvas.clientWidth / canvasConfig.referenceSize.width;
            } else {
                scale = canvas.clientHeight / canvasConfig.referenceSize.height;
            }
        }

        return scale / this.canvasResolution();
    }

    public windowSize(): { width: number; height: number }  {
        return { width: window.innerWidth, height: window.innerHeight };
    }

    private viewPortSize(): iViewPortSize {
        return {
            viewportWidth:
                window.innerWidth ||
                document.documentElement.clientWidth ||
                document.body.clientWidth,
            viewportHeight:
                window.innerHeight ||
                document.documentElement.clientHeight ||
                document.body.clientHeight
        }
    }

    private viewport(): number {
        const { viewportWidth, viewportHeight } = this.viewPortSize();
        return viewportWidth / viewportHeight;
    }

    private reference(): number {
        return canvasConfig.referenceSize.width / canvasConfig.referenceSize.height;
    }

    private hasCalculationToWidth(): boolean {
        return this.viewport() < this.reference();
    }
}

export const Env = Environment.getInstance();
