import { Card, Genealogy, GenealogyResult, Result } from "../../types";

export const isFlush = (cards: Card[]): Result => {
	const copyCards: Card[] = JSON.parse(JSON.stringify(cards));
	copyCards.sort((a, b) => {
		if (a.suit < b.suit) return -1;
		if (a.suit === b.suit) return 0;
		return 1;
	});
	let useCards: Card[] = [];
	let lastSuit = "";
	let count = 1;

	for (let i = 0; i < copyCards.length; i++) {
		const card = copyCards[i];
		if (card.suit === lastSuit) {
			count += 1;
			useCards.push(card);
		} else {
			if (count >= 5) break;

			count = 1;
			useCards = [card];
		}
		lastSuit = card.suit;
	}

	useCards.sort((a, b) => {
		return a.number - b.number;
	});

	if (useCards.length >= 5) {
		return {
			success: true,
			useCards: useCards.sort((a, b) => a.number - b.number),
		};
	}

	return {
		success: false,
		useCards: [],
	};
};

export const isStraight = (cards: Card[]): Result => {
	const copyCards: Card[] = JSON.parse(JSON.stringify(cards));
	copyCards.sort((a, b) => a.number - b.number);

	let lastNumber = 0;
	let useCards: Card[] = [];
	if (copyCards[copyCards.length - 1].number === 14) {
		useCards.push(copyCards[copyCards.length - 1]);
		lastNumber = 1;
	}

	for (let i = 0; i < copyCards.length; i++) {
		const card = copyCards[i];
		if (card.number - lastNumber > 1) {
			if (useCards.length >= 5) break;

			lastNumber = card.number;
			useCards = [card];
		}

		if (card.number - lastNumber === 1) {
			lastNumber = card.number;
			useCards.push(card);
		}
	}

	if (useCards.length >= 5) {
		useCards.sort((a, b) => {
			return a.number - b.number;
		});
		return {
			success: true,
			useCards,
		};
	}
	return {
		success: false,
		useCards: [],
	};
};

export const handCheck = (cards: Card[]): GenealogyResult => {
	const sameCards: Card[][] = new Array(15);

	const flushCheck = isFlush(cards);
	if (flushCheck.success) {
		const straightCheck = isStraight(flushCheck.useCards);
		if (straightCheck.success)
			return {
				genealogy: Genealogy.STRAIGHTFLUSH,
				useCards: straightCheck.useCards,
			};
		return {
			genealogy: Genealogy.FLUSH,
			useCards: flushCheck.useCards,
		};
	}

	const straightCheck = isStraight(cards);
	if (straightCheck.success)
		return {
			genealogy: Genealogy.STRAIGHT,
			useCards: straightCheck.useCards,
		};

	for (let i = 0; i < sameCards.length; i++) {
		sameCards[i] = [];
	}

	cards.map((card) => {
		sameCards[card.number].push(card);
	});

	const tripleCheck = {
		success: false,
		number: 0,
	};

	let pairs: number[] = [];

	for (let i = 0; i < sameCards.length; i++) {
		const count = sameCards[i].length;
		if (count === 4)
			return {
				genealogy: Genealogy.FOURCARD,
				useCards: sameCards[i],
			};

		if (count === 3) {
			tripleCheck.success = true;
			tripleCheck.number = i;
		}

		if (count >= 2) {
			pairs.push(i);
		}
	}

	if (tripleCheck.success) {
		pairs = pairs.filter((number) => number !== tripleCheck.number);
		const subPair = pairs.pop();

		if (subPair)
			return {
				genealogy: Genealogy.FULLHOUSE,
				useCards: [
					{ number: subPair, suit: "spades" },
					{ number: tripleCheck.number, suit: "spades" },
				],
			};
		return {
			genealogy: Genealogy.TRIPLE,
			useCards: [{ number: tripleCheck.number, suit: "clubs" }],
		};
	}

	if (pairs.length >= 2) {
		const firstPair = pairs.pop();
		const secondPair = pairs.pop();
		return {
			genealogy: Genealogy.TWOPAIR,
			useCards: [
				{ number: secondPair, suit: "spades" },
				{ number: firstPair, suit: "clubs" },
			],
		};
	}

	if (pairs.length >= 1) {
		return {
			genealogy: Genealogy.ONEPAIR,
			useCards: [{ number: pairs[0], suit: "clubs" }],
		};
	}

	const numbers = cards.sort((a, b) => a.number - b.number).map(({ number }) => number);
	const topCard = numbers.pop();

	return {
		genealogy: Genealogy.TOP,
		useCards: [{ number: topCard, suit: "clubs" }],
	};
};
