import * as Phaser from "phaser";
import { Card, SUIT } from "../../types";
import Deck from "../model/Deck";
import Player from "../model/Player";

class Game extends Phaser.Scene {
	private players: Player[];
	private cards: Card[];
	private deck: Deck;

	preload() {
		this.load.atlas("cards", "/assets/cards.png", "/assets/cards.json");
	}

	create() {
		this.createCards();
		this.createDeck();

		this.input.on("gameobjectover", function (pointer, gameObject) {
			gameObject.setTint(0xff0000);
		});

		this.input.on("gameobjectout", function (pointer, gameObject) {
			gameObject.clearTint();
		});
	}

	createDeck() {
		this.deck = new Deck(this.cards);
		this.deck.shuffle();
	}

	createCards() {
		const frames = this.textures.get("cards").getFrameNames();
		const cards = frames
			.filter((card) => card !== "joker" && card !== "back")
			.map((card, index) => {
				const [suitStr, numberStr] = card.split("_");
				const number = parseInt(numberStr, 10);
				const suit: SUIT = suitStr as SUIT;
				return new Card(suit, number);
				// const x = ((index % 13) + 1) * 60;
				// const y = (Math.floor(index / 13) + 1) * 100;

				// this.add.image(x, y, "cards", card).setInteractive();
			});
		this.cards = cards;
	}
}

export default Game;
