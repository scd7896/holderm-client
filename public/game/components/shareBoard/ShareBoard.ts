import { Card, TURN_TYPE } from "../../../types";
import { getPercentPixel } from "../../../utils/getPercentPixel";
import DeckViewModel from "../../viewModel/Deck.vm";
import MyViewModel from "../../viewModel/My.vm";
import PlayerViewModel from "../../viewModel/Player.vm";
import TurnViewModel from "../../viewModel/Turn.vm";

interface IProp {
	x: number;
	y: number;
	turnViewModel: TurnViewModel;
	playersViewModel: PlayerViewModel;
	myViewModel: MyViewModel;
	deckViewModel: DeckViewModel;
}

class ShareBoard extends Phaser.GameObjects.Group {
	private target: Phaser.Scene;

	private x: number;
	private y: number;

	private cards: Card[];
	private turnViewModel: TurnViewModel;
	private playersViewModel: PlayerViewModel;
	private myViewModel: MyViewModel;
	private deckViewModel: DeckViewModel;

	constructor(target: Phaser.Scene, prop: IProp) {
		super(target);
		this.target = target;
		this.x = getPercentPixel(prop.x);
		this.y = getPercentPixel(prop.y);
		this.turnViewModel = prop.turnViewModel;
		this.playersViewModel = prop.playersViewModel;
		this.myViewModel = prop.myViewModel;
		this.deckViewModel = prop.deckViewModel;
		this.cards = [];
	}

	update(prop: Omit<IProp, "x" | "y">) {
		this.turnViewModel = prop.turnViewModel;
		this.playersViewModel = prop.playersViewModel;
		this.myViewModel = prop.myViewModel;
		this.deckViewModel = prop.deckViewModel;

		if (this.turnViewModel.state.turn === TURN_TYPE.PLOP) {
			if (this.cards.length === 0) {
				const firstCard = this.deckViewModel.popCard();
				const secondCard = this.deckViewModel.popCard();
				const thirdCard = this.deckViewModel.popCard();
				this.deckViewModel.boardCardsSet([firstCard, secondCard, thirdCard]);
				this.cards = [firstCard, secondCard, thirdCard];
			}
		}

		if (this.turnViewModel.state.turn === TURN_TYPE.TURN) {
			if (this.cards.length === 3) {
				const firstCard = this.deckViewModel.popCard();
				this.cards.push(firstCard);
				this.deckViewModel.boardCardsSet(this.cards);
			}
		}

		if (this.turnViewModel.state.turn === TURN_TYPE.RIVER) {
			if (this.cards.length === 4) {
				const firstCard = this.deckViewModel.popCard();
				this.cards.push(firstCard);
				this.deckViewModel.boardCardsSet(this.cards);
			}
		}
		this.clear(true, true);
		this.cards.map(({ number, suit }, index) => {
			const card = `${suit}_${number}`;
			const image = this.target.add.image(
				this.x + getPercentPixel(6 + index * 10),
				this.y + getPercentPixel(2),
				"cards",
				card
			);
			image.scaleX = window.innerWidth / 1920;
			image.scaleY = window.innerWidth / 1920;
			this.add(image);
		});
	}

	cardsSet(cards: Card[]) {
		this.cards = cards;
	}

	resetCards() {
		this.cards = [];
	}
}

export default ShareBoard;
