import { IMessage } from "../../types";
import User from "../components/User/User";
import ConnectionViewModel from "../presenter/Connection";
import Game from "../scenes/Game";
import MyViewModel from "../viewModel/My.vm";
import PlayerViewModel from "../viewModel/Player.vm";
import PotViewModel from "../viewModel/Pot.vm";
import TurnViewModel from "../viewModel/Turn.vm";

interface IProp {
	playersViewModel: PlayerViewModel;
	myViewModel: MyViewModel;
	potViewModel: PotViewModel;
	turnViewModel: TurnViewModel;
}

class GameEventHandler {
	private playersViewModel: PlayerViewModel;
	private myViewModel: MyViewModel;
	private potViewModel: PotViewModel;
	private turnViewModel: TurnViewModel;

	constructor({ playersViewModel, myViewModel, potViewModel, turnViewModel }: IProp) {
		this.playersViewModel = playersViewModel;
		this.myViewModel = myViewModel;
		this.potViewModel = potViewModel;
		this.turnViewModel = turnViewModel;
	}

	turnCheck() {
		setTimeout(() => {
			const result = this.turnViewModel.hasGoNextTurn([
				...this.playersViewModel.state.players,
				this.myViewModel.state.user,
			]);
			if (result) {
				this.playersViewModel.ohtherUserSetAction(this.myViewModel.state.user.id);
				this.myViewModel.stateInitalize();
			} else {
				const nextNumber = this.playersViewModel.getNextPlayerIndex(
					this.myViewModel.state.user.id,
					this.myViewModel.state.user
				);
				this.turnViewModel.turnPlayerSet(nextNumber);
			}
		}, 100);
	}
}

export default GameEventHandler;
