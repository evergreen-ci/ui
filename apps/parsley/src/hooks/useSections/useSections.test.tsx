import { MockedProvider } from "@apollo/client/testing";
import { renderHook, waitFor } from "@testing-library/react";
import { LogRenderingTypes, LogTypes } from "constants/enums";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import { parsleySettingsMock } from "test_data/parsleySettings";
import * as ErrorReporting from "utils/errorReporting";
import { useSections } from ".";
import * as sectionUtils from "./utils";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider mocks={[parsleySettingsMock]}>{children}</MockedProvider>
);

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
    const { result } = renderHook(
      () => useSections({ logs: ["log line"], ...metadata }),
      { wrapper },
    );
    await waitFor(() => {
      expect(sectionUtils.parseSections).toHaveBeenCalledOnce();
    });
    await waitFor(() => {
      expect(result.current).toStrictEqual({ sectionData: [] });
    });
  });

  it("should not call parsing function when sections are disabled and logs are populated", async () => {
    RenderFakeToastContext();
    const { result } = renderHook(
      () => useSections({ logs: ["log line"], ...metadata }),
      { wrapper },
    );
    await waitFor(() => {
      expect(sectionUtils.parseSections).not.toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(result.current).toStrictEqual({ sectionData: undefined });
    });
  });

  it("should not call parsing function when sections are enabled and logs are empty", async () => {
    RenderFakeToastContext();
    const { result } = renderHook(
      () => useSections({ logs: [], ...metadata }),
      { wrapper },
    );
    await waitFor(() => {
      expect(sectionUtils.parseSections).not.toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(result.current).toStrictEqual({ sectionData: undefined });
    });
  });

  it("parsing function extracts section data", async () => {
    RenderFakeToastContext();
    const logs = [
      "normal log line",
      "Running command 'c1' in function 'f-1'.",
      "Finished command 'c1' in function 'f-1'.",
    ];
    const { result } = renderHook(() => useSections({ logs, ...metadata }), {
      wrapper,
    });
    await waitFor(() => {
      expect(sectionUtils.parseSections).toHaveBeenCalledOnce();
    });
    await waitFor(() => {
      expect(result.current).toStrictEqual({
        sectionData: [{ functionName: "f-1", range: { end: 3, start: 1 } }],
      });
    });
  });

  it("should dispatch a toast and report error when the parsing function throws an error", async () => {
    const { dispatchToast } = RenderFakeToastContext();
    const { result } = renderHook(
      () =>
        useSections({
          logs: ["Finished command 'c1' in function 'f-1'."],
          ...metadata,
        }),
      { wrapper },
    );
    await waitFor(() => {
      expect(sectionUtils.parseSections).toHaveBeenCalledOnce();
    });
    await waitFor(() => {
      expect(result.current).toStrictEqual({ sectionData: undefined });
    });
    await waitFor(() => {
      expect(ErrorReporting.reportError).toHaveBeenCalledWith(
        new Error(
          "Log file is showing a finished section without a running section before it.",
        ),
      );
    });
    await waitFor(() => {
      expect(dispatchToast.error).toHaveBeenCalledWith(
        "An error occurred while parsing log sections.",
      );
    });
  });

  it("parsing function is not called after initial parse", async () => {
    RenderFakeToastContext();
    const logs = ["normal log line"];
    const { rerender } = renderHook((props) => useSections(props), {
      initialProps: { logs, ...metadata },
      wrapper,
    });
    await waitFor(() => {
      expect(sectionUtils.parseSections).toHaveBeenCalledOnce();
    });
    rerender({
      logType: LogTypes.EVERGREEN_TASK_FILE,
      logs,
      renderingType: LogRenderingTypes.Default,
    });
    rerender({ logs, ...metadata });
    await waitFor(() => {
      expect(sectionUtils.parseSections).toHaveBeenCalledOnce();
    });
  });

  const metadata = {
    logType: LogTypes.EVERGREEN_TASK_LOGS,
    renderingType: LogRenderingTypes.Default,
  };
});
