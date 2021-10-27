import { ACViewModel } from ".";

class PotViewModel extends ACViewModel<{ pot: number; bet: number }> {
	constructor() {
		super({ pot: 0, bet: 0 });
	}

	bet(money: number) {
		this.setState({ pot: this.state.pot + money, bet: money });
	}

	reset() {
		this.setState({ pot: 0, bet: 0 });
	}
}

export default PotViewModel;
