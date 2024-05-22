import Cookie from "js-cookie";
import { MockInstance } from "vitest";
import { LogContextProvider } from "context/LogContext";
import { renderWithRouterMatch as render, screen } from "test_utils";
import HighlightFiltersToggle from ".";

vi.mock("js-cookie");
const mockedGet = vi.spyOn(Cookie, "get") as MockInstance;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LogContextProvider initialLogLines={[]}>{children}</LogContextProvider>
);

describe("highlight filter toggle", () => {
  beforeEach(() => {
    mockedGet.mockImplementation(() => "true");
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
