import { Card } from "../../types";

class Deck {
	private cards: Card[];
	constructor(cards: Card[]) {
		this.cards = cards;
	}

	shuffle() {}
}

export default Deck;
