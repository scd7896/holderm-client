import { ACViewModel } from ".";
import { TURN_TYPE } from "../../types";
import Player, { PlayerState } from "../model/Player";

class TurnViewModel extends ACViewModel<{ turn: TURN_TYPE; turnPlayer: number }> {
	private nowTurn: TURN_TYPE;
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
		}
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
}

export default TurnViewModel;
