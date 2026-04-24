import { act, renderHook } from "@evg-ui/lib/test_utils";
import {
  JUMP_TO_FAILING_LINE_ENABLED,
  SECTIONS_ENABLED,
} from "constants/storageKeys";
import { useParsleySettings } from ".";

describe("useParsleySettings", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults both settings to true when localStorage is empty", () => {
    const { result } = renderHook(() => useParsleySettings());
    expect(result.current.settings).toStrictEqual({
      jumpToFailingLineEnabled: true,
      sectionsEnabled: true,
    });
  });

  it("reads existing values from localStorage", () => {
    localStorage.setItem(JUMP_TO_FAILING_LINE_ENABLED, "false");
    localStorage.setItem(SECTIONS_ENABLED, "false");
    const { result } = renderHook(() => useParsleySettings());
    expect(result.current.settings).toStrictEqual({
      jumpToFailingLineEnabled: false,
      sectionsEnabled: false,
    });
  });

  it("updateSettings persists values to localStorage and updates state", () => {
    const { result } = renderHook(() => useParsleySettings());
    act(() => {
      result.current.updateSettings({ jumpToFailingLineEnabled: false });
    });
    expect(result.current.settings.jumpToFailingLineEnabled).toBe(false);
    expect(result.current.settings.sectionsEnabled).toBe(true);
    expect(localStorage.getItem(JUMP_TO_FAILING_LINE_ENABLED)).toBe("false");
    act(() => {
      result.current.updateSettings({ sectionsEnabled: false });
    });
    expect(result.current.settings.sectionsEnabled).toBe(false);
    expect(localStorage.getItem(SECTIONS_ENABLED)).toBe("false");
  });

  it("updateSettings only writes fields that are provided", () => {
    localStorage.setItem(JUMP_TO_FAILING_LINE_ENABLED, "false");
    const { result } = renderHook(() => useParsleySettings());
    act(() => {
      result.current.updateSettings({ sectionsEnabled: false });
    });
    expect(localStorage.getItem(JUMP_TO_FAILING_LINE_ENABLED)).toBe("false");
    expect(localStorage.getItem(SECTIONS_ENABLED)).toBe("false");
  });
});
