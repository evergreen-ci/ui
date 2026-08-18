import { render, screen } from "test_utils";
import { Icon } from ".";

describe("Icon", () => {
  it("renders a Via glyph", () => {
    render(<Icon data-testid="via-glyph" glyph="Checkmark" />);
    expect(screen.getByTestId("via-glyph")).toBeInTheDocument();
  });

  it("renders a local glyph", () => {
    render(<Icon data-testid="local-glyph" glyph="GitHub" />);
    expect(screen.getByTestId("local-glyph")).toBeInTheDocument();
  });

  it("resolves preset and numeric sizes for Via glyphs", () => {
    render(
      <>
        <Icon data-testid="small" glyph="Checkmark" size="small" />
        <Icon data-testid="medium" glyph="Checkmark" size="medium" />
        <Icon data-testid="large" glyph="Checkmark" size="large" />
        <Icon data-testid="numeric" glyph="Checkmark" size={32} />
      </>,
    );
    expect(screen.getByTestId("small")).toHaveAttribute("width", "14");
    expect(screen.getByTestId("medium")).toHaveAttribute("width", "16");
    expect(screen.getByTestId("large")).toHaveAttribute("width", "20");
    expect(screen.getByTestId("numeric")).toHaveAttribute("width", "32");
  });

  it("maps xlarge to 24px for Via glyphs", () => {
    render(<Icon data-testid="xlarge" glyph="Checkmark" size="xlarge" />);
    expect(screen.getByTestId("xlarge")).toHaveAttribute("width", "24");
  });

  it("resolves preset and numeric sizes for local glyphs", () => {
    render(
      <>
        <Icon data-testid="small" glyph="GitHub" size="small" />
        <Icon data-testid="medium" glyph="GitHub" size="medium" />
        <Icon data-testid="large" glyph="GitHub" size="large" />
        <Icon data-testid="numeric" glyph="GitHub" size={32} />
      </>,
    );
    expect(screen.getByTestId("small")).toHaveAttribute("width", "14");
    expect(screen.getByTestId("medium")).toHaveAttribute("width", "16");
    expect(screen.getByTestId("large")).toHaveAttribute("width", "20");
    expect(screen.getByTestId("numeric")).toHaveAttribute("width", "32");
  });

  it("maps xlarge to 24px for local glyphs", () => {
    render(<Icon data-testid="xlarge" glyph="GitHub" size="xlarge" />);
    expect(screen.getByTestId("xlarge")).toHaveAttribute("width", "24");
  });

  it("renders an accessible title when provided", () => {
    render(<Icon glyph="GitHub" title="View on GitHub" />);
    expect(
      screen.getByRole("img", { name: "View on GitHub" }),
    ).toBeInTheDocument();
  });

  it("hides decorative icons", () => {
    render(
      <Icon data-testid="decorative" glyph="GitHub" role="presentation" />,
    );
    expect(screen.getByTestId("decorative")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
