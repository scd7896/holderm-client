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
		this.scene.add.text(getPercentPixel(77), getPercentPixel(42), "CALL", { fontSize: "20px" });
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

	raiseButton() {
		const button = this.scene.add.rectangle(
			getPercentPixel(90),
			getPercentPixel(42),
			getPercentPixel(9),
			getPercentPixel(6),
			0xff0000,
			1
		);

		this.scene.add.text(getPercentPixel(87.5), getPercentPixel(42), "RAISE", { fontSize: "20px" });
		button.setInteractive();

		return button;
	}

	foldButton() {
		const button = this.scene.add.rectangle(
			getPercentPixel(70),
			getPercentPixel(42),
			getPercentPixel(9),
			getPercentPixel(6),
			0x55af32,
			1
		);
		this.scene.add.text(getPercentPixel(67.5), getPercentPixel(42), "FOLD", { fontSize: "20px" });
		button.setInteractive();

		return button;
	}

	playRaiseButton(x, y, text) {
		const button = this.scene.add.rectangle(
			getPercentPixel(x),
			getPercentPixel(y),
			getPercentPixel(8),
			getPercentPixel(4),
			0xff00ff,
			1
		);
		button.setInteractive();

		const textComponent = this.scene.add.text(
			getPercentPixel(x) - getPercentPixel(1),
			getPercentPixel(y) - getPercentPixel(1),
			text,
			{
				fontSize: "16px",
				color: "#000000",
			}
		);

		return [button, textComponent];
	}

	playRaiseSubmitButton() {
		const button = this.scene.add.rectangle(
			getPercentPixel(81),
			getPercentPixel(30),
			getPercentPixel(10),
			getPercentPixel(4),
			0x88ff88,
			1
		);
		button.setInteractive();

		const text = this.scene.add.text(getPercentPixel(79), getPercentPixel(30), "완료", {
			fontSize: "16px",
			color: "#000000",
		});

		return [button, text];
	}
}

export default Button;
