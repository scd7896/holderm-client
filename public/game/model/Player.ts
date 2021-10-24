import { Card } from "../../types";

export enum PlayerState {
	FOLD,
	LIVE,
	ALL_IN,
	ACTION,
	CALL,
	RAISE,
}

export interface RaiseOption {
	target: "bet" | "pot";
	size: number;
	isDevide?: boolean;
	isAllin?: boolean;
}

export interface IPlayerProp {
	stackMoney: number;
	isMy: boolean;
	id: string;
}
class Player {
	public state: PlayerState;
	public betMoney: number;
	public stackMoney: number;
	public cards: [Card, Card];
	public isMy: boolean;
	public isConnection: boolean;
	public id: string;

	constructor({ isMy, id, stackMoney }: IPlayerProp) {
		this.state = PlayerState.LIVE;
		this.stackMoney = stackMoney || 0;
		this.betMoney = 0;
		this.isMy = isMy;
		this.isConnection = isMy;
		this.id = id;
	}

	getCards() {
		return this.cards;
	}

	betting(money: number) {
		if (money < this.stackMoney) {
			this.stackMoney -= money;
			this.betMoney += money;
		}
	}

	allIn() {
		this.betMoney += this.stackMoney;
		this.stackMoney = 0;
		this.state = PlayerState.ALL_IN;
	}

	call(betMoney: number) {
		if (betMoney > this.stackMoney) {
			this.allIn();
		} else {
			this.state = PlayerState.CALL;
			this.betting(betMoney);
		}
	}

	fold() {
		this.state = PlayerState.FOLD;
	}

	raise(betMoney: number) {
		this.state = PlayerState.RAISE;
		this.betting(betMoney);
	}

	stateInitalize() {
		this.state = PlayerState.ACTION;
	}
}

export default Player;
