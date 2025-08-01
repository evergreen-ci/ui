import {
  arraySymmetricDifference,
  arraySetDifference,
  conditionalToArray,
} from ".";

describe("arraySymmetricDifference", () => {
  it("should throw an error if an object is passed in", () => {
    expect(() => arraySymmetricDifference([{}], [{}])).toThrow(
      TypeError("arraySymmetricDifference does not support objects"),
    );
  });
  it("should return an empty array when the arrays are empty", () => {
    expect(arraySymmetricDifference([], [])).toStrictEqual([]);
  });
  it("should return the differing values when the first array is empty", () => {
    expect(arraySymmetricDifference([], ["1", "2", "3"])).toStrictEqual([
      "1",
      "2",
      "3",
    ]);
  });
  it("should return the differing values when the second array is empty", () => {
    expect(arraySymmetricDifference(["1", "2", "3"], [])).toStrictEqual([
      "1",
      "2",
      "3",
    ]);
  });
  it("should return the symmetric difference when the arrays have no common elements", () => {
    expect(
      arraySymmetricDifference(["1", "2", "3"], ["4", "5", "6"]),
    ).toStrictEqual(["1", "2", "3", "4", "5", "6"]);
  });
  it("should return the symmetric difference when the arrays have common elements", () => {
    expect(
      arraySymmetricDifference(["1", "2", "3"], ["3", "4", "5"]),
    ).toStrictEqual(["1", "2", "4", "5"]);
  });
});

describe("conditionalToArray", () => {
  it("should convert a value to an array if shouldBeArray is true", () => {
    expect(conditionalToArray("parsley", true)).toStrictEqual(["parsley"]);
  });
  it("should not convert a value to an array if shouldBeArray is false", () => {
    expect(conditionalToArray("parsley", false)).toBe("parsley");
  });
  it("should properly handles value if it is already an array", () => {
    expect(conditionalToArray(["parsley"], true)).toStrictEqual(["parsley"]);
  });
});

describe("arraySetDifference", () => {
  it("should throw an error if an object is passed in", () => {
    expect(() => arraySetDifference([{}], [{}])).toThrow(
      TypeError("arraySetDifference does not support objects"),
    );
  });
  it("should return an empty array when the arrays are empty", () => {
    expect(arraySetDifference([], [])).toStrictEqual([]);
  });
  it("should return the differing values when the first array is empty", () => {
    expect(arraySetDifference([], ["1", "2", "3"])).toStrictEqual([]);
  });
  it("should return the differing values when the second array is empty", () => {
    expect(arraySetDifference(["1", "2", "3"], [])).toStrictEqual([
      "1",
      "2",
      "3",
    ]);
  });
  it("should return the differing values when the arrays have no common elements", () => {
    expect(arraySetDifference(["1", "2", "3"], ["4", "5", "6"])).toStrictEqual([
      "1",
      "2",
      "3",
    ]);
  });
  it("should return the differing values when the arrays have common elements", () => {
    expect(arraySetDifference(["1", "2", "3"], ["3", "4", "5"])).toStrictEqual([
      "1",
      "2",
    ]);
  });
});
