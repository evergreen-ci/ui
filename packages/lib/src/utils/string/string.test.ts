import { toSentenceCase } from ".";

describe("toSentenceCase", () => {
  it("capitalizes the first letter in a word", () => {
    expect(toSentenceCase("mystring")).toBe("Mystring");
    expect(toSentenceCase("myString")).toBe("Mystring");
  });
});
