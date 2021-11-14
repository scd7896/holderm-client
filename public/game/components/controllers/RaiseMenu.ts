import { getPercentPixel } from "../../../utils/getPercentPixel";
import { RaiseOption } from "../../model/Player";
import { IViewModelListener } from "../../viewModel";
import RaiseMenuViewModel from "../../viewModel/RaiseMenu.vm";
import Button from "../Button";

const berRaiseType: RaiseOption[] = [
	{
		target: "bet",
		size: 1,
		isAllin: true,
	},
	{
		target: "bet",
		size: 2,
	},
	{
		target: "bet",
		size: 3,
	},
];

interface IProp {
	onRaiseSubmit: (raiseOption: RaiseOption) => void;
}
class RaiseMenu extends Phaser.GameObjects.Group implements IViewModelListener {
	private target: Phaser.Scene;
	private buttonComponent: Button;
	private raiseMenuViewModel: RaiseMenuViewModel;
	private raiseButtons: Array<any>;
	private props: IProp;

	constructor(target: Phaser.Scene, prop: IProp) {
		super(target);
		this.target = target;
		this.buttonComponent = new Button(target);
		this.raiseMenuViewModel = new RaiseMenuViewModel();
		this.raiseMenuViewModel.subscribe(this);
		this.props = prop;
	}

	stateUpdate() {
		this.raiseButtons.map(([button], index) => {
			if (index === this.raiseMenuViewModel.state.selectedIndex) {
				button.fillColor = 0xff0000;
				button.update();
			} else {
				button.fillColor = 0xff00ff;
				button.update();
			}
		});
	}

	show() {
		const wrapper = this.target.add.rectangle(
			getPercentPixel(85),
			getPercentPixel(20),
			getPercentPixel(20),
			getPercentPixel(35),
			0xefefef
		);
		this.raiseButtons = berRaiseType.map((option, index) => {
			const [button, text] = this.buttonComponent.playRaiseButton(
				80,
				10 + index * 5,
				option.isAllin ? "AllIn" : option.size + "배"
			) as [Phaser.GameObjects.Rectangle, Phaser.GameObjects.Text];

			button.on("pointerdown", () => {
				this.raiseMenuViewModel.setSelected(index);
			});

			this.add(button);
			this.add(text);

			return [button, text];
		});

		const [submitButtton, textComponent] = this.buttonComponent.playRaiseSubmitButton();

		submitButtton.on("pointerdown", () => {
			console.log("에반데");
			const selectedIndex = this.raiseMenuViewModel.state.selectedIndex;
			if (selectedIndex !== -1) {
				this.props.onRaiseSubmit(berRaiseType[selectedIndex]);
			}
		});
		this.add(textComponent);
		this.add(submitButtton);
		this.add(wrapper);
	}

	hide() {
		this.clear(true, true);
	}
}

export default RaiseMenu;
