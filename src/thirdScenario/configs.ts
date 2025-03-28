import { EmitterConfigV3 } from "@pixi/particle-emitter/lib/EmitterConfig";

export const emitterConfig: EmitterConfigV3 = {
    "lifetime": {
        "min": 0.1,
        "max": 0.75
    },
    "frequency": 0.001,
    "emitterLifetime": 0,
    "maxParticles": 100,
    "addAtBack": false,
    "pos": {
        "x": 0,
        "y": 0
    },
    "behaviors": [
        {
            "type": "alpha",
            "config": {
                "alpha": {
                    "list": [
                        {
                            "time": 0,
                            "value": 0.62
                        },
                        {
                            "time": 1,
                            "value": 0
                        }
                    ]
                }
            }
        },
        {
            "type": "moveSpeedStatic",
            "config": {
                "min": 500,
                "max": 500
            }
        },
        {
            "type": "scale",
            "config": {
                "scale": {
                    "list": [
                        {
                            "time": 0,
                            "value": 0.65
                        },
                        {
                            "time": 1,
                            "value": 1.25
                        }
                    ]
                },
                "minMult": 1
            }
        },
        {
            "type": "color",
            "config": {
                "color": {
                    "list": [
                        {
                            "time": 0,
                            "value": "fff191"
                        },
                        {
                            "time": 1,
                            "value": "ff622c"
                        }
                    ]
                }
            }
        },
        {
            "type": "rotation",
            "config": {
                "accel": 0,
                "minSpeed": 50,
                "maxSpeed": 50,
                "minStart": 265,
                "maxStart": 275
            }
        },
        {
            "type": "textureRandom",
            "config": {
                "textures": []
            }
        },
        {
            "type": "spawnShape",
            "config": {
                "type": "torus",
                "data": {
                    "x": 0,
                    "y": 0,
                    "radius": 50,
                    "innerRadius": 0,
                    "affectRotation": false
                }
            }
        }
    ]
}
