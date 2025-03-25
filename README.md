## Game Assignment 

### The game follows these states:
 - Menu: user can open any of three window ("Ace of Shadows”, “Magic Words”, “Phoenix Flame”);
 - User can always return to the Menu screen from these scenarios with "Return" button;

#### “Ace of Shadows”
Create 144 sprites (NOT graphic objects) that are stacked on top of each other like cards in a deck. The top card must cover the bottom card, but not completely. Every 1 second the top card should move to a different stack - the animation of the movement should take 2 seconds.

#### “Magic Words”
Create a system that allows you to combine text and images like custom emojis. Use it to render a dialogue between characters with the data taken from this endpoint: https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords

** 
Getting data from the second scenario view folder, since we use it only there. If we need to use it globally - we can move it to the environment folder to keep structure as clean as possible.

#### “Phoenix Flame”
Make a particle-effect demo showing a great fire effect. Keep the number of images at max 10 sprites on the screen at the same time.


### Libraries, tools, assets that have been used:
- Pixi.js (v7.2.0);
- TypeScript (v4.8.2);
- RxJS;
- gsap;
- FPS (simple custom FPS in the top left corner. Can be limited to a value 60. Also, can be added a logic that will check if it's a slow devise or not) ;
- Node v20.19.0;
- Adaptive screen;

### Things that could be added or improved (just a few, as there’s always room for improvement):
- Add and config linter;
- Add skip button for cards in “Ace of Shadows” (logic already there);
- Add animation for chat in "Magic Words" (imitate typing);
- Use Texture Packer for assets;

NOTE: I didn't remove the PIXI Dev tool

## Run

To play the game in local environment just run

```bash
  npm run dev
```

## Build

To create a new build of the game run

```bash
  npm run build
```

