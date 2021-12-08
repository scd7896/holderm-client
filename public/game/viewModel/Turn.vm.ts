import { ACViewModel } from ".";
import { TURN_TYPE } from "../../types";
import Player, { PlayerState } from "../model/Player";

class TurnViewModel extends ACViewModel<{ turn: TURN_TYPE; turnPlayer: number }> {
	private nowTurn: TURN_TYPE;
	private firstPlayer: Player;
	constructor(turn: TURN_TYPE = TURN_TYPE.READY, turnPlayer: number = 0) {
		super({ turn, turnPlayer });
	}

	hasGoNextTurn(players: Player[]) {
		const result = players.reduce((acc, player) => {
			return acc && player.state !== PlayerState.LIVE;
		}, true);

		if (result && this.nowTurn !== this.state.turn) {
			this.nowTurn = this.state.turn + 1;
			this.setState({
				turn: this.state.turn + 1,
			});
			return true;
		}

		return false;
	}

	firstPlayerSet(player: Player) {
		this.firstPlayer = player;
	}

	turnSet(turn: TURN_TYPE) {
		this.setState({
			turn,
		});
	}

	gameStart() {
		this.setState({
			turn: TURN_TYPE.START,
		});
	}

	turnPlayerSet(number: number) {
		this.setState({
			turnPlayer: number,
		});
	}
}

export default TurnViewModel;
