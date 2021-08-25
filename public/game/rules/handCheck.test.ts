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
			useNumbers: [10, 11, 12, 13, 14],
		});
	});
});
