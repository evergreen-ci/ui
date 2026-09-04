import { IconContextProvider, isComponentGlyph } from "@via-ds/icons";
import { render, screen } from "test_utils";
import { Icon } from ".";

describe("Icon", () => {
  it("renders a Via glyph", () => {
    render(<Icon data-testid="via-glyph" glyph="Checkmark" />);
    expect(screen.getByTestId("via-glyph")).toBeInTheDocument();
  });

  it("carries the isGlyph marker so LG glyph-slot components (SideNavGroup etc.) accept it", () => {
    expect(isComponentGlyph(<Icon glyph="Expand" />)).toBe(true);
    expect(isComponentGlyph(<Icon glyph="Checkmark" />)).toBe(true);
  });

  it("defaults to 16px", () => {
    render(<Icon data-testid="default" glyph="Checkmark" />);
    expect(screen.getByTestId("default")).toHaveAttribute("width", "16");
  });

  it("ignores IconContext size, matching LeafyGreen behavior", () => {
    render(
      <IconContextProvider size="large">
        <Icon data-testid="default" glyph="Checkmark" />
        <Icon data-testid="explicit" glyph="Checkmark" size="small" />
      </IconContextProvider>,
    );
    expect(screen.getByTestId("default")).toHaveAttribute("width", "16");
    expect(screen.getByTestId("explicit")).toHaveAttribute("width", "14");
  });

  it('maps the legacy LG "default" size key to 16px (injected by LG IconButton via cloneElement)', () => {
    render(
      <>
        <Icon data-testid="via" glyph="Checkmark" size={"default" as never} />
        <Icon data-testid="local" glyph="GitHub" size={"default" as never} />
      </>,
    );
    expect(screen.getByTestId("via")).toHaveAttribute("width", "16");
    expect(screen.getByTestId("local")).toHaveAttribute("width", "16");
  });

  it("renders seasonal logos at their intrinsic default size with artwork intact", () => {
    render(<Icon data-testid="spring" glyph="SpringLogo" />);
    const svg = screen.getByTestId("spring");
    expect(svg).toHaveAttribute("width", "75");
    expect(svg).toHaveAttribute("height", "75");
    expect(svg).toHaveAttribute("viewBox", "0 -10 359 445");
    // SMIL animation and custom fills survive createGlyph's content passthrough
    expect(svg.querySelector("animate")).not.toBeNull();
    expect(svg.querySelector('[fill="#00A35C"]')).not.toBeNull();
  });

  it("honors explicit sizes on seasonal logos", () => {
    render(<Icon data-testid="winter" glyph="WinterLogo" size={32} />);
    expect(screen.getByTestId("winter")).toHaveAttribute("width", "32");
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
