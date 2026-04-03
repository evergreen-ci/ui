import Cookies from "js-cookie";
import { MemoryRouter } from "react-router-dom";
import type { MockInstance } from "vitest";
import { renderHook } from "@evg-ui/lib/test_utils";
import { INCLUDE_NEVER_ACTIVATED_TASKS } from "constants/cookies";
import { TaskSortCategory, SortDirection } from "gql/generated/types";
import { useQueryVariables } from ".";

vi.mock("js-cookie");
const mockedGet = vi.spyOn(Cookies, "get") as MockInstance;

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
    const { result } = renderHook(() => useQueryVariables(versionId), {
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
    const { result } = renderHook(() => useQueryVariables(versionId), {
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
    const { result } = renderHook(() => useQueryVariables(versionId), {
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

  it("uses cookie when includeNeverActivatedTasks is not in the search string", () => {
    const versionId = "version";
    const search = "page=0&limit=20";
    mockedGet.mockImplementation((key: string) =>
      key === INCLUDE_NEVER_ACTIVATED_TASKS ? "true" : undefined,
    );
    const { result } = renderHook(() => useQueryVariables(versionId), {
      wrapper: getWrapper(search),
    });
    expect(result.current).toStrictEqual({
      versionId,
      taskFilterOptions: {
        taskName: "",
        includeNeverActivatedTasks: true,
        variant: "",
        statuses: [],
        baseStatuses: [],
        sorts: [],
        page: 0,
        limit: 20,
      },
    });
  });
});
