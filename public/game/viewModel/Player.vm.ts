import { ACViewModel } from ".";
import { Card } from "../../types";
import Deck from "../model/Deck";
import Player, { PlayerState } from "../model/Player";

interface IPlayer {
	players: Player[];
}

class PlayerViewModel extends ACViewModel<IPlayer> {
	constructor() {
		super({ players: [] });
	}

	userSets(players: Player[]) {
		this.setState({
			players,
		});
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

	playerSet(index: number, state: PlayerState) {
		this.state.players[index].state = state;
		this.setState({
			players: this.state.players,
		});
	}
}

export default PlayerViewModel;
