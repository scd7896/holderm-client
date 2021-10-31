import { ACViewModel } from ".";
import Player, { RaiseOption } from "../model/Player";

interface State {
	user: Player;
	number: number;
	isHost: boolean;
}

class MyViewModel extends ACViewModel<State> {
	constructor(user: Player, number: number) {
		super({ user: user, number, isHost: false });
	}

	playerSet(user: Player, number: number) {
		this.setState({
			user,
			number,
		});
	}

	hostSet(isHost: boolean) {
		this.setState({
			isHost,
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
