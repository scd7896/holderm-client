import { ACViewModel } from ".";

class ControllerViewModel extends ACViewModel<{ isOpen: boolean }> {
	constructor() {
		super({ isOpen: false });
	}

	openMenu() {
		this.setState({ isOpen: true });
	}

	closeMenu() {
		this.setState({ isOpen: false });
	}
}

export default ControllerViewModel;
