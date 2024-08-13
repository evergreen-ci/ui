import { abbreviateTimeZone } from "./fieldMaps";

describe("abbreviateTimeZone", () => {
  it("returns the shortened time zone", () => {
    expect(abbreviateTimeZone("America/New_York")).oneOf(["EST", "EDT"]);
  });

  it("catches invalid time zone", () => {
    expect(abbreviateTimeZone("foo")).toBe("");
  });
});
