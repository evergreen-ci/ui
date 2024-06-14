import { renderHook } from "@testing-library/react";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import * as ErrorReporting from "utils/errorReporting";
import { useSections } from ".";
import * as sectionUtils from "./utils";

describe("useSections", () => {
  beforeEach(() => {
    vi.spyOn(sectionUtils, "parseSections");
    vi.spyOn(ErrorReporting, "reportError");
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call parsing function when sections are enabled and logs are populated", () => {
    RenderFakeToastContext();
    const { result } = renderHook(() =>
      useSections({ logs: ["log line"], sectionsEnabled: true }),
    );
    expect(sectionUtils.parseSections).toHaveBeenCalledOnce();
    expect(result.current).toStrictEqual({ sectionData: [] });
  });
  it("should not call parsing function when sections are disabled and logs are populated", () => {
    RenderFakeToastContext();
    const { result } = renderHook(() =>
      useSections({ logs: ["log line"], sectionsEnabled: false }),
    );
    expect(sectionUtils.parseSections).not.toHaveBeenCalled();
    expect(result.current).toStrictEqual({ sectionData: undefined });
  });
  it("should not call parsing function when sections are enabled and logs are empty", () => {
    RenderFakeToastContext();
    const { result } = renderHook(() =>
      useSections({ logs: [], sectionsEnabled: true }),
    );
    expect(sectionUtils.parseSections).not.toHaveBeenCalled();
    expect(result.current).toStrictEqual({ sectionData: undefined });
  });
  it("parsing function extracts section data", () => {
    RenderFakeToastContext();
    const logs = [
      "normal log line",
      "Running command 'c1' in function 'f-1'.",
      "Finished command 'c1' in function 'f-1'.",
    ];
    const { result } = renderHook(() =>
      useSections({ logs, sectionsEnabled: true }),
    );
    expect(sectionUtils.parseSections).toHaveBeenCalledOnce();
    expect(result.current).toStrictEqual({
      sectionData: [{ functionName: "f-1", range: { end: 3, start: 1 } }],
    });
  });
  it("should dispatch a toast and report error when the parsing function throws an error", () => {
    const { dispatchToast } = RenderFakeToastContext();
    const { result } = renderHook(() =>
      useSections({
        logs: ["Finished command 'c1' in function 'f-1'."],
        sectionsEnabled: true,
      }),
    );
    expect(sectionUtils.parseSections).toHaveBeenCalledOnce();
    expect(result.current).toStrictEqual({ sectionData: undefined });
    expect(ErrorReporting.reportError).toHaveBeenCalledWith(
      new Error(
        "Log file is showing a finished section without a running section before it.",
      ),
    );
    expect(dispatchToast.error).toHaveBeenCalledWith(
      "An error occurred while parsing log sections.",
    );
  });
  it("parsing function is not called after initial parse", () => {
    RenderFakeToastContext();
    const logs = ["normal log line"];
    const { rerender } = renderHook(
      (props) => useSections({ logs, sectionsEnabled: props.sectionsEnabled }),
      { initialProps: { sectionsEnabled: true } },
    );
    expect(sectionUtils.parseSections).toHaveBeenCalledOnce();
    rerender({ sectionsEnabled: false });
    rerender({ sectionsEnabled: true });
    expect(sectionUtils.parseSections).toHaveBeenCalledOnce();
  });
});
