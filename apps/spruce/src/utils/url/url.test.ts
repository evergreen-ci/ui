import { upsertQueryParam } from ".";

describe("upsertQueryParam", () => {
  it("should return the value when params aren't passed in", () => {
    // @ts-ignore: FIXME. This comment was added by an automated script.
    expect(upsertQueryParam(undefined, "test")).toStrictEqual(["test"]);
    // @ts-ignore: FIXME. This comment was added by an automated script.
    expect(upsertQueryParam(undefined, "something")).toStrictEqual([
      "something",
    ]);
  });
  describe("when there is a single value as a param", () => {
    it("should not add a duplicate value", () => {
      expect(upsertQueryParam("test", "test")).toStrictEqual(["test"]);
    });
    it("should add a new value", () => {
      expect(upsertQueryParam("test", "something")).toStrictEqual([
        "test",
        "something",
      ]);
    });
  });
  describe("when there is a array value as a param", () => {
    it("should not add a duplicate value", () => {
      expect(upsertQueryParam(["test", "something"], "test")).toStrictEqual([
        "test",
        "something",
      ]);
    });
    it("should add a new value", () => {
      expect(upsertQueryParam(["test", "something"], "else")).toStrictEqual([
        "test",
        "something",
        "else",
      ]);
    });
  });
});
