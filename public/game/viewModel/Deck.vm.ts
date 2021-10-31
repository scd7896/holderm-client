import { ACViewModel } from ".";
import { Card } from "../../types";

import Deck from "../model/Deck";

class DeckViewModel extends ACViewModel<Deck> {
	constructor() {
		super(new Deck([]));
	}

	setDeck(cards: Card[]) {
		this.setState(new Deck(cards));
	}

	suffle() {
		this.state.shuffle();
		this.setState(new Deck(this.state.card));
	}

	popCard() {
		const card = this.state.pickCard();
		this.setState(new Deck(this.state.card));
		return card;
	}
}

export default DeckViewModel;
