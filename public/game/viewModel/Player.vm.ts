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

	rejoin(nickname: string) {
		const index = this.state.players.findIndex((player) => player.nickname === nickname);
		if (index !== -1) {
			this.state.players[index].isJoin = true;
			this.setState({
				players: this.state.players,
			});
		}
	}

	quitPlayer(index: number) {
		this.setState({
			players: this.state.players.filter((_, i) => i !== index),
		});
	}

	cardSet(id: string, cards: [Card, Card]) {
		const index = this.state.players.findIndex((player) => player.id === id);
		if (index !== -1) {
			this.state.players[index].cards = cards;

			this.setState({
				players: this.state.players,
			});
		}
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

	findIdPlayerSet(nickname: string, user: Player) {
		const index = this.state.players.findIndex((player) => nickname === player?.nickname);
		if (index !== -1) {
			this.state.players[index] = user;
			this.setState({
				players: this.state.players,
			});
		}
	}

	ohtherUserSetAction(id: string) {
		const index = this.state.players.findIndex((player) => id === player?.id);

		this.setState({
			players: this.state.players.map((player, i) => {
				if (index !== i) {
					if (player.state === PlayerState.CALL || player.state === PlayerState.RAISE) {
						player.state = PlayerState.LIVE;
					}
				}
				return player;
			}),
		});
	}

	getNextPlayerIndex(id: string, myPlayer: Player) {
		const allPlayers = [...this.state.players, myPlayer].sort((a, b) => a.number - b.number);
		const index = allPlayers.findIndex((player) => player.id === id);

		for (let i = (index + 1) % allPlayers.length; i !== index; i = (i + 1) % allPlayers.length) {
			if (allPlayers[i].state === PlayerState.LIVE) {
				return allPlayers[i].number;
			}
		}
	}
}

export default PlayerViewModel;
