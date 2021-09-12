import { ACViewModel } from ".";

class PotViewModel extends ACViewModel<{ pot: number }> {
	constructor() {
		super({ pot: 0 });
	}

	bet(money: number) {
		this.setState({ pot: this.state.pot + money });
	}

	reset() {
		this.setState({ pot: 0 });
	}
}

export default PotViewModel;
