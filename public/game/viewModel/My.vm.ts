import { ACViewModel } from ".";
import Player, { RaiseOption } from "../model/Player";

interface State {
	user: Player;
	number: number;
}

class MyViewModel extends ACViewModel<State> {
	constructor(user: Player, number: number) {
		super({ user: user, number });
	}

	myCardSet(cards) {
		this.state.user.cards = cards;
		this.setState({});
	}

	call(stackMoney: number) {
		this.state.user.call(stackMoney);
		this.setState({});
	}

	raise(berMoney: number, potMoney: number, option: RaiseOption) {
		this.state.user.raise(berMoney, potMoney, option);
		this.setState({});
	}

	allIn() {
		this.state.user.allIn();
		this.setState({});
	}

	fold() {
		this.state.user.fold();
		this.setState({});
	}
}

export default MyViewModel;
