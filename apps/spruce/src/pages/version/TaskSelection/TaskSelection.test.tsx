import { MemoryRouter } from "react-router-dom";
import { act, renderHook } from "@evg-ui/lib/test_utils";
import { PatchTasksQueryParams } from "types/task";
import { SelectedMode } from "./utils";
import { TaskSelectionProvider, useTaskSelectionContext } from ".";

const pageOne = ["a", "b", "c"];
const pageTwo = ["d", "e"];
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
    act(() =>
      result.current.setRowSelection(
        { a: true, c: true },
        pageOne,
        filteredCount,
      ),
    );
    expect(result.current.getRowSelection(pageOne)).toStrictEqual({
      a: true,
      c: true,
    });
    expect(result.current.selectedCount).toBe(2);
    expect(result.current.taskSelection).toStrictEqual({
      mode: SelectedMode.Include,
      taskIds: new Set(["a", "c"]),
    });
  });

  it("keeps selections made on other pages", () => {
    const { result } = setup();
    act(() =>
      result.current.setRowSelection({ a: true }, pageOne, filteredCount),
    );
    expect(result.current.getRowSelection(pageTwo)).toStrictEqual({});
    act(() =>
      result.current.setRowSelection({ d: true }, pageTwo, filteredCount),
    );
    expect(result.current.taskSelection).toStrictEqual({
      mode: SelectedMode.Include,
      taskIds: new Set(["a", "d"]),
    });
    expect(result.current.getRowSelection(pageOne)).toStrictEqual({ a: true });
    expect(result.current.getRowSelection(pageTwo)).toStrictEqual({ d: true });
  });

  it("selects every matching task across pages", () => {
    const { result } = setup();
    act(() => result.current.toggleAll(filteredCount));
    expect(result.current.selectedCount).toBe(5);
    expect(result.current.getRowSelection(pageOne)).toStrictEqual({
      a: true,
      b: true,
      c: true,
    });
    expect(result.current.getRowSelection(pageTwo)).toStrictEqual({
      d: true,
      e: true,
    });
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
    act(() =>
      result.current.setRowSelection({ a: true }, pageOne, filteredCount),
    );
    act(() => result.current.toggleAll(filteredCount));
    expect(result.current.selectedCount).toBe(5);
    expect(result.current.taskSelection).toMatchObject({
      mode: SelectedMode.All,
      excludedIds: new Set(),
    });
  });

  it("clears the selection when toggling all while everything is selected", () => {
    const { result } = setup();
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
    act(() => result.current.toggleAll(filteredCount));
    act(() =>
      result.current.setRowSelection(
        { a: true, c: true },
        pageOne,
        filteredCount,
      ),
    );
    expect(result.current.selectedCount).toBe(4);
    expect(result.current.taskSelection).toMatchObject({
      mode: SelectedMode.All,
      excludedIds: new Set(["b"]),
    });
  });

  it("re-includes an excluded task when it is selected again", () => {
    const { result } = setup();
    act(() => result.current.toggleAll(filteredCount));
    act(() =>
      result.current.setRowSelection(
        { a: true, c: true },
        pageOne,
        filteredCount,
      ),
    );
    expect(result.current.taskSelection).toMatchObject({
      mode: SelectedMode.All,
      excludedIds: new Set(["b"]),
    });
    act(() =>
      result.current.setRowSelection(
        { a: true, b: true, c: true },
        pageOne,
        filteredCount,
      ),
    );
    expect(result.current.taskSelection).toMatchObject({
      mode: SelectedMode.All,
      excludedIds: new Set(),
    });
    expect(result.current.selectedCount).toBe(5);
  });

  it("has no taskSelection once every matching task is deselected", () => {
    const { result } = setup();
    act(() => result.current.toggleAll(3));
    act(() => result.current.setRowSelection({}, pageOne, 3));
    expect(result.current.selectedCount).toBe(0);
    expect(result.current.taskSelection).toBeNull();
  });

  it("clears the selection", () => {
    const { result } = setup();
    act(() => result.current.toggleAll(filteredCount));
    act(() => result.current.clearSelection());
    expect(result.current.selectedCount).toBe(0);
    expect(result.current.taskSelection).toBeNull();
  });
});
