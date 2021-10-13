export interface IViewModelListener {
	stateUpdate(): void;
}

let timer: NodeJS.Timeout;

export abstract class ACViewModel<T> {
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
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			this.listeners.map((listener) => {
				listener.stateUpdate();
			});
		}, 0);
	}
}
