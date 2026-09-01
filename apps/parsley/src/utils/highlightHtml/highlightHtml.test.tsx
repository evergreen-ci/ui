import { render, screen } from "@evg-ui/lib/test_utils";
import highlightHtml from ".";

describe("highlightHtml", () => {
  it("does not corrupt the content within valid HTML tags/attributes", () => {
    render(
      <>
        {highlightHtml(
          "<a href='https://donthighlightme.com'>highlight me</a> highlight me <span data-testid='dont-highlight-me'>highlight me</span>",
          /highlight/gi,
        )}
      </>,
    );
    expect(screen.queryAllByTestId("highlight")).toHaveLength(3);
    expect(screen.getByTestId("dont-highlight-me")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "highlight me" })).toHaveAttribute(
      "href",
      "https://donthighlightme.com",
    );
  });
  it("can highlight < or > without corrupting valid HTML tags/attributes", () => {
    render(
      <>
        {highlightHtml(
          "<blah blah> <span data-testid='dont-highlight-me'>blah blah</span>",
          /</gi,
        )}
      </>,
    );
    expect(screen.queryAllByTestId("highlight")).toHaveLength(1);
    expect(screen.queryByTestId("highlight")).toHaveTextContent("<");
    expect(screen.getByTestId("dont-highlight-me")).toBeInTheDocument();
  });
  it("highlights the content inside of <> if it's not a valid HTML tag", () => {
    render(<>{highlightHtml("<Downloading package...>", /Downloading/gi)}</>);
    expect(screen.queryAllByTestId("highlight")).toHaveLength(1);
    expect(screen.getByTestId("highlight")).toHaveTextContent("Downloading");
  });
  it("applies multiple highlights with different colors", () => {
    render(
      <>
        {highlightHtml(
          "Downloading node package...",
          undefined,
          /(Downloading)|(node)|(package)/gi,
        )}
      </>,
    );
    const highlights = screen.queryAllByTestId("highlight");
    expect(highlights).toHaveLength(3);
    const colors = new Set(highlights.map((el) => el.getAttribute("color")));
    expect(colors.size).toBe(3);
  });
  it("should deduplicate highlights and searches", () => {
    const regexp = /test/i;
    render(<>{highlightHtml("This is a test", regexp, regexp)}</>);
    expect(screen.queryAllByTestId("highlight")).toHaveLength(1);
    expect(screen.getByTestId("highlight")).toHaveTextContent("test");
  });
  it("should show both highlights and searches if they are on the same line", () => {
    render(
      <>
        {highlightHtml(
          "building for production...",
          /building/i,
          /(production)/i,
        )}
      </>,
    );
    expect(screen.queryAllByTestId("highlight")).toHaveLength(2);
    screen.getAllByTestId("highlight").forEach((highlight) => {
      expect(highlight).toHaveTextContent(/building|production/i);
    });
  });
  it("preserves safe attributes on raw mark elements", () => {
    const logLine =
      '<mark data-testid="log-mark" color="red" style="background-image:url(https://example.com)">marked</mark>';

    render(<>{highlightHtml(logLine)}</>);

    expect(screen.getByTestId("log-mark")).toHaveAttribute("color", "red");
    expect(screen.getByTestId("log-mark")).not.toHaveAttribute("style");
  });
  it("does not render entity-encoded markup", () => {
    const maliciousLogLine =
      '&lt;mark data-testid="injected-mark" color="red;}body{background-image:url(https://example.com)"&gt;malicious&lt;/mark&gt;';

    render(<>{highlightHtml(maliciousLogLine)}</>);

    expect(screen.queryByTestId("injected-mark")).not.toBeInTheDocument();
    expect(screen.getByText(/<mark data-testid="injected-mark"/)).toBeVisible();
  });
  it("keeps decoded markup as text when highlighting its contents", () => {
    const maliciousLogLine =
      '&lt;mark data-testid="injected-mark" color="malicious"&gt;hello&lt;/mark&gt;';

    const { container } = render(
      <>{highlightHtml(maliciousLogLine, /hello/g)}</>,
    );

    expect(screen.queryByTestId("injected-mark")).not.toBeInTheDocument();
    expect(screen.getByTestId("highlight")).toHaveTextContent("hello");
    expect(container.textContent).toBe(
      '<mark data-testid="injected-mark" color="malicious">hello</mark>',
    );
  });
  it("does not pass entity-encoded style attributes to React", () => {
    const malformedStyle =
      '&lt;mark style="color: red"&gt;malicious&lt;/mark&gt;';

    expect(() => render(<>{highlightHtml(malformedStyle)}</>)).not.toThrow();
    expect(
      screen.getByText('<mark style="color: red">malicious</mark>'),
    ).toBeVisible();
  });
});
