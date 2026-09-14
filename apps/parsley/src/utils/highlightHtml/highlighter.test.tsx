import { highlighter } from "./highlighter";

describe("highlighter", () => {
  it("should return the text with the matches replaced by the function", () => {
    const regexp = /a/g;
    const text = "a b c";
    const replaceFunction = (match: string, matchIndex: number) =>
      matchIndex.toString();
    const result = highlighter(regexp, text, replaceFunction);
    expect(result).toEqual(["", "0", " b c"]);
  });
  it("if the regex has no matches, it should return the original text", () => {
    const regexp = /b/g;
    const text = "a a a";
    const replaceFunction = (match: string, matchIndex: number) =>
      matchIndex.toString();
    const result = highlighter(regexp, text, replaceFunction);
    expect(result).toEqual(["a a a"]);
  });
  it("if the regex has multiple capture groups, it should return the matches replaced by the function", () => {
    const regexp = /(a)|(b)|(c)/g;
    const text = "a b c";
    const replaceFunction = (match: string, matchIndex: number) =>
      matchIndex.toString();
    const result = highlighter(regexp, text, replaceFunction);
    expect(result).toEqual(["", "0", " ", "1", " ", "2", ""]);
  });
  it("keeps unmatched text separate from replacement elements", () => {
    const text = '<mark color="malicious">hello</mark>';
    const replacement = <mark>hello</mark>;

    const result = highlighter(/hello/g, text, () => replacement);

    expect(result).toEqual([
      '<mark color="malicious">',
      replacement,
      "</mark>",
    ]);
  });
});
