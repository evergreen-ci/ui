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

  it("should call parsing function when sections are enabled and logs are populated", async () => {
    RenderFakeToastContext();
    const { result } = renderHook(() =>
      useSections({ logs: ["log line"], sectionsEnabled: true }),
    );
    expect(sectionUtils.parseSections).toHaveBeenCalledOnce();
    expect(result.current).toStrictEqual({ sectionData: [] });
  });
  it("should not call parsing function when sections are disabled and logs are populated", async () => {
    RenderFakeToastContext();
    const { result } = renderHook(() =>
      useSections({ logs: ["log line"], sectionsEnabled: false }),
    );
    expect(sectionUtils.parseSections).not.toHaveBeenCalled();
    expect(result.current).toStrictEqual({ sectionData: undefined });
  });
  it("should not call parsing function when sections are enabled and logs are empty", async () => {
    RenderFakeToastContext();
    const { result } = renderHook(() =>
      useSections({ logs: [], sectionsEnabled: true }),
    );
    expect(sectionUtils.parseSections).not.toHaveBeenCalled();
    expect(result.current).toStrictEqual({ sectionData: undefined });
  });
  it("parsing function extracts section data", async () => {
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
  it("should dispatch a toast and report error when the parsing function throws an error", async () => {
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
        "Log file is showing a finished section without a running section before it. This should not happen.",
      ),
    );
    expect(dispatchToast.error).toHaveBeenCalledWith(
      "An error occurred while parsing log sections.",
    );
  });
});
