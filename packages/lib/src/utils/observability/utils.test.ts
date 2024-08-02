import { getElementName } from "./utils";

describe("getElementName", () => {
  it("returns the data-cy attribute if it exists", () => {
    const element = document.createElement("button");
    element.textContent = "test";
    element.setAttribute("aria-label", "test-aria");
    element.setAttribute("data-cy", "test-cy");
    expect(getElementName(element)).toBe(`button[data-cy="test-cy"]`);
  });
  it("returns the aria-label attribute if data-cy does not exist", () => {
    const element = document.createElement("button");
    element.textContent = "test";
    element.setAttribute("aria-label", "test-aria");
    expect(getElementName(element)).toBe(`button[aria-label="test-aria"]`);
  });
  it("returns the textContent if neither data-cy nor aria-label exist", () => {
    const element = document.createElement("button");
    element.textContent = "test";
    expect(getElementName(element)).toBe(`button[textContent="test"]`);
  });
  it("returns the tagName if none of the above exist", () => {
    const element = document.createElement("button");
    expect(getElementName(element)).toBe("button");
  });
});
