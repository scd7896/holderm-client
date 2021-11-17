import { ACViewModel } from ".";
import { Card } from "../../types";

import Deck from "../model/Deck";

class DeckViewModel extends ACViewModel<{ cards: Card[] }> {
	constructor() {
		super({ cards: [] });
	}

	setDeck(cards: Card[]) {
		this.setState({ cards });
	}

	suffle() {
		const shuffleCount = Math.floor(Math.random() * 100 + 400);
		for (let i = 0; i < shuffleCount; i++) {
			const srcCardIndex = Math.floor(Math.random() * 52);
			const dstCardIndex = Math.floor(Math.random() * 52);
			let tmp = this.state.cards[srcCardIndex];
			this.state.cards[srcCardIndex] = this.state.cards[dstCardIndex];
			this.state.cards[dstCardIndex] = tmp;
		}

		this.setState({ cards: this.state.cards });
	}

	popCard() {
		const card = this.state.cards.pop();
		this.setState(new Deck(this.state.cards));
		return card;
	}
}

export default DeckViewModel;
