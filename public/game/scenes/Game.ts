import * as Phaser from "phaser";
import { Card, IMessage, SUIT, TURN_TYPE } from "../../types";
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
import GameStartButton from "../components/controllers/GameStartButton";
import ShareBoard from "../components/shareBoard/ShareBoard";
import GameEventHandler from "../event/GameEventHandler";

class Game extends Phaser.Scene implements IViewModelListener {
	private playersViewModel: PlayerViewModel;
	private myViewModel: MyViewModel;
	private potViewModel: PotViewModel;
	private turnViewModel: TurnViewModel;
	private connectionViewModel: ConnectionViewModel;
	private deckViewModel: DeckViewModel;
	private messageHandler: MessageHandler;
	private gameStartButton: GameStartButton;
	private textComponent: Text;
	private userName: string;

	private userTableComponent: UserTable;
	private myUserComponent: User;
	private contorollerComponent: Controllers;
	private shareBoardComponents: ShareBoard;

	private gameEventHandler: GameEventHandler;

	preload() {
		this.load.atlas("cards", "/assets/cards.png", "/assets/cards.json");
	}

	stateUpdate() {
		this.userTableComponent?.update(this.playersViewModel?.state.players || [], this.turnViewModel.state.turnPlayer);
		this.myUserComponent?.update(
			{
				player: this.myViewModel.state.user,
			},
			this.turnViewModel.state.turnPlayer
		);
		this.contorollerComponent?.update({
			myStackMoney: this.myViewModel?.state.user.stackMoney || 0,
			lastBetMoney: this.potViewModel.state.bet,
			potMoney: this.potViewModel?.state.pot || 0,
		});
		this.textComponent.update(this.potViewModel?.state.pot || 0);
		this.gameStartButton.update();
		this.shareBoardComponents.update({
			turnViewModel: this.turnViewModel,
			playersViewModel: this.playersViewModel,
			myViewModel: this.myViewModel,
			deckViewModel: this.deckViewModel,
		});
		console.log(this.turnViewModel.state);
		console.log(this.playersViewModel.state);
		console.log(this.myViewModel.state);
	}

