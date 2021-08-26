export type SUIT = "spades" | "hearts" | "diamonds" | "clubs";

export class Card {
	constructor(suit?: SUIT, number?: number) {
		this.suit = suit;
		this.number = number;
	}
	suit: SUIT;
	number: number;
}

export class Result {
	success: boolean;
	useNumbers: number[];
}

export enum Genealogy {
	TOP,
	ONEPAIR,
	TWOPAIR,
	TRIPLE,
	STRAIGHT,
	FLUSH,
	FULLHOUSE,
	FOURCARD,
	STRAIGHTFLUSH,
}

export class GenealogyResult {
	genealogy: Genealogy;
	useNumbers: number[];
}
