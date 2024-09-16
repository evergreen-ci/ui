import Cookie from "js-cookie";
import { MockInstance } from "vitest";
import {
  renderWithRouterMatch as render,
  screen,
} from "@evg-ui/lib/test_utils";
import { logContextWrapper } from "context/LogContext/test_utils";
import { RenderFakeToastContext as InitializeFakeToastContext } from "context/toast/__mocks__";
import HighlightFiltersToggle from ".";

vi.mock("js-cookie");
const mockedGet = vi.spyOn(Cookie, "get") as MockInstance;

const wrapper = logContextWrapper();

describe("highlight filter toggle", () => {
  beforeEach(() => {
    mockedGet.mockImplementation(() => "true");
    InitializeFakeToastContext();
  });

  it("defaults to 'false' if cookie is unset", () => {
    mockedGet.mockImplementation(() => "");
    render(<HighlightFiltersToggle />, { wrapper });
    const highlightFiltersToggle = screen.getByDataCy(
      "highlight-filters-toggle",
    );
    expect(highlightFiltersToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should read from the cookie properly", () => {
    render(<HighlightFiltersToggle />, { wrapper });
    const highlightFiltersToggle = screen.getByDataCy(
      "highlight-filters-toggle",
    );
    expect(highlightFiltersToggle).toHaveAttribute("aria-checked", "true");
  });
});
