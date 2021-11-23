import { Card } from "../../../types";
import { getPercentPixel } from "../../../utils/getPercentPixel";
import Player, { PlayerState } from "../../model/Player";

interface IProp {
	x: number;
	y: number;
	player: Player;
	turn?: number;
}

class User extends Phaser.GameObjects.Group {
	private x: number;
	private y: number;
	private target: Phaser.Scene;
	private player: Player;

	private connectionText: Phaser.GameObjects.Text;
	private moneyText: Phaser.GameObjects.Text;
	private betedText: Phaser.GameObjects.Text;
	private nicknameText: Phaser.GameObjects.Text;
	private turnView: Phaser.GameObjects.Rectangle;

	constructor(target: Phaser.Scene, prop: IProp) {
		super(target);
		this.target = target;
		this.x = getPercentPixel(prop.x);
		this.y = getPercentPixel(prop.y);
		this.player = prop.player;
		this.betTextRender();
		this.render();
		if (this.player.number === prop.turn) {
			this.turnView = this.target.add.rectangle(
				this.x + getPercentPixel(1),
				this.y + getPercentPixel(1),
				30,
				30,
				0xff00ff,
				1
			);
		}
	}

	render() {
		this.add(this.target.add.circle(this.x, this.y, getPercentPixel(3), 0xff0000));

		if (!this.player.isConnection) {
			this.connectionText = this.target.add.text(this.x - getPercentPixel(1), this.y + getPercentPixel(1), "연결중", {
				fontSize: "14px",
			});
			this.add(this.connectionText);
		}
		this.moneyText = this.target.add.text(
			this.x - getPercentPixel(1),
			this.y + getPercentPixel(4.5),
			this.player.stackMoney.toString(),
			{
				fontSize: "14px",
			}
		);
		this.nicknameText = this.target.add.text(
			this.x - getPercentPixel(1),
			this.y + getPercentPixel(5.5),
			this.player.nickname.toString(),
			{
				fontSize: "14px",
			}
		);
		this.add(this.nicknameText);
		this.add(this.moneyText);
		this.betTextRender();
		if (this.player.cards) {
			if (this.player.isMy) {
				this.setMyCards(this.player.cards);
			} else {
				this.setCards();
			}
		}
	}

	update(prop: Omit<IProp, "x" | "y">, turn: number) {
		this.player = prop.player;

		if (this.player.number === turn) {
			if (this.turnView) {
				this.turnView.setVisible(true);
				this.turnView.update();
			} else {
				this.turnView = this.target.add.rectangle(
					this.x + getPercentPixel(-3),
					this.y + getPercentPixel(-3),
					30,
					30,
					0xff00ff,
					1
				);
			}
			console.log("added");
		} else {
			if (this.turnView) {
				this.turnView.setVisible(false);
				this.turnView.update();
			}
		}

		if (this.player.isConnection) {
			this.remove(this.connectionText);
		}
		this.moneyText.text = this.player.stackMoney.toString();
		this.moneyText.updateText();
		this.betTextRender();
		if (this.player.cards) {
			if (this.player.isMy) {
				this.setMyCards(this.player.cards);
			} else {
				this.setCards();
			}
		}
	}

	betTextRender() {
		if (this.player.state === PlayerState.CALL || this.player.state === PlayerState.RAISE) {
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
