import { TURN_TYPE } from "../../../types";
import { getPercentPixel } from "../../../utils/getPercentPixel";
import MyViewModel from "../../viewModel/My.vm";
import TurnViewModel from "../../viewModel/Turn.vm";

interface IProp {
	turnViewModel: TurnViewModel;
	myViewModel: MyViewModel;
	onClick: () => void;
}

class GameStartButton extends Phaser.GameObjects.Group {
	private turnViewModel: TurnViewModel;
	private myViewModel: MyViewModel;
	private onClick: () => void;

	constructor(target: Phaser.Scene, prop: IProp) {
		super(target);
		this.turnViewModel = prop.turnViewModel;
		this.myViewModel = prop.myViewModel;
		this.onClick = prop.onClick;
	}

	update() {
		console.log("test", this.myViewModel);
		if (!this.myViewModel.state.user.isHost) return null;
		if (this.turnViewModel.state.turn === TURN_TYPE.READY) {
			const button = this.scene.add.rectangle(
				getPercentPixel(81),
				getPercentPixel(30),
				getPercentPixel(10),
				getPercentPixel(4),
				0x88ff88,
				1
			);
			button.setInteractive();

			const text = this.scene.add.text(getPercentPixel(79), getPercentPixel(30), "GAME START", {
				fontSize: "16px",
				color: "#000000",
			});

			button.on("pointerdown", () => {
				console.log("testtest");
				this.turnViewModel.gameStart();
				this.onClick();
			});

			this.add(button);
			this.add(text);
		} else {
			this.clear(true, true);
		}
	}
}

export default GameStartButton;
