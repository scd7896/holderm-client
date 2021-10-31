import { IMessage } from "../../types";
import UserTable from "../components/User/UserTable";
import DeckViewModel from "../viewModel/Deck.vm";
import MyViewModel from "../viewModel/My.vm";
import PlayerViewModel from "../viewModel/Player.vm";
import PotViewModel from "../viewModel/Pot.vm";
import TurnViewModel from "../viewModel/Turn.vm";

class MessageHandler {
	private playersViewModel: PlayerViewModel;
	private myViewModel: MyViewModel;
	private potViewModel: PotViewModel;
	private turnViewModel: TurnViewModel;
	private deckViewModel: DeckViewModel;

	private userTableComponent: UserTable;

	constructor({ playersViewModel, myViewModel, potViewModel, turnViewModel, userTable, deckViewModel }) {
		this.playersViewModel = playersViewModel;
		this.myViewModel = myViewModel;
		this.potViewModel = potViewModel;
		this.turnViewModel = turnViewModel;
		this.deckViewModel = deckViewModel;

		this.userTableComponent = userTable;
	}

	messageHandle<T>(message: IMessage<T>) {
		switch (message.type) {
			case "bet": {
				this.betting(message);
				break;
			}
			case "raise": {
				this.raise(message);
			}
			case "fold": {
				this.fold(message);
			}
			case "deckSet": {
				this.deckSet(message);
			}
			default:
		}
	}

	deckSet(message) {
		this.deckViewModel.setDeck(message.data);
	}

	betting(message) {
		this.playersViewModel.callBet(message.from, message.data);
		this.potViewModel.bet(message.data);
		this.userTableComponent.whoSend(message.from, "call", message.data);
	}

	raise(message) {
		this.playersViewModel.raiseBet(message.from, message.data);
		this.potViewModel.bet(message.data);
		this.playersViewModel.ohtherUserSetAction(message.from);
		this.userTableComponent.whoSend(message.from, "raise", message.data);
		this.myViewModel.stateInitalize();
	}

	fold(message) {
		this.userTableComponent.whoFold(message.from);
	}
}

export default MessageHandler;
