import * as Phaser from "phaser";
import { Card, IJoinEventProp, SUIT } from "../../types";
import Deck from "../model/Deck";
import Player from "../model/Player";
import PlayerViewModel from "../viewModel/Player.vm";
import MyViewModel from "../viewModel/My.vm";
import { IViewModelListener } from "../viewModel/index";
import User from "../components/User";
import PotViewModel from "../viewModel/Pot.vm";
import Button from "../components/Button";
import Text from "../components/Text";

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
	private potViewModel: PotViewModel;
	private cards: Card[];
	private deck: Deck;
	private buttonComponent: Button;
	private textComponent: Text;
	private lastBetMoney: number;

	preload() {
		this.load.atlas("cards", "/assets/cards.png", "/assets/cards.json");
	}

	didUpdate(nextState) {
		console.log(nextState);
	}

	render() {
		this.children.removeAll();
		const button = this.buttonComponent.claaButton();
		const cardButton = this.buttonComponent.cardButton();
		const callButton = this.buttonComponent.callButton();

		const user = new User(this, { x: 40, y: 30, stackMoney: this.myViewModel.state.user.stackMoney });
		this.myViewModel.state.user.cards && user.setMyCards(this.myViewModel.state.user.cards);
		user.setImage();
		user.setStackMoney(this.myViewModel.state.user.stackMoney);

		callButton.setInteractive();
		cardButton.setInteractive();
		button.setInteractive();

		callButton.on("pointerdown", () => {
			this.myViewModel.call(this.lastBetMoney);
			this.potViewModel.bet(this.lastBetMoney);
			this.lastBetMoney += 100;
		});

		cardButton.on("pointerdown", () => {
			this.myViewModel.myCardSet([this.deck.pickCard(), this.deck.pickCard()]);
		});

		button.on("pointerdown", () => {
			const event = new CustomEvent<IJoinEventProp>("join", {
				detail: {
					stackMoney: 8000,
				},
			});
			document.dispatchEvent(event);
		});

		this.textComponent.totalPotSize(this.potViewModel.state.pot);

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
		this.potViewModel = new PotViewModel();
		this.playersViewModel = new PlayerViewModel();
		const player = new Player(5000);
		this.myViewModel = new MyViewModel(player, 0);

		this.lastBetMoney = 0;
		this.textComponent = new Text(this);
		this.buttonComponent = new Button(this);
		/**
		 * 접속을 했을 때의 이벤트 리스너로 가정
		 */
		document.addEventListener("join", (e: any) => {
			const player = new Player(e.detail.stackMoney);
			this.playersViewModel.joinPlayer(player);
		});

		document.addEventListener("quit", (e: any) => {
			this.playersViewModel.quitPlayer(e.detail.index);
		});

		this.playersViewModel.subscribe(this);
		this.myViewModel.subscribe(this);
		this.potViewModel.subscribe(this);
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
