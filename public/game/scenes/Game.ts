import * as Phaser from "phaser";

class Game extends Phaser.Scene {
	preload() {
		this.load.atlas("cards", "/assets/cards.png", "/assets/cards.json");
	}
	create() {
		this.createCards();

		this.input.on("gameobjectover", function (pointer, gameObject) {
			gameObject.setTint(0xff0000);
		});

		this.input.on("gameobjectout", function (pointer, gameObject) {
			gameObject.clearTint();
		});
	}

	createCards() {
		const frames = this.textures.get("cards").getFrameNames();
		frames
			.filter((card) => card !== "joker" && card !== "back")
			.map((card, index) => {
				const x = ((index % 13) + 1) * 60;
				const y = (Math.floor(index / 13) + 1) * 100;

				this.add.image(x, y, "cards", card).setInteractive();
			});
	}
}

export default Game;
