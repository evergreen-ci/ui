import { IconContextProvider } from "@via-ds/icons";
import { render, screen } from "test_utils";
import { Icon } from ".";

describe("via icon wrapper", () => {
  it("renders local glyphs with generated accessible labels", () => {
    render(
      <>
        <Icon glyph="EvergreenLogo" />
        <Icon glyph="GitHub" />
        <Icon glyph="KnownFailure" />
      </>,
    );
    expect(screen.getByLabelText("Evergreen Logo Icon")).toBeInTheDocument();
    expect(screen.getByLabelText("GitHub Icon")).toBeInTheDocument();
    expect(screen.getByLabelText("Known Failure Icon")).toBeInTheDocument();
  });

  it("delegates non-local glyphs to the Via icon", () => {
    render(<Icon data-testid="via-glyph" glyph="Checkmark" />);
    expect(screen.getByTestId("via-glyph")).toBeInTheDocument();
  });

  it("resolves preset and numeric sizes like Via glyphs", () => {
    render(
      <>
        <Icon data-testid="preset" glyph="EvergreenLogo" size="large" />
        <Icon data-testid="numeric" glyph="EvergreenLogo" size={32} />
        <Icon data-testid="default" glyph="EvergreenLogo" />
      </>,
    );
    expect(screen.getByTestId("preset")).toHaveAttribute("width", "20");
    expect(screen.getByTestId("numeric")).toHaveAttribute("width", "32");
    expect(screen.getByTestId("default")).toHaveAttribute("width", "16");
  });

  it("applies the skeleton loading contract to local glyphs", () => {
    render(
      <IconContextProvider className="shimmer" isLoading>
        <Icon data-testid="loading-local" glyph="EvergreenLogo" />
      </IconContextProvider>,
    );
    const icon = screen.getByTestId("loading-local");
    expect(icon).toHaveAttribute("inert");
    expect(icon).toHaveClass("shimmer");
  });

  it("renders a title element and hides decorative icons", () => {
    render(
      <>
        <Icon glyph="GitHub" title="View on GitHub" />
        <Icon data-testid="decorative" glyph="GitHub" role="presentation" />
      </>,
    );
    expect(
      screen.getByRole("img", { name: "View on GitHub" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("decorative")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
