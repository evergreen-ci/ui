import { RenderFakeToastContext as InitializeFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  renderWithRouterMatch as render,
  screen,
} from "@evg-ui/lib/test_utils";
import { logContextWrapper } from "context/LogContext/test_utils";
import HighlightFiltersToggle from ".";

const wrapper = logContextWrapper();

describe("highlight filter toggle", () => {
  beforeEach(() => {
    localStorage.clear();
    InitializeFakeToastContext();
  });

  it("defaults to 'false' if stored value is unset", () => {
    render(<HighlightFiltersToggle />, { wrapper });
    const highlightFiltersToggle = screen.getByDataCy(
      "highlight-filters-toggle",
    );
    expect(highlightFiltersToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should read from localStorage properly", () => {
    localStorage.setItem("highlight-filters", "true");
    render(<HighlightFiltersToggle />, { wrapper });
    const highlightFiltersToggle = screen.getByDataCy(
      "highlight-filters-toggle",
    );
    expect(highlightFiltersToggle).toHaveAttribute("aria-checked", "true");
  });
});
