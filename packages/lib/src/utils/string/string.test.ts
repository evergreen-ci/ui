import {
  toSentenceCase,
  toEscapedRegex,
  shortenGithash,
  trimLogLineToMaxSize,
  trimStringFromMiddle,
  copyToClipboard,
} from ".";

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

describe("shortenGithash", () => {
  it("shortens githash to 7 characters", () => {
    expect(shortenGithash("01234567890123456789")).toBe("0123456");
    expect(shortenGithash("012")).toBe("012");
  });
  it("handles undefined input", () => {
    expect(shortenGithash(undefined)).toBe("");
  });
});

describe("trimStringFromMiddle", () => {
  it("trims middle text according to specified params", () => {
    expect(trimStringFromMiddle("task_name", 4)).toBe("ta…me"); // odd length
    expect(trimStringFromMiddle("task_name2", 4)).toBe("ta…e2"); // even length
  });
  it("doesn't trim middle text if original text is smaller than maxLength specified", () => {
    expect(trimStringFromMiddle("task_name", 10)).toBe("task_name");
  });
});

describe("copyToClipboard", () => {
  it("should copy the correct text", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: vi.fn(),
      },
    });
    await copyToClipboard("copy text");
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("copy text");
  });
});

describe("trimLogLineToMaxSize", () => {
  it("should not trim a log if it is smaller than the max size", () => {
    expect(trimLogLineToMaxSize("123", 4)).toBe("123");
  });
  it("should trim a log and add an ellipsis if it is longer than the max size", () => {
    expect(trimLogLineToMaxSize("1234", 3)).toBe("123…");
  });
});
