import { MockedProvider } from "@apollo/client/testing";
import { vi } from "vitest";
import { renderWithRouterMatch, screen, waitFor } from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import { getVersionDiffRoute } from "constants/routes";
import {
  CodeChangesQuery,
  CodeChangesQueryVariables,
} from "gql/generated/types";
import { CODE_CHANGES } from "gql/queries";
import { CodeChanges } from ".";

vi.mock("constants/routes", () => ({
  getVersionDiffRoute: vi.fn(
    (versionId: string, moduleIndex: number) =>
      `/version/${versionId}/diff?patch_number=${moduleIndex}`,
  ),
  getFileDiffRoute: vi.fn(
    (
      versionId: string,
      fileName: string,
      patchNumber?: number,
      commitNumber?: number,
    ) => {
      const params = new URLSearchParams();
      params.set("file_name", fileName);
      if (patchNumber !== undefined) {
        params.set("patch_number", patchNumber.toString());
      }
      if (commitNumber !== undefined) {
        params.set("commit_number", commitNumber.toString());
      }
      const query = params.toString();
      return `/version/${versionId}/file-diff?${query}`;
    },
  ),
}));

const mockGetVersionDiffRoute = vi.mocked(getVersionDiffRoute);

describe("CodeChanges", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("passes index 0 to getVersionDiffRoute for the first module", async () => {
    const patchId = "testPatchId";
    const mocks: ApolloMock<CodeChangesQuery, CodeChangesQueryVariables>[] = [
      {
        request: {
          query: CODE_CHANGES,
          variables: { id: patchId },
        },
        result: {
          data: {
            patch: {
              __typename: "Patch",
              id: patchId,
              moduleCodeChanges: [
                {
                  __typename: "ModuleCodeChange",
                  branchName: "main",
                  rawLink: "rawLink",
                  fileDiffs: [
                    {
                      __typename: "FileDiff",
                      additions: 5,
                      deletions: 3,
                      description: "test commit",
                      fileName: "test.ts",
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    ];

    renderWithRouterMatch(
      <MockedProvider mocks={mocks}>
        <CodeChanges patchId={patchId} />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByDataCy("code-changes")).toBeInTheDocument();
    });

    expect(mockGetVersionDiffRoute).toHaveBeenCalledWith(patchId, 0);
    const htmlButton = screen.getByDataCy("html-diff-btn");
    expect(htmlButton).toHaveAttribute(
      "href",
      `/version/${patchId}/diff?patch_number=0`,
    );
  });

  it("passes correct index to getVersionDiffRoute for multiple modules", async () => {
    const patchId = "testPatchId";
    const mocks: ApolloMock<CodeChangesQuery, CodeChangesQueryVariables>[] = [
      {
        request: {
          query: CODE_CHANGES,
          variables: { id: patchId },
        },
        result: {
          data: {
            patch: {
              __typename: "Patch",
              id: patchId,
              moduleCodeChanges: [
                {
                  __typename: "ModuleCodeChange",
                  branchName: "main",
                  rawLink: "rawLink1",
                  fileDiffs: [
                    {
                      __typename: "FileDiff",
                      additions: 5,
                      deletions: 3,
                      description: "test commit 1",
                      fileName: "test1.ts",
                    },
                  ],
                },
                {
                  __typename: "ModuleCodeChange",
                  branchName: "feature",
                  rawLink: "rawLink2",
                  fileDiffs: [
                    {
                      __typename: "FileDiff",
                      additions: 10,
                      deletions: 2,
                      description: "test commit 2",
                      fileName: "test2.ts",
                    },
                  ],
                },
                {
                  __typename: "ModuleCodeChange",
                  branchName: "develop",
                  rawLink: "rawLink3",
                  fileDiffs: [
                    {
                      __typename: "FileDiff",
                      additions: 7,
                      deletions: 1,
                      description: "test commit 3",
                      fileName: "test3.ts",
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    ];

    renderWithRouterMatch(
      <MockedProvider mocks={mocks}>
        <CodeChanges patchId={patchId} />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByDataCy("code-changes")).toBeInTheDocument();
    });

    expect(mockGetVersionDiffRoute).toHaveBeenCalledTimes(3);
    expect(mockGetVersionDiffRoute).toHaveBeenNthCalledWith(1, patchId, 0);
    expect(mockGetVersionDiffRoute).toHaveBeenNthCalledWith(2, patchId, 1);
    expect(mockGetVersionDiffRoute).toHaveBeenNthCalledWith(3, patchId, 2);

    const htmlButtons = screen.getAllByDataCy("html-diff-btn");
    expect(htmlButtons).toHaveLength(3);
    expect(htmlButtons[0]).toHaveAttribute(
      "href",
      `/version/${patchId}/diff?patch_number=0`,
    );
    expect(htmlButtons[1]).toHaveAttribute(
      "href",
      `/version/${patchId}/diff?patch_number=1`,
    );
    expect(htmlButtons[2]).toHaveAttribute(
      "href",
      `/version/${patchId}/diff?patch_number=2`,
    );
  });

  it("displays loading state", () => {
    const patchId = "testPatchId";
    const mocks: ApolloMock<CodeChangesQuery, CodeChangesQueryVariables>[] = [
      {
        request: {
          query: CODE_CHANGES,
          variables: { id: patchId },
        },
        result: {
          data: {
            patch: {
              __typename: "Patch",
              id: patchId,
              moduleCodeChanges: [],
            },
          },
        },
      },
    ];

    renderWithRouterMatch(
      <MockedProvider mocks={mocks}>
        <CodeChanges patchId={patchId} />
      </MockedProvider>,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
  });
});
