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

	joinPlayer(player: Player, number?: number) {
		if (number !== undefined) {
			this.state.players[number] = player;
			this.setState({
				players: this.state.players,
			});
		} else {
			this.setState({
				players: [...this.state.players, player],
			});
		}
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

	playerConnection(id: string) {
		const index = this.state.players.findIndex((player) => id === player?.id);
		if (index !== -1) {
			this.state.players[index].isConnection = true;
			this.setState({
				players: this.state.players,
			});
		}
	}

	callBet(id: string, money: number) {
		const index = this.state.players.findIndex((player) => id === player?.id);
		if (index !== -1) {
			this.state.players[index].state = PlayerState.CALL;
			this.state.players[index].call(money);
			this.setState({
				players: this.state.players,
			});
		}
	}

	raiseBet(id: string, money: number) {
		const index = this.state.players.findIndex((player) => id === player?.id);
		if (index !== -1) {
			this.state.players[index].state = PlayerState.RAISE;
			this.state.players[index].call(money);

			this.setState({
				players: this.state.players.map((player, i) => {
					if ((player.state === PlayerState.RAISE || player.state === PlayerState.CALL) && index !== i) {
						player.stateInitalize();
					}
					return player;
				}),
			});
		}
	}

	fold(id: string) {
		const index = this.state.players.findIndex((player) => id === player?.id);
		if (index !== -1) {
			this.state.players[index].fold();
			this.setState({
				players: this.state.players,
			});
		}
	}

	findIdPlayerSet(id: string, user: Player) {
		const index = this.state.players.findIndex((player) => id === player?.id);

		if (index !== -1) {
			this.state.players[index] = user;
		}
	}
}

export default PlayerViewModel;
