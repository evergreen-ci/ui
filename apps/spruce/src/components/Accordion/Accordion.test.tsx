import { size } from "@evg-ui/lib/constants/tokens";
import { render, fireEvent, screen } from "@evg-ui/lib/src/test_utils";
import { Accordion } from ".";

describe("Accordion Component", () => {
  const titleText = "Accordion Title";
  const toggledTitleText = "Toggled Accordion Title";
  const contentText = "Accordion Content";
  const subtitleText = "Accordion Subtitle";

  const defaultProps = {
    title: titleText,
    "data-cy": "accordion-container",
    children: <div>{contentText}</div>,
  };

  it("renders the title", () => {
    render(<Accordion {...defaultProps} />);
    expect(screen.getByText(titleText)).toBeInTheDocument();
  });

  it("renders the subtitle when provided", () => {
    render(<Accordion {...defaultProps} subtitle={subtitleText} />);
    expect(screen.getByText(subtitleText)).toBeInTheDocument();
  });

  it("toggles content visibility on click", () => {
    render(<Accordion {...defaultProps} />);
    const toggleButton = screen.getByRole("button");
    // Content should be hidden initially
    expect(screen.queryByText(contentText)).not.toBeVisible();

    // Click to expand
    fireEvent.click(toggleButton);
    expect(screen.getByText(contentText)).toBeVisible();

    // Click to collapse
    fireEvent.click(toggleButton);
    expect(screen.queryByText(contentText)).not.toBeVisible();
  });

  it("shows content by default when defaultOpen is true", () => {
    render(<Accordion {...defaultProps} defaultOpen />);
    expect(screen.getByText(contentText)).toBeVisible();
  });

  it("calls onToggle callback when toggled", () => {
    const onToggleMock = vi.fn();
    render(<Accordion {...defaultProps} onToggle={onToggleMock} />);
    const toggleButton = screen.getByRole("button");

    fireEvent.click(toggleButton);
    expect(onToggleMock).toHaveBeenCalledWith({ isVisible: true });

    fireEvent.click(toggleButton);
    expect(onToggleMock).toHaveBeenCalledWith({ isVisible: false });
  });

  it("renders toggledTitle when provided and accordion is open", () => {
    render(<Accordion {...defaultProps} toggledTitle={toggledTitleText} />);
    const toggleButton = screen.getByRole("button");

    // Click to expand
    fireEvent.click(toggleButton);

    // The title should now display toggledTitleText
    expect(screen.getByText(toggledTitleText)).toBeInTheDocument();
  });

  it("does not indent content when useIndent is false", () => {
    const { rerender } = render(<Accordion {...defaultProps} defaultOpen />);
    let contentsContainer = screen.getByText(contentText).parentElement;
    expect(contentsContainer).toHaveStyle(`margin-left: ${size.s}`);

    rerender(<Accordion {...defaultProps} defaultOpen useIndent={false} />);
    contentsContainer = screen.getByText(contentText).parentElement;
    expect(contentsContainer).not.toHaveStyle(`margin-left: ${size.s}`);
  });

  it("hides caret when showCaret is false", () => {
    render(<Accordion {...defaultProps} showCaret={false} />);
    expect(screen.queryByTestId("accordion-caret")).not.toBeInTheDocument();
  });

  it("renders custom titleTag when provided", () => {
    const CustomTitleTag = ({ children }: { children: any }) => (
      <h2>{children}</h2>
    );
    render(<Accordion {...defaultProps} titleTag={CustomTitleTag} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      titleText,
    );
  });

  it("renders children even when hidden if shouldRenderChildIfHidden is true", () => {
    render(<Accordion {...defaultProps} shouldRenderChildIfHidden />);
    expect(screen.getByText(contentText)).toBeInTheDocument();
  });

  it("does not render children when hidden if shouldRenderChildIfHidden is false", () => {
    render(<Accordion {...defaultProps} shouldRenderChildIfHidden={false} />);
    expect(screen.queryByText(contentText)).not.toBeInTheDocument();
  });

  it("renders content above toggle when toggleFromBottom is true", () => {
    render(<Accordion {...defaultProps} defaultOpen toggleFromBottom />);
    const accordionContainer = screen.getByDataCy("accordion-container");
    const { firstChild } = accordionContainer;

    // The first child should be the content
    expect(firstChild).toHaveAttribute(
      "data-cy",
      "accordion-collapse-container",
    );
  });
});
