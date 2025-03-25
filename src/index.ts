import { ProjectGame } from "@/app";

window.onload = async () => {
    const app = document.querySelector('#app');
    if (!app) {
        return;
    }

    const game = new ProjectGame();
    game.initialize();
};
