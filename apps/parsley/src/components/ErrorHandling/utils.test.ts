import { processHtmlAttributes } from "./utils";

describe("processHtmlAttributes", () => {
  it("properly extracts attributes", () => {
    const htmlElement = document.createElement("input");
    htmlElement.setAttribute("aria-label", "my-aria-label");
    htmlElement.setAttribute("title", "my-title");
    htmlElement.setAttribute("data-cy", "my-data-cy");
    htmlElement.setAttribute("data-loading", "false");

    const htmlAttributes = processHtmlAttributes(htmlElement);
    expect(htmlAttributes.ariaLabel).toBe("my-aria-label");
    expect(htmlAttributes?.dataset?.cy).toBe("my-data-cy");
    expect(htmlAttributes?.dataset?.loading).toBe("false");
    expect(htmlAttributes.title).toBe("my-title");
  });

  it("omits attributes that are unset", () => {
    const htmlElement = document.createElement("div");
    htmlElement.setAttribute("data-cy", "my-data-cy");

    const htmlAttributes = processHtmlAttributes(htmlElement);
    expect(htmlAttributes?.dataset?.cy).toBe("my-data-cy");
    expect(htmlAttributes.ariaLabel).toBeUndefined();
    expect(htmlAttributes.title).toBeUndefined();
  });
});
