import { render, screen } from "@evg-ui/lib/test_utils";
import TagsMetadata from ".";

describe("TagsMetadata", () => {
  it("renders nothing when both tags and failureMetadataTags are empty", () => {
    const { container } = render(<TagsMetadata />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders only tags when failureMetadataTags is empty", () => {
    render(<TagsMetadata tags={["tag1", "tag2"]} />);
    expect(screen.getByText("Tags")).toBeInTheDocument();
    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();
    expect(screen.queryByText("Failure Metadata Tags")).not.toBeInTheDocument();
  });

  it("renders only failureMetadataTags when tags is empty", () => {
    render(<TagsMetadata failureMetadataTags={["fail1", "fail2"]} />);
    expect(screen.getByText("Failure Metadata Tags")).toBeInTheDocument();
    expect(screen.getByText("fail1")).toBeInTheDocument();
    expect(screen.getByText("fail2")).toBeInTheDocument();
  });

  it("renders both tags and failureMetadataTags with divider and label", () => {
    render(<TagsMetadata failureMetadataTags={["failA"]} tags={["tagA"]} />);

    // Title should be "Tags"
    expect(screen.getByText("Tags")).toBeInTheDocument();

    // Tags section
    expect(screen.getByText("tagA")).toBeInTheDocument();

    // Divider section label
    expect(screen.getByText("Failure Metadata Tags")).toBeInTheDocument();

    // Failure tags
    expect(screen.getByText("failA")).toBeInTheDocument();
  });

  it("uses unique keys for tags and failure tags", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    render(<TagsMetadata failureMetadataTags={["shared"]} tags={["shared"]} />);
    expect(screen.getAllByText("shared")).toHaveLength(2);
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.stringContaining(
        'Each child in a list should have a unique "key" prop',
      ),
    );
    consoleErrorSpy.mockRestore();
  });
});
