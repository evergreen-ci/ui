import { toSentenceCase, toEscapedRegex } from ".";

describe("toSentenceCase", () => {
  it("capitalizes the first letter in a word", () => {
    expect(toSentenceCase("mystring")).toBe("Mystring");
    expect(toSentenceCase("myString")).toBe("Mystring");
  });
});

describe("toEscapedRegex", () => {
  it("escapes special characters in a string", () => {
    expect(toEscapedRegex("hello-world")).toBe("hello\\-world");
    expect(toEscapedRegex("hello/world")).toBe("hello\\/world");
    expect(toEscapedRegex("https://example.com")).toBe(
      "https:\\/\\/example\\.com",
    );
  });
});
