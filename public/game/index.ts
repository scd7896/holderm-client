import * as Phaser from "phaser";
import TitleScene from "./scenes/TitleScene";
import Game from "./scenes/Game";

var config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 200 },
			debug: true,
		},
	},
};

const game = new Phaser.Game(config);

game.scene.add("titleScene", TitleScene);
game.scene.add("game", Game);

// game.scene.start("titleScene");
game.scene.start("game");
