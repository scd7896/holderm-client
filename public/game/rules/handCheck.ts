import { Card, Genealogy, GenealogyResult, Result } from "../../types";

export const isStraightFlush = (cards: Card[]): Result => {
	const flushCheck = isFlush(cards);
	if (flushCheck.success) {
		const flushCards = flushCheck.useNumbers.map((number) => {
			const card = new Card();
			card.suit = "spades";
			card.number = number;
			return card;
		});

		const straightCheck = isStraight(flushCards);
		const useNumbers = straightCheck.useNumbers.sort((a, b) => a - b);
		if (straightCheck.success)
			return {
				success: true,
				useNumbers,
			};
	}
	return {
		success: false,
		useNumbers: [],
	};
};

export const isFourCard = (card: Card[]): Result => {
	return {
		success: true,
		useNumbers: [],
	};
};

export const isFullHouse = (card: Card[]): Result => {
	return {
		success: true,
		useNumbers: [],
	};
};

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

export const isTriple = (card: Card[]): Result => {
	return {
		success: true,
		useNumbers: [],
	};
};

export const isTwoPair = (card: Card[]): Result => {
	return {
		success: true,
		useNumbers: [],
	};
};

export const isOnePair = (card: Card[]): Result => {
	return {
		success: true,
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
	const straightFlush = isStraightFlush(cards);
	if (straightFlush.success)
		return {
			genealogy: Genealogy.STRAIGHTFLUSH,
			useNumbers: straightFlush.useNumbers,
		};

	const fourCard = isFourCard(cards);
	if (fourCard.success)
		return {
			genealogy: Genealogy.FOURCARD,
			useNumbers: fourCard.useNumbers,
		};

	const fullHouseCard = isFullHouse(cards);
	if (fullHouseCard.success)
		return {
			genealogy: Genealogy.FULLHOUSE,
			useNumbers: fullHouseCard.useNumbers,
		};

	const flushCard = isFlush(cards);
	if (flushCard.success)
		return {
			genealogy: Genealogy.FLUSH,
			useNumbers: flushCard.useNumbers,
		};

	const straightCard = isStraight(cards);
	if (straightCard.success)
		return {
			genealogy: Genealogy.STRAIGHT,
			useNumbers: straightCard.useNumbers,
		};

	const tripleCard = isTriple(cards);
	if (tripleCard.success)
		return {
			genealogy: Genealogy.TRIPLE,
			useNumbers: tripleCard.useNumbers,
		};

	const twoPairCard = isTwoPair(cards);
	if (twoPairCard.success)
		return {
			genealogy: Genealogy.TWOPAIR,
			useNumbers: twoPairCard.useNumbers,
		};

	const onePairCard = isOnePair(cards);
	if (onePairCard.success)
		return {
			genealogy: Genealogy.ONEPAIR,
			useNumbers: onePairCard.useNumbers,
		};

	const topCard = isTopCard(cards);
	if (topCard.success)
		return {
			genealogy: Genealogy.TOP,
			useNumbers: topCard.useNumbers,
		};
};
