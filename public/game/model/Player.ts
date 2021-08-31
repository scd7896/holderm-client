import { Card } from "../../types";

export enum PlayerState {
	FOLD,
	LIVE,
	ALL_IN,
}

interface RaiseOption {
	target: "bet" | "pot";
	size: number;
	isDevide?: boolean;
}

class Player {
	private state: PlayerState;
	private betMoney: number;
	private stackMoney: number;
	private cards: [Card, Card];

	constructor(param: Player) {
		this.state = PlayerState.LIVE;
		this.stackMoney = param.stackMoney;
		this.betMoney = 0;
	}

	setCards(cards: [Card, Card]) {
		this.cards = cards;
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
