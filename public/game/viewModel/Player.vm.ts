import { ACViewModel } from ".";
import { Card } from "../../types";
import Player, { PlayerState } from "../model/Player";

interface IPlayer {
	players: Player[];
}

class PlayerViewModel extends ACViewModel<IPlayer> {
	constructor() {
		super({ players: [] });
	}

	joinPlayer(player: Player) {
		this.setState({
			players: [...this.state.players, player],
		});
	}

	quitPlayer(index: number) {
		this.setState({
			players: this.state.players.filter((_, i) => i !== index),
		});
	}
}

export default PlayerViewModel;
