import { getPercentPixel } from "../../utils/getPercentPixel";

class Text {
	private scene: Phaser.Scene;
	private potText: Phaser.GameObjects.Text;
	constructor(scene: Phaser.Scene) {
		this.scene = scene;
	}

	totalPotSize(potMoney: number) {
		const text = `TotalPot: ${potMoney.toLocaleString()}`;
		this.potText = this.scene.add.text(getPercentPixel(40), getPercentPixel(8), text, { fontSize: "20px" });

		return text;
	}

	update(potMoney) {
		this.potText.text = `TotalPot: ${potMoney.toLocaleString()}`;
		this.potText.update();
	}
}

export default Text;
