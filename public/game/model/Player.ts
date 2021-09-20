import { Card } from "../../types";

export enum PlayerState {
	FOLD,
	LIVE,
	ALL_IN,
	ACTION,
}

export interface RaiseOption {
	target: "bet" | "pot";
	size: number;
	isDevide?: boolean;
}
class Player {
	public state: PlayerState;
	public betMoney: number;
	public stackMoney: number;
	public cards: [Card, Card];
	public isMy: boolean;
	public isConnection: boolean;

	constructor(stackMoney: number, isMy: boolean = false) {
		this.state = PlayerState.LIVE;
		this.stackMoney = stackMoney;
		this.betMoney = 0;
		this.isMy = isMy;
		this.isConnection = isMy;
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
			this.betMoney += betMoney;
			this.stackMoney -= betMoney;
			this.state = PlayerState.ACTION;
		}
	}

	fold() {
		this.state = PlayerState.FOLD;
	}

	raise(betMoney: number, potMoney: number, option: RaiseOption) {
		if (option.target === "bet") {
			const mybetMoney = betMoney * option.size;
			this.call(mybetMoney);
		} else {
			if (option.isDevide) {
				const mybetMoney = Math.floor(potMoney / option.size);
				this.call(mybetMoney);
			} else {
				const mybetMoney = potMoney * option.size;
				this.call(mybetMoney);
			}
		}
	}
}

export default Player;
