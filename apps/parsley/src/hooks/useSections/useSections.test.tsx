import { MockedProvider } from "@apollo/client/testing";
import { act, renderHook, waitFor } from "@testing-library/react";
import { LogRenderingTypes, LogTypes } from "constants/enums";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  parsleySettingsMock,
  parsleySettingsMockSectionsDisabled,
} from "test_data/parsleySettings";
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
      expect(result.current.sectionData).toStrictEqual({
        commands: [],
        functions: [],
      });
    });
  });

  it("should not call parsing function when sections are disabled and logs are populated", async () => {
    RenderFakeToastContext();
    const { result } = renderHook(
      () => useSections({ logs: ["log line"], ...metadata }),
      {
        wrapper: ({ children }) => (
          <MockedProvider mocks={[parsleySettingsMockSectionsDisabled]}>
            {children}
          </MockedProvider>
        ),
      },
    );
    await waitFor(() => {
      expect(sectionUtils.parseSections).not.toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(result.current.sectionData).toStrictEqual(undefined);
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
      expect(result.current.sectionData).toStrictEqual(undefined);
    });
  });

  it("parsing function extracts section data", async () => {
    RenderFakeToastContext();
    const logs = [
      "normal log line",
      "Running command 'c1' in function 'f-1' (step 1 of 4).",
      "Finished command 'c1' in function 'f-1' (step 1 of 4).",
    ];
    const { result } = renderHook(() => useSections({ logs, ...metadata }), {
      wrapper,
    });
    await waitFor(() => {
      expect(sectionUtils.parseSections).toHaveBeenCalledOnce();
    });
    await waitFor(() => {
      expect(result.current.sectionData).toStrictEqual({
        commands: [
          {
            commandID: "command-1",
            commandName: "c1",
            functionID: "function-1",
            range: {
              end: 3,
              start: 1,
            },
            step: "1 of 4",
          },
        ],
        functions: [
          {
            functionID: "function-1",
            functionName: "f-1",
            range: {
              end: 3,
              start: 1,
            },
          },
        ],
      });
    });
  });

  it("should dispatch a toast and report error when the parsing function throws an error", async () => {
    const { dispatchToast } = RenderFakeToastContext();
    const { result } = renderHook(
      () =>
        useSections({
          logs: ["Finished command 'c1' in function 'f-1' (step 1 of 4)."],
          ...metadata,
        }),
      { wrapper },
    );
    await waitFor(() => {
      expect(sectionUtils.parseSections).toHaveBeenCalledOnce();
    });
    await waitFor(() => {
      expect(result.current.sectionData).toStrictEqual(undefined);
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

  describe("opening and closing sections", () => {
    it("toggleFunctionSection function toggles the open state", async () => {
      RenderFakeToastContext();
      const { result } = renderHook(() => useSections({ logs, ...metadata }), {
        wrapper,
      });
      await waitFor(() => {
        expect(result.current.sectionData).toStrictEqual(sectionData);
      });
      await waitFor(() => {
        expect(result.current.sectionState).toStrictEqual(initialSectionState);
      });
      act(() => {
        result.current.toggleFunctionSection({
          functionID: "function-1",
          isOpen: true,
        });
      });
      await waitFor(() => {
        expect(result.current.sectionState).toStrictEqual({
          ...initialSectionState,
          "function-1": { ...initialSectionState["function-1"], isOpen: true },
        });
      });
      act(() => {
        result.current.toggleFunctionSection({
          functionID: "function-9",
          isOpen: true,
        });
      });
      await waitFor(() => {
        expect(result.current.sectionState).toStrictEqual({
          ...initialSectionState,
          "function-1": { ...initialSectionState["function-1"], isOpen: true },
          "function-9": { ...initialSectionState["function-9"], isOpen: true },
        });
      });
      act(() => {
        result.current.toggleFunctionSection({
          functionID: "function-1",
          isOpen: false,
        });
      });
      await waitFor(() => {
        expect(result.current.sectionState).toStrictEqual({
          ...initialSectionState,
          "function-9": { ...initialSectionState["function-9"], isOpen: true },
        });
      });
    });

    it("toggleCommandSection toggles the open state", async () => {
      RenderFakeToastContext();
      const { result } = renderHook(() => useSections({ logs, ...metadata }), {
        wrapper,
      });
      await waitFor(() => {
        expect(result.current.sectionData).toStrictEqual(sectionData);
      });
      await waitFor(() => {
        expect(result.current.sectionState).toStrictEqual(initialSectionState);
      });
      act(() => {
        result.current.toggleCommandSection({
          commandID: "command-9",
          functionID: "function-9",
          isOpen: true,
        });
      });
      await waitFor(() => {
        expect(result.current.sectionState).toStrictEqual({
          ...initialSectionState,
          "function-9": {
            commands: {
              ...initialSectionState["function-9"].commands,
              "command-9": { isOpen: true },
            },
            isOpen: false,
          },
        });
      });
    });
  });

  const logs = [
    "normal log line",
    "Running command 'c1' in function 'f-1' (step 1 of 4).",
    "normal log line",
    "normal log line",
    "normal log line",
    "Finished command 'c1' in function 'f-1' (step 1 of 4).",
    "Running command 'c2' in function 'f-1' (step 1 of 4).",
    "Finished command 'c2' in function 'f-1' (step 1 of 4).",
    "normal log line",
    "Running command 'c3' in function 'f-2' (step 1 of 4).",
    "normal log line",
    "Finished command 'c3' in function 'f-2' (step 1 of 4).",
    "Running command 'c4' in function 'f-2' (step 1 of 4).",
    "Finished command 'c4' in function 'f-2' (step 1 of 4).",
    "normal log line",
    "normal log line",
    "normal log line",
  ];
  const step = "1 of 4";
  const sectionData: sectionUtils.SectionData = {
    commands: [
      {
        commandID: "command-1",
        commandName: "c1",
        functionID: "function-1",
        range: {
          end: 6,
          start: 1,
        },
        step,
      },
      {
        commandID: "command-6",
        commandName: "c2",
        functionID: "function-1",
        range: {
          end: 8,
          start: 6,
        },
        step,
      },
      {
        commandID: "command-9",
        commandName: "c3",
        functionID: "function-9",
        range: {
          end: 12,
          start: 9,
        },
        step,
      },
      {
        commandID: "command-12",
        commandName: "c4",
        functionID: "function-9",
        range: {
          end: 14,
          start: 12,
        },
        step,
      },
    ],
    functions: [
      {
        functionID: "function-1",
        functionName: "f-1",
        range: {
          end: 8,
          start: 1,
        },
      },
      {
        functionID: "function-9",
        functionName: "f-2",
        range: {
          end: 14,
          start: 9,
        },
      },
    ],
  };
  const initialSectionState = {
    "function-1": {
      commands: {
        "command-1": {
          isOpen: false,
        },
        "command-6": {
          isOpen: false,
        },
      },
      isOpen: false,
    },
    "function-9": {
      commands: {
        "command-9": {
          isOpen: false,
        },
        "command-12": {
          isOpen: false,
        },
      },
      isOpen: false,
    },
  };
  const metadata = {
    logType: LogTypes.EVERGREEN_TASK_LOGS,
    renderingType: LogRenderingTypes.Default,
  };
});
