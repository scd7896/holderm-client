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

	playerSet(user: Player, number: number) {
		this.setState({
			user,
			number,
		});
	}

	myCardSet(cards) {
		this.state.user.cards = cards;
		this.setState({
			user: this.state.user,
		});
	}

	call(stackMoney: number) {
		this.state.user.call(stackMoney);
		this.setState({
			user: this.state.user,
		});
	}

	raise(berMoney: number) {
		this.state.user.raise(berMoney);
		this.setState({
			user: this.state.user,
		});
	}

	allIn() {
		this.state.user.allIn();
		this.setState({
			user: this.state.user,
		});
	}

	fold() {
		this.state.user.fold();
		this.setState({
			user: this.state.user,
		});
	}

	stateInitalize() {
		this.state.user.stateInitalize();
		this.setState({
			user: this.state.user,
		});
	}
}

export default MyViewModel;
