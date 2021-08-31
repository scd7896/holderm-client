import { handCheck, isFlush, isStraight } from "./handCheck";
import { mock1Hand, mockHand2, mockHand3 } from "./mockHand";
import { Genealogy } from "../../types";

describe("handCheck Test", () => {
	it("flushCheck", () => {
		expect(isFlush(mock1Hand).success).toBe(true);
	});

	it("straightCheck", () => {
		expect(isStraight(mock1Hand).success).toBe(true);

		const { useCards, success } = isStraight(mockHand2);

		expect(success).toBe(true);
		expect(useCards.map(({ number }) => number)).toEqual([
			mockHand2[1].number,
			mockHand2[2].number,
			mockHand2[3].number,
			mockHand2[4].number,
			mockHand2[6].number,
		]);
		expect(isStraight(mockHand3).useCards.map(({ number }) => number)).toEqual([
			mockHand3[5].number,
			mockHand3[1].number,
			mockHand3[2].number,
			mockHand3[3].number,
			mockHand3[4].number,
			mockHand3[6].number,
			mockHand3[0].number,
		]);
	});

	it("handChecks", () => {
		expect(handCheck(mock1Hand)).toEqual({
			genealogy: Genealogy.STRAIGHTFLUSH,
			useCards: [mock1Hand[4], mock1Hand[3], mock1Hand[2], mock1Hand[1], mock1Hand[6]],
		});
	});
});
