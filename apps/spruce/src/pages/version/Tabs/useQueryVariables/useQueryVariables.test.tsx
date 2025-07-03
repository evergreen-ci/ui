import { MemoryRouter } from "react-router-dom";
import { renderHook } from "@evg-ui/lib/test_utils";
import { TaskSortCategory, SortDirection } from "gql/generated/types";
import { useQueryVariables } from ".";

describe("useQueryVariables", () => {
  const getWrapper = (search: string) => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={[`?${search}`]}>{children}</MemoryRouter>
    );
    Wrapper.displayName = "TestWrapper";
    return Wrapper;
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
        includeNeverActivatedTasks: undefined,
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
        includeNeverActivatedTasks: undefined,
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
  it("includes includeNeverActivatedTasks if it is defined in the search string", () => {
    const versionId = "version";
    const search = "page=0&limit=20&includeNeverActivatedTasks=true";
    const { result } = renderHook(() => useQueryVariables(search, versionId), {
      wrapper: getWrapper(search),
    });
    expect(result.current).toStrictEqual({
      versionId,
      taskFilterOptions: {
        baseStatuses: [],
        statuses: [],
        sorts: [],
        page: 0,
        limit: 20,
        includeNeverActivatedTasks: true,
        taskName: "",
        variant: "",
      },
    });
  });
});
