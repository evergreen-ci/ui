import { SentryBreadcrumbTypes } from "./types";
import { processHtmlAttributes, validateMetadata } from "./utils";

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

describe("validateMetadata", () => {
  it("warns when metadata is missing", () => {
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const metadata = validateMetadata(
      undefined,
      SentryBreadcrumbTypes.Navigation,
    );
    expect(metadata).toBeUndefined();
    expect(consoleWarn).toHaveBeenCalledWith("Breadcrumb metadata is missing.");
  });

  it("warns when 'from' metadata is missing", () => {
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const metadata = validateMetadata({}, SentryBreadcrumbTypes.Navigation);
    expect(metadata).toEqual({});
    expect(consoleWarn).toHaveBeenCalledWith(
      "Navigation breadcrumbs should include a 'from' metadata field.",
    );
  });

  it("warns when 'to' metadata is missing", () => {
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const metadata = validateMetadata(
      { from: "home" },
      SentryBreadcrumbTypes.Navigation,
    );
    expect(metadata).toEqual({ from: "home" });
    expect(consoleWarn).toHaveBeenCalledWith(
      "Navigation breadcrumbs should include a 'to' metadata field.",
    );
  });

  it("returns metadata when valid", () => {
    const metadata = validateMetadata(
      { from: "home", to: "about" },
      SentryBreadcrumbTypes.Navigation,
    );
    expect(metadata).toEqual({ from: "home", to: "about" });
  });
});
