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
    expect(screen.queryAllByDataTestId("highlight")).toHaveLength(3);
    expect(screen.getByDataTestId("dont-highlight-me")).toBeInTheDocument();
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
    expect(screen.queryAllByDataTestId("highlight")).toHaveLength(1);
    expect(screen.queryByDataTestId("highlight")).toHaveTextContent("<");
    expect(screen.getByDataTestId("dont-highlight-me")).toBeInTheDocument();
  });
  it("highlights the content inside of <> if it's not a valid HTML tag", () => {
    render(<>{highlightHtml("<Downloading package...>", /Downloading/gi)}</>);
    expect(screen.queryAllByDataTestId("highlight")).toHaveLength(1);
    expect(screen.getByDataTestId("highlight")).toHaveTextContent(
      "Downloading",
    );
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
    const highlights = screen.queryAllByDataTestId("highlight");
    expect(highlights).toHaveLength(3);
    const colors = new Set(highlights.map((el) => el.getAttribute("color")));
    expect(colors.size).toBe(3);
  });
  it("should deduplicate highlights and searches", () => {
    const regexp = /test/i;
    render(<>{highlightHtml("This is a test", regexp, regexp)}</>);
    expect(screen.queryAllByDataTestId("highlight")).toHaveLength(1);
    expect(screen.getByDataTestId("highlight")).toHaveTextContent("test");
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
    expect(screen.queryAllByDataTestId("highlight")).toHaveLength(2);
    screen.getAllByDataTestId("highlight").forEach((highlight) => {
      expect(highlight).toHaveTextContent(/building|production/i);
    });
  });
});
