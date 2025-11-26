import { vi } from "vitest";
import { renderWithRouterMatch, screen } from "@evg-ui/lib/test_utils";
import { DiffPage } from "./DiffPage";
import * as useDiffStreamModule from "./useDiffStream";

vi.mock("./useDiffStream");
vi.mock("utils/environmentVariables", () => ({
  getEvergreenUrl: vi.fn(() => "https://evergreen.example.com"),
}));

const mockUseDiffStream = vi.spyOn(useDiffStreamModule, "useDiffStream");

describe("DiffPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses patch_number=0 by default when no search param is provided", () => {
    mockUseDiffStream.mockReturnValue({
      error: null,
      isLoading: false,
    });

    renderWithRouterMatch(<DiffPage />, {
      path: "/version/:versionId/diff",
      route: "/version/testVersionId/diff",
    });

    expect(mockUseDiffStream).toHaveBeenCalledWith({
      url: "https://evergreen.example.com/rawdiff/testVersionId/?patch_number=0",
      containerRef: expect.any(Object),
    });
  });

  it("uses patch_number from search params when provided", () => {
    mockUseDiffStream.mockReturnValue({
      error: null,
      isLoading: false,
    });

    renderWithRouterMatch(<DiffPage />, {
      path: "/version/:versionId/diff",
      route: "/version/testVersionId/diff?patch_number=2",
    });

    expect(mockUseDiffStream).toHaveBeenCalledWith({
      url: "https://evergreen.example.com/rawdiff/testVersionId/?patch_number=2",
      containerRef: expect.any(Object),
    });
  });

  it("displays error message when useDiffStream returns an error", () => {
    const errorMessage = "Failed to load diff";
    mockUseDiffStream.mockReturnValue({
      error: new Error(errorMessage),
      isLoading: false,
    });

    renderWithRouterMatch(<DiffPage />, {
      path: "/version/:versionId/diff",
      route: "/version/testVersionId/diff",
    });

    expect(
      screen.getByText(`Error loading diff: ${errorMessage}`),
    ).toBeInTheDocument();
  });

  it("shows loading skeleton when isLoading is true", () => {
    mockUseDiffStream.mockReturnValue({
      error: null,
      isLoading: true,
    });

    renderWithRouterMatch(<DiffPage />, {
      path: "/version/:versionId/diff",
      route: "/version/testVersionId/diff",
    });

    expect(screen.getByTestId("lg-skeleton-list")).toBeInTheDocument();
  });
});
