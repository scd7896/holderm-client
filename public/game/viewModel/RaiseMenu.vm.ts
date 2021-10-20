import { ACViewModel } from ".";

interface IRaiseMenu {
	selectedIndex: number;
}

class RaiseMenuViewModel extends ACViewModel<IRaiseMenu> {
	constructor() {
		super({ selectedIndex: -1 });
	}

	setSelected(target: number) {
		this.setState({
			selectedIndex: target,
		});
	}
}

export default RaiseMenuViewModel;
