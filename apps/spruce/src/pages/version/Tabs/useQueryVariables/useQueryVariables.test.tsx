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
  beforeEach(() => {
    vi.stubGlobal(
      "localStorage",
      (() => {
        const store: Record<string, string> = {};
        return {
          clear: () => Object.keys(store).forEach((k) => delete store[k]),
          getItem: (key: string) => store[key] ?? null,
          removeItem: (key: string) => {
            delete store[key];
          },
          setItem: (key: string, value: string) => {
            store[key] = value;
          },
        };
      })(),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

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
      taskFilterOptions: {
        baseStatuses: [],
        includeNeverActivatedTasks: false,
        limit: 20,
        page: 0,
        sorts: [
          { Direction: SortDirection.Asc, Key: TaskSortCategory.Name },
          { Direction: SortDirection.Asc, Key: TaskSortCategory.Status },
          { Direction: SortDirection.Desc, Key: TaskSortCategory.BaseStatus },
          { Direction: SortDirection.Asc, Key: TaskSortCategory.Variant },
        ],
        statuses: ["success"],
        taskName: "generate",
        variant: "",
      },
      versionId,
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
      taskFilterOptions: {
        baseStatuses: [],
        includeNeverActivatedTasks: false,
        limit: 20,
        page: 0,
        sorts: [
          { Direction: SortDirection.Asc, Key: TaskSortCategory.Variant },
        ],
        statuses: ["success"],
        taskName: "generate",
        variant: "",
      },
      versionId,
    });
  });

  it("includes includeNeverActivatedTasks if it is defined in the search string", () => {
    const versionId = "version";
    const search = "page=0&limit=20&includeNeverActivatedTasks=true";
    const { result } = renderHook(() => useQueryVariables(versionId), {
      wrapper: getWrapper(search),
    });
    expect(result.current).toStrictEqual({
      taskFilterOptions: {
        baseStatuses: [],
        includeNeverActivatedTasks: true,
        limit: 20,
        page: 0,
        sorts: [],
        statuses: [],
        taskName: "",
        variant: "",
      },
      versionId,
    });
  });

  it("should not parse commas in variant as array values", () => {
    const versionId = "version";
    const search = "page=0&limit=20&variant=ubuntu1804,rhel70";
    const { result } = renderHook(() => useQueryVariables(versionId), {
      wrapper: getWrapper(search),
    });
    expect(result.current.taskFilterOptions.variant).toBe("ubuntu1804,rhel70");
  });

  it("should not parse commas in taskName as array values", () => {
    const versionId = "version";
    const search = "page=0&limit=20&taskName=compile,lint";
    const { result } = renderHook(() => useQueryVariables(versionId), {
      wrapper: getWrapper(search),
    });
    expect(result.current.taskFilterOptions.taskName).toBe("compile,lint");
  });

  it("should still parse statuses with commas as arrays", () => {
    const versionId = "version";
    const search =
      "page=0&limit=20&taskName=compile,lint&variant=ubuntu1804,rhel70&statuses=failed,succeeded";
    const { result } = renderHook(() => useQueryVariables(versionId), {
      wrapper: getWrapper(search),
    });
    expect(result.current.taskFilterOptions.taskName).toBe("compile,lint");
    expect(result.current.taskFilterOptions.variant).toBe("ubuntu1804,rhel70");
    expect(result.current.taskFilterOptions.statuses).toStrictEqual([
      "failed",
      "succeeded",
    ]);
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
      taskFilterOptions: {
        baseStatuses: [],
        includeNeverActivatedTasks: true,
        limit: 20,
        page: 0,
        sorts: [],
        statuses: [],
        taskName: "",
        variant: "",
      },
      versionId,
    });
  });
});
