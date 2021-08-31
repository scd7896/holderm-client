export interface IViewModelListener {
	didUpdate(nextState: any, state: any): void;
}

export abstract class ACViewModel<T> {
	state: T;
	listeners: IViewModelListener[];

	constructor(defaultState: T) {
		this.state = defaultState;
		this.listeners = [];
	}

	subscribe(listener: IViewModelListener) {
		this.listeners.push(listener);
	}

	unSubscribe(listener: IViewModelListener) {
		this.listeners = this.listeners.filter((ls) => ls !== listener);
	}

	setState(nextState: T) {
		const prevState = JSON.parse(JSON.stringify(this.state));
		this.state = {
			...this.state,
			...nextState,
		};
		this.listeners.map((listener) => listener.didUpdate(prevState, this.state));
	}
}
