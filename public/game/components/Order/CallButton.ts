import { getPercentPixel } from "../../../utils/getPercentPixel";

interface IProp {}

class CallButton extends Phaser.GameObjects.Group {
	private target: Phaser.Scene;
	constructor(target: Phaser.Scene, prop: IProp) {
		super(target);
		this.target = target;
		const rect = this.target.add.rectangle(
			getPercentPixel(80),
			getPercentPixel(42),
			getPercentPixel(9),
			getPercentPixel(6),
			0xff0000,
			1
		);
		this.add(this.target.add.text(getPercentPixel(76.4), getPercentPixel(43), "CALL", { fontSize: "20px" }));
		this.add(rect);
		rect.setInteractive();
	}
}
