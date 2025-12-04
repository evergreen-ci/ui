import {
  DiffType,
  escapeHtml,
  getDiffLineType,
  getRawDiffUrl,
  isNewFileDiff,
} from "./utils";

vi.mock("utils/environmentVariables", () => ({
  getEvergreenUrl: vi.fn(() => "https://evergreen.example.com"),
}));

describe("CodeChanges utils", () => {
  describe("isNewFileDiff", () => {
    it("returns true for diff --git lines", () => {
      expect(isNewFileDiff("diff --git a/src/utils.ts b/src/utils.ts")).toBe(
        true,
      );
      expect(isNewFileDiff("diff --git a/file.ts b/file.ts")).toBe(true);
    });

    it("returns false for non-diff lines", () => {
      expect(isNewFileDiff("---")).toBe(false);
      expect(isNewFileDiff("--- a/file.ts")).toBe(false);
      expect(isNewFileDiff("+++ b/file.ts")).toBe(false);
      expect(isNewFileDiff("+added line")).toBe(false);
      expect(isNewFileDiff("-removed line")).toBe(false);
      expect(isNewFileDiff(" regular line")).toBe(false);
      expect(isNewFileDiff("")).toBe(false);
    });

    it("does not mistake --- in content for new file diff", () => {
      expect(isNewFileDiff("---")).toBe(false);
      expect(isNewFileDiff(" ---")).toBe(false);
    });

    it("returns false for lines that contain but don't start with diff --git", () => {
      expect(isNewFileDiff("  diff --git a/file.ts b/file.ts")).toBe(false);
      expect(isNewFileDiff("some text diff --git")).toBe(false);
    });
  });

  describe("getDiffLineType", () => {
    it("returns Filestat for +++ lines", () => {
      expect(getDiffLineType("+++ b/file.ts")).toBe(DiffType.Filestat);
      expect(getDiffLineType("+++")).toBe(DiffType.Filestat);
      expect(getDiffLineType("+++ b/file.ts\t2024-01-01")).toBe(
        DiffType.Filestat,
      );
    });

    it("returns Filestat for --- lines", () => {
      expect(getDiffLineType("--- a/file.ts")).toBe(DiffType.Filestat);
      expect(getDiffLineType("---")).toBe(DiffType.Filestat);
      expect(getDiffLineType("--- a/file.ts\t2024-01-01")).toBe(
        DiffType.Filestat,
      );
    });

    it("handles standalone --- line correctly", () => {
      // A line that is just "---" is a filestat line, not a deletion
      // This ensures it won't be styled as a deletion (red background)
      expect(getDiffLineType("---")).toBe(DiffType.Filestat);

      // If it's actual content in a diff, it would have a prefix:
      expect(getDiffLineType("+---")).toBe(DiffType.Addition);
      expect(getDiffLineType("- ---")).toBe(DiffType.Deletion);
      expect(getDiffLineType(" ---")).toBe(DiffType.Context);
    });

    it("returns Addition for + lines", () => {
      expect(getDiffLineType("+added line")).toBe(DiffType.Addition);
      expect(getDiffLineType("+")).toBe(DiffType.Addition);
      expect(getDiffLineType("+  indented")).toBe(DiffType.Addition);
    });

    it("returns Deletion for - lines", () => {
      expect(getDiffLineType("-removed line")).toBe(DiffType.Deletion);
      expect(getDiffLineType("-")).toBe(DiffType.Deletion);
      expect(getDiffLineType("-  indented")).toBe(DiffType.Deletion);
    });

    it("returns Context for other lines", () => {
      expect(getDiffLineType(" regular line")).toBe(DiffType.Context);
      expect(getDiffLineType("@@ -1,2 +1,2 @@")).toBe(DiffType.Context);
      expect(getDiffLineType("")).toBe(DiffType.Context);
      expect(getDiffLineType("some text")).toBe(DiffType.Context);
    });

    it("prioritizes +++ and --- over + and -", () => {
      expect(getDiffLineType("+++")).toBe(DiffType.Filestat);
      expect(getDiffLineType("---")).toBe(DiffType.Filestat);
      expect(getDiffLineType("+++ b/file.ts")).toBe(DiffType.Filestat);
      expect(getDiffLineType("--- a/file.ts")).toBe(DiffType.Filestat);
    });
  });

  describe("escapeHtml", () => {
    it("escapes HTML special characters", () => {
      expect(escapeHtml("<script>alert('xss')</script>")).toBe(
        "&lt;script&gt;alert(&#039;xss&#039;)&lt;/script&gt;",
      );
      expect(escapeHtml('"quoted"')).toBe("&quot;quoted&quot;");
      expect(escapeHtml("&amp;")).toBe("&amp;amp;");
    });

    it("handles empty string", () => {
      expect(escapeHtml("")).toBe("");
    });

    it("handles strings without special characters", () => {
      expect(escapeHtml("plain text")).toBe("plain text");
    });

    it("escapes all occurrences", () => {
      expect(escapeHtml("<<<>>>")).toBe("&lt;&lt;&lt;&gt;&gt;&gt;");
      expect(escapeHtml("''''")).toBe("&#039;&#039;&#039;&#039;");
    });
  });

  describe("getRawDiffUrl", () => {
    it("returns URL with versionId and patch_number", () => {
      expect(getRawDiffUrl("version123", 0)).toBe(
        "https://evergreen.example.com/rawdiff/version123/?patch_number=0",
      );
      expect(getRawDiffUrl("version123", 5)).toBe(
        "https://evergreen.example.com/rawdiff/version123/?patch_number=5",
      );
      expect(getRawDiffUrl("version123", "2")).toBe(
        "https://evergreen.example.com/rawdiff/version123/?patch_number=2",
      );
    });

    it("defaults patch_number to 0", () => {
      expect(getRawDiffUrl("version123")).toBe(
        "https://evergreen.example.com/rawdiff/version123/?patch_number=0",
      );
    });

    it("returns null when versionId is undefined", () => {
      expect(getRawDiffUrl(undefined)).toBe(null);
      expect(getRawDiffUrl(undefined, 5)).toBe(null);
    });
  });
});
