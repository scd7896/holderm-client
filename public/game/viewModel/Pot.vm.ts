import { ACViewModel } from ".";

class PotViewModel extends ACViewModel<{ pot: number; bet: number }> {
	constructor() {
		super({ pot: 500, bet: 100 });
	}

	bet(money: number) {
		this.setState({ pot: this.state.pot + money, bet: money });
	}

	reset() {
		this.setState({ pot: 0, bet: 0 });
	}

	initPot() {
		this.setState({
			pot: 0,
			bet: 100,
		});
	}

	setBet(money: number) {
		this.setState({
			bet: money,
		});
	}

	setPot(money: number) {
		this.setState({
			pot: money,
		});
	}
}

export default PotViewModel;
