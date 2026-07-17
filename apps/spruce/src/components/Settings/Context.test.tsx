import { AjvError } from "@rjsf/core";
import { act, renderHook, waitFor } from "@evg-ui/lib/test_utils";
import {
  TestProvider,
  initialData,
  useHasUnsavedTab,
  usePopulateForm,
  useTestContext,
} from "./test-utils";

describe("useTestContext", () => {
  it("sets the default state", async () => {
    const { result } = renderHook(() => useTestContext(), {
      wrapper: TestProvider,
    });

    expect(result.current.getTab("foo")).toStrictEqual({
      formData: null,
      hasChanges: false,
      hasError: false,
      initialData: null,
    });
    expect(result.current.getTab("bar")).toStrictEqual({
      formData: null,
      hasChanges: false,
      hasError: false,
      initialData: null,
    });
  });

  it("sets the initial data field", async () => {
    const { result } = renderHook(() => useTestContext(), {
      wrapper: TestProvider,
    });

    act(() => {
      result.current.setInitialData(initialData);
    });

    expect(result.current.getTab("foo")).toStrictEqual({
      formData: null,
      hasChanges: false,
      hasError: false,
      initialData: initialData.foo,
    });
    expect(result.current.getTab("bar")).toStrictEqual({
      formData: null,
      hasChanges: false,
      hasError: false,
      initialData: initialData.bar,
    });
  });

  it("marks the tab as having changes when updateForm is called", async () => {
    const { result } = renderHook(() => useTestContext(), {
      wrapper: TestProvider,
    });

    act(() => {
      result.current.setInitialData(initialData);
    });

    act(() => {
      result.current.updateForm("foo")({
        errors: [],
        formData: { capsLockEnabled: false },
      });
    });

    await waitFor(() => {
      expect(result.current.getTab("foo").hasChanges).toBe(true);
    });
    expect(result.current.getTab("foo").hasError).toBe(false);
    expect(result.current.getTab("bar").hasChanges).toBe(false);
    expect(result.current.getTab("bar").hasError).toBe(false);
  });

  it("updating the form state with identical data does not unsave the tab", async () => {
    const { result } = renderHook(() => useTestContext(), {
      wrapper: TestProvider,
    });

    act(() => {
      result.current.setInitialData(initialData);
    });

    act(() => {
      result.current.updateForm("foo")({
        errors: [],
        formData: initialData.foo,
      });
    });

    expect(result.current.getTab("foo").hasChanges).toBe(false);
  });

  it("an error in updateForm sets the tab's hasError state", async () => {
    const { result } = renderHook(() => useTestContext(), {
      wrapper: TestProvider,
    });

    act(() => {
      result.current.updateForm("foo")({
        errors: [{ name: "err" } as AjvError],
        formData: initialData.foo,
      });
    });

    expect(result.current.getTab("foo").hasError).toBe(true);
  });

  it("saveTab resets hasChanges and subsequent updates are still detected", async () => {
    const { result } = renderHook(() => useTestContext(), {
      wrapper: TestProvider,
    });

    act(() => {
      result.current.setInitialData(initialData);
    });

    act(() => {
      result.current.updateForm("foo")({
        errors: [],
        formData: { capsLockEnabled: false },
      });
    });

    await waitFor(() => {
      expect(result.current.getTab("foo").hasChanges).toBe(true);
    });

    act(() => {
      result.current.saveTab("foo");
      result.current.setInitialData({
        foo: result.current.getTab("foo").formData,
      } as Parameters<typeof result.current.setInitialData>[0]);
    });

    expect(result.current.getTab("foo").hasChanges).toBe(false);

    act(() => {
      result.current.updateForm("foo")({
        errors: [],
        formData: { capsLockEnabled: true },
      });
    });

    await waitFor(() => {
      expect(result.current.getTab("foo").hasChanges).toBe(true);
    });
  });
});

describe("useHasUnsavedTab", () => {
  it("has no unsaved tabs on initial render", () => {
    const { result } = renderHook(() => useHasUnsavedTab(), {
      wrapper: TestProvider,
    });
    expect(result.current.unsavedTabs).toStrictEqual([]);
    expect(result.current.hasUnsaved).toBe(false);
  });

  it("returns names of unsaved tabs", async () => {
    const { result } = renderHook(
      () => ({
        ...useHasUnsavedTab(),
        ...useTestContext(),
      }),
      {
        wrapper: TestProvider,
      },
    );
    expect(result.current.unsavedTabs).toStrictEqual([]);
    expect(result.current.hasUnsaved).toBe(false);

    act(() => {
      result.current.updateForm("bar")({
        errors: [],
        formData: { age: 27, name: "Sophie" },
      });
    });

    await waitFor(() => {
      expect(result.current.hasUnsaved).toBe(true);
    });
    expect(result.current.unsavedTabs).toStrictEqual(["bar"]);
  });
});

describe("usePopulateForm", () => {
  it("updates the form state and marks as saved", async () => {
    const { result } = renderHook(
      () => ({
        ...useHasUnsavedTab(),
        ...useTestContext(),
        populate: usePopulateForm(initialData.foo, "foo"),
      }),
      {
        wrapper: TestProvider,
      },
    );
    expect(result.current.hasUnsaved).toBe(false);
    expect(result.current.getTab("foo")).toStrictEqual({
      formData: { capsLockEnabled: true },
      hasChanges: false,
      hasError: false,
      initialData: null,
    });
    expect(result.current.getTab("bar")).toStrictEqual({
      formData: null,
      hasChanges: false,
      hasError: false,
      initialData: null,
    });
  });
});
