import * as Phaser from "phaser";
import { Card, SUIT } from "../../types";
import Deck from "../model/Deck";
import Player from "../model/Player";
import PlayerViewModel from "../viewModel/Player.vm";
import { IViewModelListener } from "../viewModel/index";
import User from "../components/User";
import { getPercentPixel } from "../../utils/getPercentPixel";

const positions = [
	[21, 6],
	[65, 6],
	[82, 17],
	[5, 17],
	[22, 29],
	[67, 29],
];
class Game extends Phaser.Scene implements IViewModelListener {
	private playersViewModel: PlayerViewModel;
	private cards: Card[];
	private deck: Deck;
	private childs: any[] = [];

	preload() {
		this.load.atlas("cards", "/assets/cards.png", "/assets/cards.json");
	}

	didUpdate(nextState) {
		console.log(nextState);
	}

	render() {
		this.childs.map((child) => child.destroy());
		const button = this.add.rectangle(
			getPercentPixel(80),
			getPercentPixel(42),
			getPercentPixel(9),
			getPercentPixel(6),
			0xff0000,
			1
		);
		this.add.text(getPercentPixel(76.4), getPercentPixel(41), "button", { fontSize: "20px" });
		console.log(button.getCenter());

		this.childs.push(button);
		button.setInteractive();

		button.on("pointerdown", () => {
			const player = new Player(this.playersViewModel.state.players.length);

			this.playersViewModel.joinPlayer(player);
		});

		this.playersViewModel.state.players.map(({ stackMoney }, index) => {
			const user = new User(this, { x: positions[index][0], y: positions[index][1], stackMoney: stackMoney });
			user.setCards([]);
			user.setImage();
			user.setStackMoney(stackMoney);
		});
	}

	create() {
		this.createCards();
		this.createDeck();
		this.playersViewModel = new PlayerViewModel();

		/**
		 * 접속을 했을 때의 이벤트 리스너로 가정
		 */
		document.addEventListener("join", () => {
			const player = new Player(8000);
			this.playersViewModel.joinPlayer(player);
		});

		document.addEventListener("quit", (e: any) => {
			this.playersViewModel.quitPlayer(e.index);
		});

		this.playersViewModel.subscribe(this);

		this.render();
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
