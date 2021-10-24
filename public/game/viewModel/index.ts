export interface IViewModelListener {
	stateUpdate(): void;
}

export abstract class ACViewModel<T> {
	timer: NodeJS.Timeout;
	state: T;
	listeners: IViewModelListener[];

	constructor(defaultState?: T) {
		this.state = defaultState;
		this.listeners = [];
	}

	subscribe(listener: IViewModelListener) {
		this.listeners.push(listener);
	}

	unSubscribe(listener: IViewModelListener) {
		this.listeners = this.listeners.filter((ls) => ls !== listener);
	}

	setState(nextState: any) {
		const prevState = JSON.parse(JSON.stringify(this.state));
		this.state = {
			...this.state,
			...nextState,
		};
		if (this.timer) {
			clearTimeout(this.timer);
		}
		this.timer = setTimeout(() => {
			this.listeners.map((listener) => {
				console.log("statedUpdate", listener);
				listener.stateUpdate();
			});
		}, 0);
	}
}
