import { screen } from "@testing-library/react";
import { renderWithRouterMatch } from "@evg-ui/lib/test_utils";
import { FileDiff } from "./FileDiff";
import * as useFileDiffStreamModule from "./useFileDiffStream";

vi.mock("utils/environmentVariables", () => ({
  getEvergreenUrl: vi.fn(() => "https://evergreen.example.com"),
}));

const mockUseFileDiffStream = vi.spyOn(
  useFileDiffStreamModule,
  "useFileDiffStream",
);

describe("FileDiff", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("reads versionId from URL params", () => {
    mockUseFileDiffStream.mockReturnValue({
      error: null,
      isLoading: false,
    });

    renderWithRouterMatch(<FileDiff />, {
      path: "/version/:versionId/file-diff",
      route: "/version/testVersionId/file-diff?file_name=src/utils.ts",
    });

    expect(mockUseFileDiffStream).toHaveBeenCalledWith({
      url: "https://evergreen.example.com/rawdiff/testVersionId/?patch_number=0",
      containerRef: expect.any(Object),
      fileName: "src/utils.ts",
    });
  });

  it("reads file_name from search params", () => {
    mockUseFileDiffStream.mockReturnValue({
      error: null,
      isLoading: false,
    });

    renderWithRouterMatch(<FileDiff />, {
      path: "/version/:versionId/file-diff",
      route: "/version/testVersionId/file-diff?file_name=src/utils.ts",
    });

    expect(mockUseFileDiffStream).toHaveBeenCalledWith(
      expect.objectContaining({
        fileName: "src/utils.ts",
      }),
    );
  });

  it("decodes encoded file_name from search params", () => {
    mockUseFileDiffStream.mockReturnValue({
      error: null,
      isLoading: false,
    });

    const encodedFileName = encodeURIComponent("src/utils with spaces.ts");

    renderWithRouterMatch(<FileDiff />, {
      path: "/version/:versionId/file-diff",
      route: `/version/testVersionId/file-diff?file_name=${encodedFileName}`,
    });

    expect(mockUseFileDiffStream).toHaveBeenCalledWith(
      expect.objectContaining({
        fileName: "src/utils with spaces.ts",
      }),
    );
  });

  it("uses patch_number=0 by default when no search param is provided", () => {
    mockUseFileDiffStream.mockReturnValue({
      error: null,
      isLoading: false,
    });

    renderWithRouterMatch(<FileDiff />, {
      path: "/version/:versionId/file-diff",
      route: "/version/testVersionId/file-diff?file_name=src/utils.ts",
    });

    expect(mockUseFileDiffStream).toHaveBeenCalledWith({
      url: "https://evergreen.example.com/rawdiff/testVersionId/?patch_number=0",
      containerRef: expect.any(Object),
      fileName: "src/utils.ts",
    });
  });

  it("uses patch_number from search params when provided", () => {
    mockUseFileDiffStream.mockReturnValue({
      error: null,
      isLoading: false,
    });

    renderWithRouterMatch(<FileDiff />, {
      path: "/version/:versionId/file-diff",
      route:
        "/version/testVersionId/file-diff?file_name=src/utils.ts&patch_number=2",
    });

    expect(mockUseFileDiffStream).toHaveBeenCalledWith({
      url: "https://evergreen.example.com/rawdiff/testVersionId/?patch_number=2",
      containerRef: expect.any(Object),
      fileName: "src/utils.ts",
    });
  });

  it("displays fileName when present", () => {
    mockUseFileDiffStream.mockReturnValue({
      error: null,
      isLoading: false,
    });

    renderWithRouterMatch(<FileDiff />, {
      path: "/version/:versionId/file-diff",
      route: "/version/testVersionId/file-diff?file_name=src/utils.ts",
    });

    expect(screen.getByText("src/utils.ts")).toBeInTheDocument();
  });

  it("displays error message when useFileDiffStream returns an error", () => {
    const errorMessage = "Failed to load file diff";
    mockUseFileDiffStream.mockReturnValue({
      error: new Error(errorMessage),
      isLoading: false,
    });

    renderWithRouterMatch(<FileDiff />, {
      path: "/version/:versionId/file-diff",
      route: "/version/testVersionId/file-diff?file_name=src/utils.ts",
    });

    expect(
      screen.getByText(`Error loading file diff: ${errorMessage}`),
    ).toBeInTheDocument();
  });

  it("shows loading skeleton when isLoading is true", () => {
    mockUseFileDiffStream.mockReturnValue({
      error: null,
      isLoading: true,
    });

    renderWithRouterMatch(<FileDiff />, {
      path: "/version/:versionId/file-diff",
      route: "/version/testVersionId/file-diff?file_name=src/utils.ts",
    });

    expect(screen.getByTestId("lg-skeleton-list")).toBeInTheDocument();
  });

  it("displays error when file_name parameter is omitted", () => {
    mockUseFileDiffStream.mockReturnValue({
      error: null,
      isLoading: false,
    });

    renderWithRouterMatch(<FileDiff />, {
      path: "/version/:versionId/file-diff",
      route: "/version/testVersionId/file-diff",
    });

    expect(
      screen.getByText("Error: file_name parameter is required"),
    ).toBeInTheDocument();
  });

  it("displays error when file_name parameter is empty", () => {
    mockUseFileDiffStream.mockReturnValue({
      error: null,
      isLoading: false,
    });

    renderWithRouterMatch(<FileDiff />, {
      path: "/version/:versionId/file-diff",
      route: "/version/testVersionId/file-diff?file_name=",
    });

    expect(
      screen.getByText("Error: file_name parameter is required"),
    ).toBeInTheDocument();
  });
});
