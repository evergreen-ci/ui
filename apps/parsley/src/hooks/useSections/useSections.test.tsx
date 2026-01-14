import { act, renderHook, waitFor } from "@testing-library/react";
import { RenderFakeToastContext as InitializeFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import { MockedProvider } from "@evg-ui/lib/test_utils";
import * as ErrorReporting from "@evg-ui/lib/utils/errorReporting";
import { LogRenderingTypes, LogTypes } from "constants/enums";
import {
  parsleySettingsMock,
  parsleySettingsMockSectionsDisabled,
} from "test_data/parsleySettings";
import { sectionData, sectionStateAllClosed } from "./testData";
import * as sectionUtils from "./utils";
import { useSections } from ".";

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
    InitializeFakeToastContext();
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
    InitializeFakeToastContext();
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
    InitializeFakeToastContext();
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
    InitializeFakeToastContext();
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
            commandDescription: undefined,
            commandID: "command-1",
            commandName: "c1",
            functionID: "function-1",
            isTopLevelCommand: false,
            range: {
              end: 3,
              start: 1,
            },
            step: "1 of 4",
          },
        ],
        functions: [
          {
            containsTopLevelCommand: false,
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
    const { dispatchToast } = InitializeFakeToastContext();
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
    InitializeFakeToastContext();
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
      onInitOpenSectionsContainingLines: undefined,
      renderingType: LogRenderingTypes.Default,
    });
    rerender({ logs, ...metadata });
    await waitFor(() => {
      expect(sectionUtils.parseSections).toHaveBeenCalledOnce();
    });
  });

  describe("opening and closing sections", () => {
    it("toggleFunctionSection function toggles the open state", async () => {
      InitializeFakeToastContext();
      const { result } = renderHook(() => useSections({ logs, ...metadata }), {
        wrapper,
      });
      await waitFor(() => {
        expect(result.current.sectionData).toStrictEqual(sectionData);
      });
      await waitFor(() => {
        expect(result.current.sectionState).toStrictEqual(
          sectionStateAllClosed,
        );
      });
      act(() => {
        result.current.toggleFunctionSection({
          functionID: "function-1",
          isOpen: true,
        });
      });
      await waitFor(() => {
        expect(result.current.sectionState).toStrictEqual({
          ...sectionStateAllClosed,
          "function-1": {
            ...sectionStateAllClosed["function-1"],
            isOpen: true,
          },
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
          ...sectionStateAllClosed,
          "function-1": {
            ...sectionStateAllClosed["function-1"],
            isOpen: true,
          },
          "function-9": {
            ...sectionStateAllClosed["function-9"],
            isOpen: true,
          },
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
          ...sectionStateAllClosed,
          "function-9": {
            ...sectionStateAllClosed["function-9"],
            isOpen: true,
          },
        });
      });
    });
    it("toggleFunctionSection will open the command if the function contains only one command", async () => {
      InitializeFakeToastContext();
      const { result } = renderHook(
        () => useSections({ logs: logsWithOneCommand, ...metadata }),
        {
          wrapper,
        },
      );
      await waitFor(() => {
        expect(result.current.sectionData).toStrictEqual(
          sectionDataForLogsWithOneCommand,
        );
      });
      await waitFor(() => {
        expect(result.current.sectionState).toStrictEqual({
          "function-1": {
            commands: {
              "command-1": { isOpen: false },
            },
            isOpen: false,
          },
        });
      });
      act(() => {
        result.current.toggleFunctionSection({
          functionID: "function-1",
          isOpen: true,
        });
      });
      expect(result.current.sectionState).toStrictEqual({
        "function-1": {
          commands: {
            "command-1": { isOpen: true },
          },
          isOpen: true,
        },
      });
    });
  });

  it("toggleCommandSection toggles the open state", async () => {
    InitializeFakeToastContext();
    const { result } = renderHook(() => useSections({ logs, ...metadata }), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.sectionData).toStrictEqual(sectionData);
    });
    await waitFor(() => {
      expect(result.current.sectionState).toStrictEqual(sectionStateAllClosed);
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
        ...sectionStateAllClosed,
        "function-9": {
          commands: {
            ...sectionStateAllClosed["function-9"].commands,
            "command-9": { isOpen: true },
          },
          isOpen: false,
        },
      });
    });
  });

  it("should open the section containing 'onInitOpenSectionsContainingLines' during initialization only", async () => {
    InitializeFakeToastContext();
    const { rerender, result } = renderHook((args) => useSections(args), {
      initialProps: {
        logType: LogTypes.EVERGREEN_TASK_LOGS,
        logs,
        onInitOpenSectionsContainingLines: [10],
        renderingType: LogRenderingTypes.Default,
      },
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.sectionData).toStrictEqual(sectionData);
    });
    const sectionState = {
      ...sectionStateAllClosed,
      "function-9": {
        commands: {
          "command-9": { isOpen: true },
          "command-12": { isOpen: false },
        },
        isOpen: true,
      },
    };
    await waitFor(() => {
      expect(result.current.sectionState).toStrictEqual(sectionState);
    });
    rerender({
      logType: LogTypes.EVERGREEN_TASK_LOGS,
      logs,
      onInitOpenSectionsContainingLines: [1, 2],
      renderingType: LogRenderingTypes.Default,
    });
    await waitFor(() => {
      expect(result.current.sectionState).toStrictEqual(sectionState);
    });
  });

  it("toggleAllCommandsInFunction toggles the open state of all commands in a function. When isOpen is true, the function is toggle open.", async () => {
    InitializeFakeToastContext();
    const { result } = renderHook(() => useSections({ logs, ...metadata }), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.sectionData).toStrictEqual(sectionData);
    });
    await waitFor(() => {
      expect(result.current.sectionState).toStrictEqual(sectionStateAllClosed);
    });
    act(() => {
      result.current.toggleAllCommandsInFunction("function-1", true);
    });
    await waitFor(() => {
      expect(result.current.sectionState).toStrictEqual({
        ...sectionStateAllClosed,
        "function-1": {
          commands: {
            "command-1": { isOpen: true },
            "command-6": { isOpen: true },
          },
          isOpen: true,
        },
      });
    });
    act(() => {
      result.current.toggleAllCommandsInFunction("function-1", false);
    });
    await waitFor(() => {
      expect(result.current.sectionState).toStrictEqual({
        ...sectionStateAllClosed,
        "function-1": {
          commands: {
            "command-1": { isOpen: false },
            "command-6": { isOpen: false },
          },
          isOpen: true,
        },
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

  const logsWithOneCommand = [
    "normal log line",
    "Running command 'c1' in function 'f-1' (step 1 of 1).",
    "normal log line",
    "normal log line",
    "normal log line",
    "Finished command 'c1' in function 'f-1' (step 1 of 1).",
    "normal log line",
  ];

  const sectionDataForLogsWithOneCommand: sectionUtils.SectionData = {
    commands: [
      {
        commandDescription: undefined,
        commandID: "command-1",
        commandName: "c1",
        functionID: "function-1",
        isTopLevelCommand: false,
        range: {
          end: 6,
          start: 1,
        },
        step: "1 of 1",
      },
    ],
    functions: [
      {
        containsTopLevelCommand: false,
        functionID: "function-1",
        functionName: "f-1",
        range: {
          end: 6,
          start: 1,
        },
      },
    ],
  };
  const metadata = {
    logType: LogTypes.EVERGREEN_TASK_LOGS,
    onInitOpenSectionsContainingLines: undefined,
    renderingType: LogRenderingTypes.Default,
  };
});
