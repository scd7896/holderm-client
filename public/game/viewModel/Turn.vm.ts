import { ACViewModel } from ".";
import { TURN_TYPE } from "../../types";
import Player, { PlayerState } from "../model/Player";

class TurnViewModel extends ACViewModel<{ turn: TURN_TYPE; turnPlayer: number }> {
	constructor(turn: TURN_TYPE = TURN_TYPE.START, turnPlayer: number = 0) {
		super({ turn, turnPlayer });
	}

	hasGoNextTurn(players: Player[]) {
		const result = players.reduce((acc, player) => {
			return acc && player.state !== PlayerState.LIVE;
		}, true);

		if (result) {
			this.setState({
				turn: this.state.turn + 1,
			});
		}
	}

	resetTurn() {
		this.setState({
			turn: TURN_TYPE.START,
		});
	}
}

export default TurnViewModel;
