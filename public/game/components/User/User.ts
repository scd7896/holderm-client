import { Card } from "../../../types";
import { getPercentPixel } from "../../../utils/getPercentPixel";
import { PlayerState } from "../../model/Player";

interface IProp {
	x: number;
	y: number;
	stackMoney: number;
	isConnection: boolean;
	playerState: PlayerState;
	cards?: Card[];
	isMy: boolean;
}

class User extends Phaser.GameObjects.Group {
	private x: number;
	private y: number;
	private target: Phaser.Scene;
	private isConnection: boolean;
	private stackMoney: number;
	private playerState: PlayerState;
	private cards?: Card[];
	private isMy: boolean;

	private connectionText: Phaser.GameObjects.Text;
	private moneyText: Phaser.GameObjects.Text;
	private betedText: Phaser.GameObjects.Text;

	constructor(target: Phaser.Scene, prop: IProp) {
		super(target);
		this.target = target;
		this.x = getPercentPixel(prop.x);
		this.y = getPercentPixel(prop.y);
		this.stackMoney = prop.stackMoney;
		this.isConnection = prop.isConnection;
		this.playerState = prop.playerState;
		this.cards = prop.cards;
		this.isMy = prop.isMy;
		this.betTextRender();
		this.render();
	}

	render() {
		this.add(this.target.add.circle(this.x, this.y, getPercentPixel(3), 0xff0000));

		if (!this.isConnection) {
			this.connectionText = this.target.add.text(this.x - getPercentPixel(1), this.y + getPercentPixel(1), "연결중", {
				fontSize: "14px",
			});
			this.add(this.connectionText);
		}
		this.moneyText = this.target.add.text(
			this.x - getPercentPixel(1),
			this.y + getPercentPixel(4.5),
			this.stackMoney.toString(),
			{
				fontSize: "14px",
			}
		);
		this.add(this.moneyText);
		this.betTextRender();
		if (this.cards) {
			if (this.isMy) {
				this.setMyCards(this.cards);
			} else {
				this.setCards();
			}
		}
	}

	update(prop: Omit<IProp, "x" | "y">) {
		this.stackMoney = prop.stackMoney;
		this.isConnection = prop.isConnection;
		this.playerState = prop.playerState;
		this.cards = prop.cards;

		if (this.isConnection) {
			this.remove(this.connectionText);
		}
		this.moneyText.text = this.stackMoney.toString();
		this.moneyText.updateText();
		this.betTextRender();
		if (this.cards) {
			if (this.isMy) {
				this.setMyCards(this.cards);
			} else {
				this.setCards();
			}
		}
	}

	betTextRender() {
		if (this.playerState === PlayerState.CALL || this.playerState === PlayerState.RAISE) {
			if (!this.betedText) {
				this.betedText = this.target.add.text(this.x - getPercentPixel(4), this.y - getPercentPixel(4), "베팅 참여함", {
					fontSize: "14px",
				});
				this.add(this.betedText);
			}
		} else {
			if (this.betedText) {
				this.betedText.destroy();
				this.betedText = null;
			}
		}
	}

	setCards() {
		this.target.add.rectangle(
			this.x + getPercentPixel(6),
			this.y + getPercentPixel(2),
			getPercentPixel(5),
			getPercentPixel(6),
			0xe8e8e8
		);
		this.target.add.rectangle(
			this.x + getPercentPixel(12),
			this.y + getPercentPixel(2),
			getPercentPixel(5),
			getPercentPixel(6),
			0xe8e8e8
		);
	}

	setMyCards(cards: Card[]) {
		cards.map(({ number, suit }, index) => {
			const card = `${suit}_${number}`;
			const image = this.target.add.image(
				this.x + getPercentPixel(6 + index * 10),
				this.y + getPercentPixel(2),
				"cards",
				card
			);
			image.scaleX = window.innerWidth / 1920;
			image.scaleY = window.innerWidth / 1920;
		});
	}

	send(message: string, money: number) {
		const text = this.target.add.text(this.x + getPercentPixel(3), this.y, `${message}: ${money}`, {
			fontSize: "12px",
		});
		setTimeout(() => {
			text.destroy();
		}, 500);
	}

	foldSend() {
		const text = this.target.add.text(this.x + getPercentPixel(3), this.y, `fold`, {
			fontSize: "12px",
		});
		setTimeout(() => {
			text.destroy();
		}, 500);
	}
}

export default User;
