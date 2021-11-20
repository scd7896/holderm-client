import { ACViewModel } from ".";
import { Card } from "../../types";

class BoardViewModel extends ACViewModel<{
	cards: Card[];
}> {
	constructor() {
		super({ cards: [] });
	}
}
