import { getPercentPixel } from "../../utils/getPercentPixel";

class Button {
	private scene: Phaser.Scene;
	constructor(scene: Phaser.Scene) {
		this.scene = scene;
	}
	callButton() {
		const button = this.scene.add.rectangle(
			getPercentPixel(80),
			getPercentPixel(42),
			getPercentPixel(9),
			getPercentPixel(6),
			0xff0000,
			1
		);
		this.scene.add.text(getPercentPixel(76.4), getPercentPixel(43), "CALL", { fontSize: "20px" });
		button.setInteractive();

		return button;
	}

	claaButton() {
		const button = this.scene.add.rectangle(
			getPercentPixel(80),
			getPercentPixel(4),
			getPercentPixel(9),
			getPercentPixel(6),
			0xff0000,
			1
		);
		button.setInteractive();
		this.scene.add.text(getPercentPixel(76.4), getPercentPixel(5), "button", { fontSize: "20px" });

		return button;
	}

	cardButton() {
		const button = this.scene.add.rectangle(
			getPercentPixel(90),
			getPercentPixel(4),
			getPercentPixel(9),
			getPercentPixel(6),
			0xff0000,
			1
		);

		this.scene.add.text(getPercentPixel(86.4), getPercentPixel(5), "cardSet", { fontSize: "20px" });

		button.setInteractive();

		return button;
	}
}

export default Button;
