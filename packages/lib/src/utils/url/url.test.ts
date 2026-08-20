import { isValidHttpUrl } from ".";

describe("isValidHttpUrl", () => {
  it.each([
    "http://example.com/artifact",
    "https://example.com/artifact",
    "HTTPS://example.com/artifact",
  ])("allows HTTP(S) URLs: %s", (url) => {
    expect(isValidHttpUrl(url)).toBe(true);
  });

  it.each([
    "",
    "/relative/artifact",
    "//example.com/artifact",
    "javascript:alert(document.domain)",
    "java\nscript:alert(document.domain)",
    "data:text/html,<script>alert(document.domain)</script>",
    "vbscript:msgbox(document.domain)",
    "file:///etc/passwd",
    "blob:https://example.com/id",
    "https://",
  ])("rejects non-HTTP(S) and malformed URLs: %s", (url) => {
    expect(isValidHttpUrl(url)).toBe(false);
  });

  it("rejects absent URLs", () => {
    expect(isValidHttpUrl(null)).toBe(false);
    expect(isValidHttpUrl(undefined)).toBe(false);
  });
});
