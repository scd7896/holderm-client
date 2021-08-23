import * as Phaser from "phaser";

export default class TitleScene extends Phaser.Scene {
	preload() {}

	create() {
		const text = this.add.text(300, 400, "hello world");
		text.setOrigin(0.5, 0.5);
	}
}
