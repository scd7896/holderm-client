import { Card } from "../../types";
import { getPercentPixel } from "../../utils/getPercentPixel";

interface IProp {
	x: number;
	y: number;
	stackMoney: number;
}

class User {
	private x: number;
	private y: number;
	private target: Phaser.Scene;

	constructor(target: Phaser.Scene, prop: IProp) {
		this.target = target;
		this.x = getPercentPixel(prop.x);
		this.y = getPercentPixel(prop.y);
	}

	setImage() {
		this.target.add.circle(this.x, this.y, getPercentPixel(3), 0xff0000);
	}

	setStackMoney(money: number) {
		this.target.add.text(this.x, this.y + getPercentPixel(4.5), money.toString(), { fontSize: "14px" });
	}

	setCards() {
		this.target.add.rectangle(
			this.x + getPercentPixel(6),
			this.y + getPercentPixel(2),
			getPercentPixel(5),
			getPercentPixel(6),
			0xe8e8e8
		);
		this.target.add.rectangle(
			this.x + getPercentPixel(12),
			this.y + getPercentPixel(2),
			getPercentPixel(5),
			getPercentPixel(6),
			0xe8e8e8
		);
	}

	setMyCards(cards: Card[]) {
		cards.map(({ number, suit }, index) => {
			const card = `${suit}_${number}`;
			this.target.add.image(this.x + getPercentPixel(6 + index * 10), this.y + getPercentPixel(2), "cards", card);
		});
	}
}

export default User;
