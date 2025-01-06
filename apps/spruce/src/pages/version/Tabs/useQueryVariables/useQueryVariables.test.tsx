import { MemoryRouter } from "react-router-dom";
import { renderHook } from "@evg-ui/lib/test_utils";
import { TaskSortCategory, SortDirection } from "gql/generated/types";
import { useQueryVariables } from ".";

describe("useQueryVariables", () => {
  const getWrapper = (search: string) =>
    function ({ children }: { children: React.ReactNode }) {
      return (
        <MemoryRouter initialEntries={[`?${search}`]}>{children}</MemoryRouter>
      );
    };

  it("returns appropriate variables based on search string", () => {
    const versionId = "version";
    const search =
      "page=0&limit=20&sorts=NAME%3AASC%3BSTATUS%3AASC%3BBASE_STATUS%3ADESC%3BVARIANT%3AASC&statuses=success&taskName=generate";
    const { result } = renderHook(() => useQueryVariables(search, versionId), {
      wrapper: getWrapper(search),
    });
    expect(result.current).toStrictEqual({
      versionId,
      taskFilterOptions: {
        taskName: "generate",
        variant: "",
        statuses: ["success"],
        baseStatuses: [],
        sorts: [
          { Key: TaskSortCategory.Name, Direction: SortDirection.Asc },
          { Key: TaskSortCategory.Status, Direction: SortDirection.Asc },
          { Key: TaskSortCategory.BaseStatus, Direction: SortDirection.Desc },
          { Key: TaskSortCategory.Variant, Direction: SortDirection.Asc },
        ],
        page: 0,
        limit: 20,
      },
    });
  });
  it("filters invalid sorts from the search string", () => {
    const versionId = "version";
    const search =
      "page=0&limit=20&sorts=FAKE_NAME%3AASC%3BFAKE_STATUS%3AASC%3BFAKE_BASE_STATUS%3ADESC%3BVARIANT%3AASC&statuses=success&taskName=generate";
    const { result } = renderHook(() => useQueryVariables(search, versionId), {
      wrapper: getWrapper(search),
    });
    expect(result.current).toStrictEqual({
      versionId,
      taskFilterOptions: {
        taskName: "generate",
        variant: "",
        statuses: ["success"],
        baseStatuses: [],
        sorts: [
          { Key: TaskSortCategory.Variant, Direction: SortDirection.Asc },
        ],
        page: 0,
        limit: 20,
      },
    });
  });
});
