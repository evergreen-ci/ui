import { render, screen } from "@evg-ui/lib/test_utils";
import { CustomKeyValueRenderConfig } from "./types";
import { applyCustomKeyValueRender } from "./utils";

describe("applyCustomKeyValueRender", () => {
  const mockCustomRenderConfig: CustomKeyValueRenderConfig = {
    prefix1: (value: string) => (
      <span data-testid="custom-render">{value} - rendered by prefix1</span>
    ),
    prefix2: (value: string) => (
      <div data-testid="custom-render">{value} - rendered by prefix2</div>
    ),
  };

  it("should return a ReactNode when key starts with a matching prefix", () => {
    // eslint-disable-next-line testing-library/render-result-naming-convention
    const result = applyCustomKeyValueRender(
      "prefix1-key",
      "value1",
      mockCustomRenderConfig,
    );

    // Render the result to test if it matches the expected ReactNode
    render(result);
    const renderedElement = screen.getByTestId("custom-render");
    expect(renderedElement).toBeInTheDocument();
    expect(renderedElement).toHaveTextContent("value1 - rendered by prefix1");
  });

  it("should return the input value if no prefix matches", () => {
    // eslint-disable-next-line testing-library/render-result-naming-convention
    const result = applyCustomKeyValueRender(
      "unknown-key",
      "value2",
      mockCustomRenderConfig,
    );

    // Render directly since the result should be a string
    expect(result).toBe("value2");
  });

  it("should match the correct prefix when multiple prefixes exist", () => {
    // eslint-disable-next-line testing-library/render-result-naming-convention
    const result = applyCustomKeyValueRender(
      "prefix2-key",
      "value3",
      mockCustomRenderConfig,
    );

    render(result);
    const renderedElement = screen.getByTestId("custom-render");
    expect(renderedElement).toBeInTheDocument();
    expect(renderedElement).toHaveTextContent("value3 - rendered by prefix2");
  });

  it("should return the input value if the customRenderConfig is empty", () => {
    // eslint-disable-next-line testing-library/render-result-naming-convention
    const result = applyCustomKeyValueRender("prefix1-key", "value4", {});

    expect(result).toBe("value4");
  });

  it("should handle keys with no prefixes gracefully", () => {
    // eslint-disable-next-line testing-library/render-result-naming-convention
    const result = applyCustomKeyValueRender(
      "keyWithoutPrefix",
      "value5",
      mockCustomRenderConfig,
    );

    expect(result).toBe("value5");
  });
});
