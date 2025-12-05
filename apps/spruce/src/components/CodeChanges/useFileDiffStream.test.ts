import { renderHook } from "@testing-library/react";
import * as useHTMLStreamModule from "hooks/useHTMLStream";
import { useFileDiffStream } from "./useFileDiffStream";

vi.mock("hooks/useHTMLStream");

const mockUseHTMLStream = vi.spyOn(useHTMLStreamModule, "useHTMLStream");

describe("useFileDiffStream", () => {
  const mockContainerRef = { current: document.createElement("pre") };
  let processLine!: (lineContent: string) => {
    htmlContent: string;
    style?: React.CSSProperties;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseHTMLStream.mockImplementation(({ processLine: callback }) => {
      processLine = callback;
      return {
        error: null,
        isLoading: false,
      };
    });
  });

  it("matches when fileName equals file path in diff", () => {
    renderHook(() =>
      useFileDiffStream({
        url: "https://example.com/diff",
        containerRef: mockContainerRef,
        fileName: "src/utils.ts",
      }),
    );

    const result = processLine("diff --git a/src/utils.ts b/src/utils.ts");
    expect(result.htmlContent).toBeTruthy();
    expect(result.style).toBeDefined();
  });

  it("does not match when fileName does not equal file path", () => {
    renderHook(() =>
      useFileDiffStream({
        url: "https://example.com/diff",
        containerRef: mockContainerRef,
        fileName: "src/utils.ts",
      }),
    );

    const result1 = processLine(
      "diff --git a/src/utils.test.ts b/src/utils.test.ts",
    );
    expect(result1).toEqual({
      htmlContent: "",
      style: undefined,
    });

    const result2 = processLine("diff --git a/src/other.ts b/src/other.ts");
    expect(result2).toEqual({
      htmlContent: "",
      style: undefined,
    });

    const result3 = processLine("diff --git a/utils.ts b/utils.ts");
    expect(result3).toEqual({
      htmlContent: "",
      style: undefined,
    });
  });

  it("does not match when fileName does not include directory but diff path does", () => {
    renderHook(() =>
      useFileDiffStream({
        url: "https://example.com/diff",
        containerRef: mockContainerRef,
        fileName: "utils.ts",
      }),
    );

    const result = processLine("diff --git a/src/utils.ts b/src/utils.ts");
    expect(result).toEqual({
      htmlContent: "",
      style: undefined,
    });
  });

  it("stops rendering when encountering a new file after target file", () => {
    renderHook(() =>
      useFileDiffStream({
        url: "https://example.com/diff",
        containerRef: mockContainerRef,
        fileName: "src/utils.ts",
      }),
    );

    const result1 = processLine("diff --git a/src/utils.ts b/src/utils.ts");
    expect(result1.htmlContent).toBeTruthy();

    const result2 = processLine("+some content");
    expect(result2.htmlContent).toBeTruthy();

    const result3 = processLine("diff --git a/src/other.ts b/src/other.ts");
    expect(result3).toEqual({
      htmlContent: "",
      style: undefined,
    });
  });

  it("matches when fileName has nested path", () => {
    renderHook(() =>
      useFileDiffStream({
        url: "https://example.com/diff",
        containerRef: mockContainerRef,
        fileName: "nested/path/to/file.ts",
      }),
    );

    const result = processLine(
      "diff --git a/nested/path/to/file.ts b/nested/path/to/file.ts",
    );
    expect(result.htmlContent).toBeTruthy();
    expect(result.style).toBeDefined();
  });

  it("does not match when filePath regex fails to extract path", () => {
    renderHook(() =>
      useFileDiffStream({
        url: "https://example.com/diff",
        containerRef: mockContainerRef,
        fileName: "src/utils.ts",
      }),
    );

    const result = processLine("diff --git a/src/utils.ts");
    expect(result).toEqual({
      htmlContent: "",
      style: undefined,
    });
  });
});
