import { formatArrayElements } from "./utils";

describe("formatArrayElements", () => {
  it("matches on numbers indicating array position", () => {
    expect(formatArrayElements("foo.1.bar")).toEqual("foo[1].bar");
  });

  it("matches on array elements that end the string", () => {
    expect(formatArrayElements("admins.1")).toEqual("admins[1]");
    expect(formatArrayElements("admins.12")).toEqual("admins[12]");
  });

  it("does not match on numbers in variable names", () => {
    expect(formatArrayElements("foo.test123")).toEqual("foo.test123");
  });
});
