import * as Phaser from "phaser";
import { Card, SUIT } from "../../types";
import Deck from "../model/Deck";
import Player from "../model/Player";
import PlayerViewModel from "../viewModel/Player.vm";
import MyViewModel from "../viewModel/My.vm";
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
	private myViewModel: MyViewModel;
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

		const cardButton = this.add.rectangle(
			getPercentPixel(90),
			getPercentPixel(42),
			getPercentPixel(9),
			getPercentPixel(6),
			0xff0000,
			1
		);
		this.add.text(getPercentPixel(86.4), getPercentPixel(41), "cardSet", { fontSize: "20px" });
		cardButton.setInteractive();
		cardButton.on("pointerdown", () => {
			this.myViewModel.myCardSet([this.deck.pickCard(), this.deck.pickCard()]);
		});
		const user = new User(this, { x: 10, y: 10, stackMoney: 5000 });
		this.myViewModel.state.user.cards && user.setMyCards(this.myViewModel.state.user.cards);
		user.setImage();
		user.setStackMoney(5000);

		this.childs.push(button);
		button.setInteractive();

		button.on("pointerdown", () => {
			const player = new Player(this.playersViewModel.state.players.length);

			this.playersViewModel.joinPlayer(player);
		});

		this.playersViewModel.state.players.map(({ stackMoney }, index) => {
			const user = new User(this, { x: positions[index][0], y: positions[index][1], stackMoney: stackMoney });
			user.setCards();
			user.setImage();
			user.setStackMoney(stackMoney);
		});
	}

	create() {
		this.createCards();
		this.createDeck();
		this.playersViewModel = new PlayerViewModel();
		const player = new Player(0);
		this.myViewModel = new MyViewModel(player, 0);

		document.addEventListener("myjoin", (e: CustomEvent<{ stackMoney: number; number: number }>) => {
			const player = new Player(e.detail.stackMoney);
			this.myViewModel = new MyViewModel(player, e.detail.number);
		});
		/**
		 * 접속을 했을 때의 이벤트 리스너로 가정
		 */ document.addEventListener("join", () => {
			const player = new Player(8000);
			this.playersViewModel.joinPlayer(player);
		});

		document.addEventListener("quit", (e: any) => {
			this.playersViewModel.quitPlayer(e.index);
		});

		this.playersViewModel.subscribe(this);
		this.myViewModel.subscribe(this);
		this.render();
	}

	createDeck() {
		this.deck = new Deck(this.cards, this);
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
			});
		this.cards = cards;
	}
}

export default Game;
