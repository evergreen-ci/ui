import { useTaskAnalytics } from "analytics";
import { processFilesWithAssociatedLinks } from "./AssociatedLinks";

const taskAnalytics = {
  sendEvent: vi.fn(),
} as unknown as ReturnType<typeof useTaskAnalytics>;

describe("processFilesWithAssociatedLinks", () => {
  it("preserves HTTP(S) artifact URLs", () => {
    const [row] = processFilesWithAssociatedLinks(
      [
        {
          associatedLinks: [
            { link: "https://example.com/coverage", name: "Coverage" },
          ],
          link: "https://example.com/artifact",
          name: "artifact",
          urlParsley: "http://example.com/parsley",
        },
      ],
      taskAnalytics,
    );

    expect(row).toMatchObject({
      link: "https://example.com/artifact",
      name: "artifact",
      urlParsley: "http://example.com/parsley",
    });
    expect(row).toHaveProperty("renderExpandedContent");
  });

  it("preserves T2 associated links", () => {
    const [row] = processFilesWithAssociatedLinks(
      [
        {
          associatedLinks: [
            { link: "t2://internal.example.com/artifact", name: "FTDC data" },
          ],
          link: "https://example.com/artifact",
          name: "artifact",
          urlParsley: null,
        },
      ],
      taskAnalytics,
    );

    expect(row).toHaveProperty("renderExpandedContent");
  });

  it("removes unsafe artifact URLs", () => {
    const [row] = processFilesWithAssociatedLinks(
      [
        {
          associatedLinks: [
            {
              link: "vbscript:msgbox(document.domain)",
              name: "Coverage",
            },
          ],
          link: "javascript:alert(document.domain)",
          name: "artifact",
          urlParsley: "data:text/html,<script>alert(document.domain)</script>",
        },
      ],
      taskAnalytics,
    );

    expect(row).toStrictEqual({
      link: null,
      name: "artifact",
      urlParsley: null,
    });
  });
});
