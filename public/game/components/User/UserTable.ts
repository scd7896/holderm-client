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
			.map(({ stackMoney, isConnection }, index) => {
				return new User(target, {
					x: positions[index][0],
					y: positions[index][1],
					stackMoney: stackMoney,
					isConnection,
				});
			});
	}

	update(players: Player[]) {
		console.log("call", players);
		this.userComponents.map((user) => user.destroy(true));
		this.players = players;
		this.userComponents = this.players
			.filter(({ isMy }) => !isMy)
			.map(({ stackMoney, isConnection }, index) => {
				return new User(this.target, {
					x: positions[index][0],
					y: positions[index][1],
					stackMoney: stackMoney,
					isConnection,
				});
			});
	}
}

export default UserTable;
