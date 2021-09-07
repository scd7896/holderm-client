import { ACViewModel } from ".";
import { Card } from "../../types";
import Deck from "../model/Deck";
import Player from "../model/Player";

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

	cardSet(cards: [Card, Card]) {
		this.setState({
			players: this.state.players.map((player) => (player.cards = cards)),
		});
	}
}

export default PlayerViewModel;
