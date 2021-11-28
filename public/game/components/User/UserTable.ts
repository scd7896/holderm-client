import Player from "../../model/Player";
import User from "./User";

const positions = [
	[22, 29],
	[5, 17],
	[21, 6],
	[65, 6],
	[82, 17],
	[67, 29],
];

class UserTable extends Phaser.GameObjects.Layer {
	private players: Player[];
	private userComponents: User[];
	private target: Phaser.Scene;

	constructor(target: Phaser.Scene, players: Player[]) {
		super(target);
		this.players = players;
		this.target = target;

		this.userComponents = this.players
			.filter(({ isMy }) => !isMy)
			.map((player, index) => {
				return new User(target, {
					x: positions[index][0],
					y: positions[index][1],
					player,
				});
			});
	}

	whoSend(key: string, message: string, money: number) {
		const index = this.players.filter(({ isMy }) => !isMy).findIndex((player) => player.id === key);
		if (index !== -1) {
			this.userComponents[index].send(message, money);
		}
	}

	whoFold(key: string) {
		const index = this.players.filter(({ isMy }) => !isMy).findIndex((player) => player.id === key);
		if (index !== -1) {
			this.userComponents[index].foldSend();
		}
	}

	update(players: Player[], turn: number) {
		this.userComponents.map((user) => user.destroy(true, true));
		this.players = players;
		console.log("users", turn);
		this.userComponents = this.players
			.filter(({ isMy }) => !isMy)
			.map((player, index) => {
				return new User(this.target, {
					x: positions[index][0],
					y: positions[index][1],
					player,
					turn,
				});
			});
	}
}

export default UserTable;
