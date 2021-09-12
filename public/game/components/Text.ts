import { getPercentPixel } from "../../utils/getPercentPixel";

class Text {
	private scene: Phaser.Scene;
	constructor(scene: Phaser.Scene) {
		this.scene = scene;
	}

	totalPotSize(potMoney: number) {
		const text = `TotalPot: ${potMoney.toLocaleString()}`;
		this.scene.add.text(getPercentPixel(40), getPercentPixel(8), text, { fontSize: "20px" });

		return text;
	}
}

export default Text;
