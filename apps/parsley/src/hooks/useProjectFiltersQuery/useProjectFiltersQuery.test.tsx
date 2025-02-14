import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { renderHook, waitFor } from "@evg-ui/lib/test_utils";
import { projectFiltersMock } from "test_data/projectFilters";
import { repoFiltersMock } from "test_data/repoFilters";
import { useProjectFiltersQuery } from ".";

const wrapper = (mocks: MockedResponse[]) =>
  function ({ children }: { children: React.ReactNode }) {
    return <MockedProvider mocks={mocks}>{children}</MockedProvider>;
  };

describe("useProjectFiltersQuery", () => {
  it("should fetch filters when given projectIdentifier", async () => {
    const { result } = renderHook(
      () =>
        useProjectFiltersQuery({
          projectIdentifier: "spruce",
        }),
      {
        wrapper: wrapper([projectFiltersMock]),
      },
    );
    await waitFor(() => {
      expect(result.current).toStrictEqual([
        {
          __typename: "ParsleyFilter",
          caseSensitive: true,
          exactMatch: true,
          expression:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        },
        {
          __typename: "ParsleyFilter",
          caseSensitive: true,
          exactMatch: false,
          expression: "active filter",
        },
        {
          __typename: "ParsleyFilter",
          caseSensitive: false,
          exactMatch: false,
          expression: ":D",
        },
      ]);
    });
  });
  it("should fetch filters when given a repoID", async () => {
    const { result } = renderHook(
      () =>
        useProjectFiltersQuery({
          repoRefId: "spruceRepoRef",
        }),
      {
        wrapper: wrapper([repoFiltersMock]),
      },
    );
    await waitFor(() => {
      expect(result.current).toStrictEqual([
        {
          __typename: "ParsleyFilter",
          caseSensitive: false,
          exactMatch: true,
          expression:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        },
      ]);
    });
  });
});
