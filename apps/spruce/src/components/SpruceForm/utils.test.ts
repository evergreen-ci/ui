import { transformTitleToId } from "./utils";

describe("transformTitleToId", () => {
  it("transforms a title to a valid id", () => {
    expect(transformTitleToId("My Title")).toBe("my-title");
  });
});
