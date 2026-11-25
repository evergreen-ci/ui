import { MemoryRouter } from "react-router-dom";
import { act, renderHook } from "@evg-ui/lib/test_utils";
import { PatchTasksQueryParams } from "types/task";
import {
  SelectedMode,
  TaskSelectionProvider,
  useTaskSelectionContext,
} from ".";

const tasks = ["a", "b", "c"];
const filteredCount = 5;

const setup = (search = "") =>
  renderHook(() => useTaskSelectionContext(), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={[`/${search}`]}>
        <TaskSelectionProvider versionId="version">
          {children}
        </TaskSelectionProvider>
      </MemoryRouter>
    ),
  });

describe("useTaskSelectionContext", () => {
  it("throws outside of a provider", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    expect(() => renderHook(() => useTaskSelectionContext())).toThrow(
      "must be used within a TaskSelectionProvider",
    );
    consoleError.mockRestore();
  });

  it("has no selection initially", () => {
    const { result } = setup();
    expect(result.current.selectedCount).toBe(0);
    expect(result.current.taskSelection).toBeNull();
  });

  it("selects individual rows", () => {
    const { result } = setup();
    expect(result.current.selectedCount).toBe(0);
    act(() => result.current.toggleRows(["a"]));
    act(() => result.current.toggleRows(["c"]));
    expect(result.current.selectedCount).toBe(2);
    expect(result.current.taskSelection).toStrictEqual({
      mode: SelectedMode.Include,
      taskIds: new Set(["a", "c"]),
    });
    expect(result.current.isSelected("a")).toBe(true);
    expect(result.current.isSelected("c")).toBe(true);
  });

  it("toggles several rows in a single update", () => {
    const { result } = setup();
    expect(result.current.selectedCount).toBe(0);
    act(() => result.current.toggleRows(["a", "b"]));
    expect(result.current.selectedCount).toBe(2);
    expect(result.current.taskSelection).toStrictEqual({
      mode: SelectedMode.Include,
      taskIds: new Set(["a", "b"]),
    });
  });

  it("keeps selections made on other pages", () => {
    const { result } = setup();
    expect(result.current.selectedCount).toBe(0);
    act(() => result.current.toggleRows(["a"]));
    expect(result.current.selectedCount).toBe(1);
    act(() => result.current.toggleRows(["d"]));
    expect(result.current.selectedCount).toBe(2);
    expect(result.current.taskSelection).toStrictEqual({
      mode: SelectedMode.Include,
      taskIds: new Set(["a", "d"]),
    });
  });

  it("selects every matching task across pages", () => {
    const { result } = setup();
    expect(result.current.selectedCount).toBe(0);
    act(() => result.current.toggleAll(filteredCount));
    expect(result.current.selectedCount).toBe(5);
    expect(result.current.taskSelection).toMatchObject({
      mode: SelectedMode.All,
      excludedIds: new Set(),
    });
  });

  it("selects everything under the filters in the URL", () => {
    const { result } = setup(`?${PatchTasksQueryParams.Statuses}=failed`);
    act(() => result.current.toggleAll(filteredCount));
    expect(result.current.taskSelection).toMatchObject({
      mode: SelectedMode.All,
      filter: { statuses: ["failed"] },
    });
  });

  it("selects everything when only some rows are selected", () => {
    const { result } = setup();
    expect(result.current.selectedCount).toBe(0);
    act(() => result.current.toggleRows(["a"]));
    expect(result.current.selectedCount).toBe(1);
    act(() => result.current.toggleAll(filteredCount));
    expect(result.current.selectedCount).toBe(5);
    expect(result.current.taskSelection).toMatchObject({
      mode: SelectedMode.All,
      excludedIds: new Set(),
    });
  });

  it("clears the selection when toggling all while everything is selected", () => {
    const { result } = setup();
    expect(result.current.selectedCount).toBe(0);
    act(() => result.current.toggleAll(filteredCount));
    expect(result.current.selectedCount).toBe(5);
    act(() => result.current.toggleAll(filteredCount));
    expect(result.current.selectedCount).toBe(0);
    expect(result.current.taskSelection).toBeNull();
  });

  it("does nothing when toggling all with no matching tasks", () => {
    const { result } = setup();
    act(() => result.current.toggleAll(0));
    expect(result.current.selectedCount).toBe(0);
    expect(result.current.taskSelection).toBeNull();
  });

  it("excludes deselected tasks while all are selected", () => {
    const { result } = setup();
    expect(result.current.selectedCount).toBe(0);
    act(() => result.current.toggleAll(filteredCount));
    expect(result.current.selectedCount).toBe(5);
    act(() => result.current.toggleRows(["b"]));
    expect(result.current.selectedCount).toBe(4);
    expect(result.current.taskSelection).toMatchObject({
      mode: SelectedMode.All,
      excludedIds: new Set(["b"]),
    });
  });

  it("re-includes an excluded task when it is selected again", () => {
    const { result } = setup();
    expect(result.current.selectedCount).toBe(0);
    act(() => result.current.toggleAll(filteredCount));
    expect(result.current.selectedCount).toBe(5);
    act(() => result.current.toggleRows(["b"]));
    expect(result.current.selectedCount).toBe(4);
    expect(result.current.taskSelection).toMatchObject({
      mode: SelectedMode.All,
      excludedIds: new Set(["b"]),
    });
    act(() => result.current.toggleRows(["b"]));
    expect(result.current.selectedCount).toBe(5);
    expect(result.current.taskSelection).toMatchObject({
      mode: SelectedMode.All,
      excludedIds: new Set(),
    });
  });

  it("has no taskSelection once every matching task is deselected", () => {
    const { result } = setup();
    act(() => result.current.toggleAll(3));
    expect(result.current.selectedCount).toBe(3);
    act(() => result.current.toggleRows(tasks));
    expect(result.current.selectedCount).toBe(0);
    expect(result.current.taskSelection).toBeNull();
  });

  it("clears the selection", () => {
    const { result } = setup();
    act(() => result.current.toggleAll(filteredCount));
    expect(result.current.selectedCount).toBe(5);
    act(() => result.current.clearSelection());
    expect(result.current.selectedCount).toBe(0);
    expect(result.current.taskSelection).toBeNull();
  });
});
