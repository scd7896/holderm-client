import * as Phaser from "phaser";
import { Card, IMessage, SUIT } from "../../types";
import Deck from "../model/Deck";
import Player from "../model/Player";
import PlayerViewModel from "../viewModel/Player.vm";
import MyViewModel from "../viewModel/My.vm";
import { IViewModelListener } from "../viewModel/index";
import User from "../components/User/User";
import PotViewModel from "../viewModel/Pot.vm";
import Button from "../components/Button";
import Text from "../components/Text";
import TurnViewModel from "../viewModel/Turn.vm";
import socket from "../../rtcConnection/socket";
import ConnectionViewModel from "../presenter/Connection";
import MessageHandler from "../presenter/MessageHandler";
import UserTable from "../components/User/UserTable";
import Controllers from "../components/controllers/Controllers";
import DeckViewModel from "../viewModel/Deck.vm";

class Game extends Phaser.Scene implements IViewModelListener {
	private playersViewModel: PlayerViewModel;
	private myViewModel: MyViewModel;
	private potViewModel: PotViewModel;
	private turnViewModel: TurnViewModel;
	private connectionViewModel: ConnectionViewModel;
	private deckViewModel: DeckViewModel;
	private messageHandler: MessageHandler;
	private buttonComponent: Button;
	private textComponent: Text;
	private lastBetMoney: number;
	private userName: string;

	private userTableComponent: UserTable;
	private myUserComponent: User;
	private contorollerComponent: Controllers;

	preload() {
		this.load.atlas("cards", "/assets/cards.png", "/assets/cards.json");
	}

	stateUpdate() {
		if (this.myViewModel?.state.isHost && !this.deckViewModel?.state.card?.length) {
			const cards = this.createCards();
			const deck = new Deck(cards);
			deck.shuffle();
			this.deckViewModel.setDeck(deck.card);
		}
		this.userTableComponent?.update(this.playersViewModel?.state.players || []);
		this.myUserComponent?.update({
			stackMoney: this.myViewModel?.state.user.stackMoney || 0,
			isConnection: true,
			playerState: this.myViewModel?.state.user.state || 0,
		});
		this.contorollerComponent?.update({
			myStackMoney: this.myViewModel?.state.user.stackMoney || 0,
			lastBetMoney: this.lastBetMoney,
			potMoney: this.potViewModel?.state.pot || 0,
		});
	}

	render() {
		this.myUserComponent = new User(this, {
			x: 40,
			y: 30,
			stackMoney: this.myViewModel?.state.user.stackMoney || 0,
			isConnection: true,
			playerState: this.myViewModel?.state.user.state || 0,
		});
		this.myViewModel?.state.user.cards && this.myUserComponent.setMyCards(this.myViewModel?.state.user.cards || []);
		this.contorollerComponent = new Controllers(this, {
			onCall: () => {
				this.myViewModel.call(this.lastBetMoney);
				this.potViewModel.bet(this.lastBetMoney);
				this.myUserComponent.send("call", this.lastBetMoney);
				const message: IMessage<number> = {
					type: "bet",
					from: this.myViewModel.state.user.id,
					data: this.lastBetMoney,
				};
				this.connectionViewModel.broadCast(JSON.stringify(message));
				this.turnViewModel.hasGoNextTurn(this.playersViewModel.state.players);
			},
			onRaise: (money) => {
				this.lastBetMoney = money;
				this.myViewModel.raise(money);
				this.potViewModel.bet(this.lastBetMoney);
				this.myUserComponent.send("raise", money);
				const message: IMessage<number> = {
					type: "raise",
					from: this.myViewModel.state.user.id,
					data: this.lastBetMoney,
				};
				this.playersViewModel.ohtherUserSetAction(this.myViewModel.state.user.id);
				this.connectionViewModel.broadCast(JSON.stringify(message));
			},
			onFold: () => {
				this.myViewModel.fold();
				this.myUserComponent.send("fold", 0);
				const message: IMessage<number> = {
					type: "fold",
					from: this.myViewModel.state.user.id,
					data: 0,
				};
				this.connectionViewModel.broadCast(JSON.stringify(message));
				this.turnViewModel.hasGoNextTurn(this.playersViewModel.state.players);
			},
			myStackMoney: this.myViewModel?.state.user.stackMoney || 0,
			lastBetMoney: 0,
			potMoney: 0,
		});
		this.textComponent.totalPotSize(this.potViewModel?.state.pot || 0);
	}

	create() {
		this.userName = window.prompt("너의 이름은");
		this.potViewModel = new PotViewModel();
		this.playersViewModel = new PlayerViewModel();
		this.turnViewModel = new TurnViewModel();
		this.deckViewModel = new DeckViewModel();
		const player = new Player({ stackMoney: 8000, id: "", isMy: true, isHost: false, nickname: this.userName });
		this.myViewModel = new MyViewModel(player, 0);
		this.userTableComponent = new UserTable(this, this.playersViewModel.state.players);

		this.messageHandler = new MessageHandler({
			playersViewModel: this.playersViewModel,
			turnViewModel: this.turnViewModel,
			myViewModel: this.myViewModel,
			potViewModel: this.potViewModel,
			userTable: this.userTableComponent,
			deckViewModel: this.deckViewModel,
		});
		this.connectionViewModel = new ConnectionViewModel({
			myViewModel: this.myViewModel,
			playerViewModel: this.playersViewModel,
			messageHandler: this.messageHandler,
		});

		this.lastBetMoney = 100;
		this.textComponent = new Text(this);
		this.buttonComponent = new Button(this);
		this.playersViewModel.subscribe(this);
		this.myViewModel.subscribe(this);
		this.potViewModel.subscribe(this);
		this.createConnection();
		this.render();
	}

	createConnection() {
		setTimeout(() => {
			socket.emit("join_room", {
				room: "test",
				payload: {
					nickname: this.userName,
					id: this.userName,
				},
			});
		}, 500);
	}

	createCards() {
		const frames = this.textures.get("cards").getFrameNames();
		const cards = frames
			.filter((card) => card !== "joker" && card !== "back")
			.map((card) => {
				const [suitStr, numberStr] = card.split("_");
				const number = parseInt(numberStr, 10);
				const suit: SUIT = suitStr as SUIT;
				return new Card(suit, number);
			});
		return cards;
	}
}

export default Game;
