import { IMessage } from "../../types";
import UserTable from "../components/User/UserTable";
import MyViewModel from "./My.vm";
import PlayerViewModel from "./Player.vm";
import PotViewModel from "./Pot.vm";
import TurnViewModel from "./Turn.vm";

class MessageHandler {
	private playersViewModel: PlayerViewModel;
	private myViewModel: MyViewModel;
	private potViewModel: PotViewModel;
	private turnViewModel: TurnViewModel;

	private userTableComponent: UserTable;

	constructor({ playersViewModel, myViewModel, potViewModel, turnViewModel, userTable }) {
		this.playersViewModel = playersViewModel;
		this.myViewModel = myViewModel;
		this.potViewModel = potViewModel;
		this.turnViewModel = turnViewModel;

		this.userTableComponent = userTable;
	}

	messageHandle<T>(message: IMessage<T>) {
		switch (message.type) {
			case "bet": {
				this.betting(message);
				break;
			}
			default:
		}
	}

	betting(message) {
		this.playersViewModel.callBet(message.from, message.data);
		this.userTableComponent.whoSend(message.from, "call", message.data);
	}
}

export default MessageHandler;
