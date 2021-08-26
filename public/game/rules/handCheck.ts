import { Card, Genealogy, GenealogyResult, Result } from "../../types";

export const isFlush = (cards: Card[]): Result => {
	const copyCards: Card[] = JSON.parse(JSON.stringify(cards));
	copyCards.sort((a, b) => {
		if (a.suit < b.suit) return -1;
		if (a.suit === b.suit) return 0;
		return 1;
	});
	let numbers = [];
	let lastSuit = "";
	let count = 1;

	for (let i = 0; i < copyCards.length; i++) {
		const card = copyCards[i];
		if (card.suit === lastSuit) {
			count += 1;
			numbers.push(card.number);
		} else {
			if (count >= 5) break;

			count = 1;
			numbers = [card.number];
		}
		lastSuit = card.suit;
	}

	if (count >= 5)
		return {
			success: true,
			useNumbers: numbers,
		};

	return {
		success: false,
		useNumbers: [],
	};
};

export const isStraight = (cards: Card[]): Result => {
	const copyCards: Card[] = JSON.parse(JSON.stringify(cards));
	copyCards.sort((a, b) => a.number - b.number);
	let count = 1;
	let lastNumber = 0;
	let numbers: number[] = [];

	for (let i = 0; i < copyCards.length; i++) {
		const card = copyCards[i];
		if (card.number - lastNumber > 1) {
			if (count >= 5) break;
			count = 1;
			lastNumber = card.number;
			numbers = [card.number];
		}

		if (card.number - lastNumber === 1) {
			count += 1;
			lastNumber = card.number;
			numbers.push(card.number);
		}
	}
	if (count >= 5)
		return {
			success: true,
			useNumbers: numbers,
		};
	return {
		success: false,
		useNumbers: [],
	};
};

export const isTopCard = (card: Card[]): Result => {
	return {
		success: true,
		useNumbers: [],
	};
};

export const handCheck = (cards: Card[]): GenealogyResult => {
	const sameCards = new Array(15).fill(0);

	const flushCheck = isFlush(cards);
	if (flushCheck.success) {
		const straightCheck = isStraight(flushCheck.useNumbers.map((number) => new Card("spades", number)));
		if (straightCheck.success)
			return {
				genealogy: Genealogy.STRAIGHTFLUSH,
				useNumbers: straightCheck.useNumbers,
			};
		return {
			genealogy: Genealogy.FLUSH,
			useNumbers: flushCheck.useNumbers,
		};
	}

	const straightCheck = isStraight(cards);
	if (straightCheck.success)
		return {
			genealogy: Genealogy.STRAIGHT,
			useNumbers: straightCheck.useNumbers,
		};

	cards.map((card) => {
		sameCards[card.number] += 1;
	});

	const tripleCheck = {
		success: false,
		number: 0,
	};

	let pairs = [];

	for (let i = 0; i < sameCards.length; i++) {
		const count = sameCards[i];
		if (count === 4)
			return {
				genealogy: Genealogy.FOURCARD,
				useNumbers: [i],
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
				useNumbers: [subPair, tripleCheck.number],
			};
		return {
			genealogy: Genealogy.TRIPLE,
			useNumbers: [tripleCheck.number],
		};
	}

	if (pairs.length >= 2) {
		const firstPair = pairs.pop();
		const secondPair = pairs.pop();
		return {
			genealogy: Genealogy.TWOPAIR,
			useNumbers: [secondPair, firstPair],
		};
	}

	if (pairs.length >= 1) {
		return {
			genealogy: Genealogy.ONEPAIR,
			useNumbers: pairs,
		};
	}

	const numbers = cards.sort((a, b) => a.number - b.number).map(({ number }) => number);

	return {
		genealogy: Genealogy.TOP,
		useNumbers: numbers,
	};
};
