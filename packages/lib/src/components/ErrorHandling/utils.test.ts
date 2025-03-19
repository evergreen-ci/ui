import { processHtmlAttributes } from "./utils";

describe("processHtmlAttributes", () => {
  it("properly extracts attributes", () => {
    const htmlElement = document.createElement("input");
    htmlElement.setAttribute("aria-label", "custom-aria-label");
    htmlElement.setAttribute("title", "custom-title");
    htmlElement.setAttribute("data-cy", "custom-data-cy");
    htmlElement.setAttribute("data-loading", "false");

    const htmlAttributes = processHtmlAttributes(htmlElement);
    expect(htmlAttributes.ariaLabel).toBe("custom-aria-label");
    expect(htmlAttributes?.dataset?.cy).toBe("custom-data-cy");
    expect(htmlAttributes?.dataset?.loading).toBe("false");
    expect(htmlAttributes.title).toBe("custom-title");
  });

  it("omits attributes that are unset", () => {
    const htmlElement = document.createElement("div");
    htmlElement.setAttribute("data-cy", "custom-data-cy");

    const htmlAttributes = processHtmlAttributes(htmlElement);
    expect(htmlAttributes?.dataset?.cy).toBe("custom-data-cy");
    expect(htmlAttributes.ariaLabel).toBeUndefined();
    expect(htmlAttributes.title).toBeUndefined();
  });
});
