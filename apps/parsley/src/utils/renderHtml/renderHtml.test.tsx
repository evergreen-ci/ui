import { render, screen } from "@evg-ui/lib/test_utils";
import renderHtml from ".";

describe("renderHtml", () => {
  it("renders a plain string with no html", () => {
    render(<>{renderHtml("test string")}</>);
    expect(screen.getByText("test string")).toBeInTheDocument();
  });
  it("renders a string with html and preserves allowed elements with their props", () => {
    render(<>{renderHtml("test <span data-testid='element'>string</span>")}</>);
    expect(screen.queryByDataTestId("element")).toHaveTextContent("string");
  });
  it("renders a string with html and escapes disallowed elements", () => {
    const { rerender } = render(
      <>
        {renderHtml(
          "<span data-testid='log-line'>test <script data-testid='should-not-exist'>alert('test')</script></span>",
        )}
      </>,
    );
    expect(screen.queryByDataTestId("should-not-exist")).toBeNull();
    expect(screen.queryByDataTestId("log-line")).toHaveTextContent(
      "test <script data-testid='should-not-exist'>alert('test')</script>",
    );
    rerender(
      <>
        {renderHtml(
          "<span data-testid='log-line'>test <mongo::<std:lib >></span>",
        )}
      </>,
    );
    expect(screen.queryByDataTestId("log-line")).toHaveTextContent(
      "test <mongo::<std:lib >>",
    );
  });
  it("replaces a element with a react component if specified", () => {
    const Component = ({ children }: { children: React.ReactElement }) => (
      <div data-testid="component">✨{children}✨</div>
    );
    render(
      <>
        {renderHtml("test <span data-testid='element'>string</span>", {
          // @ts-expect-error - This is expecting a react component but its an Emotion component which are virtually the same thing
          transformNode: { span: Component },
        })}
      </>,
    );
    expect(screen.queryByDataTestId("element")).not.toBeInTheDocument();
    expect(screen.getByDataTestId("component")).toBeInTheDocument();
    expect(screen.queryByDataTestId("component")).toHaveTextContent(
      "✨string✨",
    );
  });
});
