import { expect } from "chai";
import { formatDate } from "../../src/utils/formats";

describe("Date Format", () => {
  it("formats date to correct string format", () => {
    const date = new Date("2023-05-15T14:30:25.123Z");
    expect(formatDate(date)).to.eq("2023-05-15 14:30:25");
  });
});
