import { toSentenceCase, toEscapedRegex } from ".";

describe("toSentenceCase", () => {
  it("capitalizes the first letter in a word", () => {
    expect(toSentenceCase("mystring")).toBe("Mystring");
    expect(toSentenceCase("myString")).toBe("Mystring");
  });
});

describe("toEscapedRegex", () => {
  it("escapes special characters in a string", () => {
    // eslint-disable-next-line no-useless-escape -- This is a regex escape character test
    expect(toEscapedRegex("hello-world")).toBe("hello\\-world");
    // eslint-disable-next-line no-useless-escape -- This is a regex escape character test
    expect(toEscapedRegex("hello/world")).toBe("hello\\/world");
    expect(toEscapedRegex("https://example.com")).toBe(
      // eslint-disable-next-line no-useless-escape -- This is a regex escape character test
      `https:\\/\\/example\\\.com`,
    );
  });
});
