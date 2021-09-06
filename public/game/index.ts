import * as Phaser from "phaser";
import TitleScene from "./scenes/TitleScene";
import Game from "./scenes/Game";

var config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 200 },
			debug: true,
		},
	},
};

const game = new Phaser.Game(config);

window.addEventListener("resize", () => {
	game.scale.resize(window.innerWidth, window.innerHeight)
});
game.scene.add("titleScene", TitleScene);
game.scene.add("game", Game);

// game.scene.start("titleScene");
game.scene.start("game");
