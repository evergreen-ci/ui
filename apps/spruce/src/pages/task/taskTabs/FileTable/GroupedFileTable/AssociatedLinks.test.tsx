import { processFilesWithAssociatedLinks } from "./AssociatedLinks";

describe("processFilesWithAssociatedLinks", () => {
  it("preserves HTTP(S) artifact URLs", () => {
    const [row] = processFilesWithAssociatedLinks([
      {
        associatedLinks: [
          { link: "https://example.com/coverage", name: "Coverage" },
        ],
        link: "https://example.com/artifact",
        name: "artifact",
        urlParsley: "http://example.com/parsley",
      },
    ]);

    expect(row).toStrictEqual({
      associatedLinks: [
        { link: "https://example.com/coverage", name: "Coverage" },
      ],
      link: "https://example.com/artifact",
      name: "artifact",
      urlParsley: "http://example.com/parsley",
    });
  });

  it("preserves T2 associated links", () => {
    const [row] = processFilesWithAssociatedLinks([
      {
        associatedLinks: [
          { link: "t2://internal.example.com/artifact", name: "FTDC data" },
        ],
        link: "https://example.com/artifact",
        name: "artifact",
        urlParsley: null,
      },
    ]);

    expect(row.associatedLinks).toStrictEqual([
      { link: "t2://internal.example.com/artifact", name: "FTDC data" },
    ]);
  });

  it("removes unsafe artifact URLs", () => {
    const [row] = processFilesWithAssociatedLinks([
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
    ]);

    expect(row).toStrictEqual({
      associatedLinks: [],
      link: null,
      name: "artifact",
      urlParsley: null,
    });
  });
});
