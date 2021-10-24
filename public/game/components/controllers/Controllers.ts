import { IViewModelListener } from "../../viewModel";
import ControllerViewModel from "../../viewModel/Controller.vm";
import Button from "../Button";
import RaiseMenu from "./RaiseMenu";

interface IProp {
	onCall?: () => void;
	onRaise?: (money: number) => void;
	onFold?: () => void;
	onAllin?: () => void;
	myStackMoney: number;
	lastBetMoney: number;
	potMoney: number;
}

class Controllers extends Phaser.GameObjects.Group implements IViewModelListener {
	private target: Phaser.Scene;
	private controllerViewModel: ControllerViewModel;
	private buttonComponent: Button;
	private raiseMenuComponent: RaiseMenu;
	private props: IProp;

	stateUpdate() {
		if (this.controllerViewModel.state.isOpen) {
			this.raiseMenuComponent.show();
		} else {
			this.raiseMenuComponent.hide();
		}
	}

	update(props: Pick<IProp, "potMoney" | "lastBetMoney" | "myStackMoney">) {
		this.props = {
			...this.props,
			...props,
		};
	}

	constructor(target: Phaser.Scene, prop: IProp) {
		super(target);
		this.target = target;
		this.controllerViewModel = new ControllerViewModel();
		this.buttonComponent = new Button(target);
		this.props = prop;
		this.raiseMenuComponent = new RaiseMenu(this.target, {
			onRaiseSubmit: (raiseOption) => {
				if (raiseOption.isAllin) {
					this.props.onAllin && this.props.onAllin();
				} else {
					this.props.onRaise && this.props.onRaise(this.props.lastBetMoney * raiseOption.size);
				}
				this.controllerViewModel.closeMenu();
			},
		});
		this.controllerViewModel.subscribe(this);
		this.render();
	}

	render() {
		const callButton = this.buttonComponent.callButton();
		callButton.on("pointerdown", () => {
			this.props.onCall && this.props.onCall();
			this.controllerViewModel.closeMenu();
		});
		const raiseButton = this.buttonComponent.raiseButton();
		raiseButton.on("pointerdown", () => {
			if (this.controllerViewModel.state.isOpen) {
				this.controllerViewModel.closeMenu();
			} else {
				this.controllerViewModel.openMenu();
			}
		});

		const foldButton = this.buttonComponent.foldButton();
		foldButton.on("pointerdown", () => {
			this.props.onFold && this.props.onFold();
			this.controllerViewModel.closeMenu();
		});
	}
}

export default Controllers;