	render() {
		this.myUserComponent = new User(this, {
			x: 40,
			y: 30,
			player: this.myViewModel.state.user,
		});
		this.shareBoardComponents = new ShareBoard(this, {
			x: 30,
			y: 15,
			turnViewModel: this.turnViewModel,
			playersViewModel: this.playersViewModel,
			myViewModel: this.myViewModel,
			deckViewModel: this.deckViewModel,
		});
		this.myViewModel?.state.user.cards && this.myUserComponent.setMyCards(this.myViewModel?.state.user.cards || []);
		this.gameStartButton = new GameStartButton(this, {
			turnViewModel: this.turnViewModel,
			onClick: () => {
				const message: IMessage<TURN_TYPE> = {
					type: "turnSet",
					from: this.myViewModel.state.user.id,
					data: TURN_TYPE.START,
				};
				this.connectionViewModel.broadCast(JSON.stringify(message));
				const cards = this.createCards();
				const deck = new Deck(cards);
				deck.shuffle();
				this.deckViewModel.setDeck(deck.card);
				const deckSendMessage: IMessage<Card[]> = {
					type: "deckSet",
					from: this.myViewModel.state.user.id,
					data: deck.card,
				};
				this.connectionViewModel.broadCast(JSON.stringify(deckSendMessage));
				setTimeout(() => {
					this.turnViewModel.turnSet(TURN_TYPE.PRE_PLOP);
					const myIndex = this.myViewModel.state.number;
					let flag = true;
					this.playersViewModel.state.players.map((player, index) => {
						if (index === myIndex) {
							const firstCard = this.deckViewModel.popCard();
							const secondCard = this.deckViewModel.popCard();
							this.myViewModel.myCardSet([firstCard, secondCard]);
							flag = false;
						}
						const firstCard = this.deckViewModel.popCard();
						const secondCard = this.deckViewModel.popCard();
						this.playersViewModel.cardSet(player.id, [firstCard, secondCard]);
					});

					if (flag) {
						const firstCard = this.deckViewModel.popCard();
						const secondCard = this.deckViewModel.popCard();
						this.myViewModel.myCardSet([firstCard, secondCard]);
					}
				}, 500);
			},
			myViewModel: this.myViewModel,
		});
		this.contorollerComponent = new Controllers(this, {
			onCall: () => {
				this.myViewModel.call(this.potViewModel.state.bet);
				this.potViewModel.bet(this.potViewModel.state.bet);
				this.myUserComponent.send("call", this.potViewModel.state.bet);
				const message: IMessage<number> = {
					type: "bet",
					from: this.myViewModel.state.user.id,
					data: this.potViewModel.state.bet,
				};
				this.connectionViewModel.broadCast(JSON.stringify(message));

				setTimeout(() => {
					const result = this.turnViewModel.hasGoNextTurn([
						...this.playersViewModel.state.players,
						this.myViewModel.state.user,
					]);
					if (result) {
						this.playersViewModel.ohtherUserSetAction(this.myViewModel.state.user.id);
						this.myViewModel.stateInitalize();
						setTimeout(() => {
							const nextTurn = this.playersViewModel.getNextPlayerIndex(message.from, this.myViewModel.state.user);
							this.turnViewModel.turnPlayerSet(nextTurn);
						}, 100);
					} else {
						const nextNumber = this.playersViewModel.getNextPlayerIndex(
							this.myViewModel.state.user.id,
							this.myViewModel.state.user
						);
						this.turnViewModel.turnPlayerSet(nextNumber);
					}
				}, 100);
			},
			onRaise: (money) => {
				this.potViewModel.state.bet = money;
				this.myViewModel.raise(money);
				this.potViewModel.bet(this.potViewModel.state.bet);
				this.myUserComponent.send("raise", money);
				const message: IMessage<number> = {
					type: "raise",
					from: this.myViewModel.state.user.id,
					data: this.potViewModel.state.bet,
				};
				this.playersViewModel.ohtherUserSetAction(this.myViewModel.state.user.id);
				this.connectionViewModel.broadCast(JSON.stringify(message));
				setTimeout(() => {
					const nextNumber = this.playersViewModel.getNextPlayerIndex(
						this.myViewModel.state.user.id,
						this.myViewModel.state.user
					);
					this.turnViewModel.turnPlayerSet(nextNumber);
				}, 500);
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

				setTimeout(() => {
					const result = this.turnViewModel.hasGoNextTurn([
						...this.playersViewModel.state.players,
						this.myViewModel.state.user,
					]);
					if (result) {
						this.playersViewModel.ohtherUserSetAction(this.myViewModel.state.user.id);
						this.myViewModel.stateInitalize();
						setTimeout(() => {
							const nextTurn = this.playersViewModel.getNextPlayerIndex(message.from, this.myViewModel.state.user);
							this.turnViewModel.turnPlayerSet(nextTurn);
						}, 100);
					} else {
						const nextNumber = this.playersViewModel.getNextPlayerIndex(
							this.myViewModel.state.user.id,
							this.myViewModel.state.user
						);
						this.turnViewModel.turnPlayerSet(nextNumber);
					}
				}, 100);
			},
			myStackMoney: this.myViewModel?.state.user.stackMoney || 0,
			lastBetMoney: this.potViewModel.state.bet,
			potMoney: this.potViewModel.state.pot,
		});
		this.textComponent.totalPotSize(this.potViewModel?.state.pot || 0);
	}

	create() {
		this.userName = window.prompt("너의 이름은");
		this.potViewModel = new PotViewModel();
		this.playersViewModel = new PlayerViewModel();
		this.turnViewModel = new TurnViewModel();
		this.deckViewModel = new DeckViewModel();
		const player = new Player({
			stackMoney: 8000,
			id: "",
			isMy: true,
			isHost: false,
			nickname: this.userName,
			number: 0,
		});
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

		this.gameEventHandler = new GameEventHandler({
			playersViewModel: this.playersViewModel,
			myViewModel: this.myViewModel,
			potViewModel: this.potViewModel,
			turnViewModel: this.turnViewModel,
		});

		this.connectionViewModel = new ConnectionViewModel({
			myViewModel: this.myViewModel,
			playerViewModel: this.playersViewModel,
			messageHandler: this.messageHandler,
		});

		this.textComponent = new Text(this);
		this.playersViewModel.subscribe(this);
		this.myViewModel.subscribe(this);
		this.potViewModel.subscribe(this);
		this.turnViewModel.subscribe(this);
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
