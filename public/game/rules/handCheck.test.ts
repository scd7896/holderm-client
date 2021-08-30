import { handCheck, isFlush, isStraight } from "./handCheck";
import { mock1Hand } from "./mockHand";
import { Genealogy } from "../../types";

describe("handCheck Test", () => {
	it("flushCheck", () => {
		expect(isFlush(mock1Hand).success).toBe(true);
	});

	it("straightCheck", () => {
		expect(isStraight(mock1Hand).success).toBe(true);
	});

	it("handChecks", () => {
		expect(handCheck(mock1Hand)).toEqual({
			genealogy: Genealogy.STRAIGHTFLUSH,
			useCards: [mock1Hand[4], mock1Hand[3], mock1Hand[2], mock1Hand[1], mock1Hand[6]],
		});
	});
});
