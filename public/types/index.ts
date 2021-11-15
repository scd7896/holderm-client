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
	useCards: Card[];
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
	useCards: Card[];
}

export interface IJoinEventProp {
	stackMoney: number;
	isMy?: boolean;
}

export enum TURN_TYPE {
	READY,
	START,
	PRE_PLOP,
	PLOP,
	TURN,
	RIVER,
	END,
}

export interface UserInfo {
	socketId: string;
	nickname: string;
	join: boolean;
}

export interface IJoinInfo {
	users: UserInfo[];
	you: UserInfo;
}

export interface IMessage<T> {
	type: string;
	from: string;
	data: T;
}
