import { Card } from "../../types";

class Deck {
	private cards: Card[];
	private scene: Phaser.Scene;

	constructor(cards: Card[], scene: Phaser.Scene) {
		this.cards = cards;
		this.scene = scene;
	}

	shuffle() {
		const shuffleCount = Math.floor(Math.random() * 100 + 400);
		for (let i = 0; i < shuffleCount; i++) {
			const srcCardIndex = Math.floor(Math.random() * 52);
			const dstCardIndex = Math.floor(Math.random() * 52);
			let tmp = this.cards[srcCardIndex];
			this.cards[srcCardIndex] = this.cards[dstCardIndex];
			this.cards[dstCardIndex] = tmp;
		}
	}

	pickCard() {
		return this.cards.pop();
	}
}

export default Deck;
