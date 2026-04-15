import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  act,
  renderComponentWithHook,
  renderWithRouterMatch,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { LogTypes } from "constants/enums";
import { COPY_FORMAT } from "constants/storageKeys";
import { LogContextProvider, useLogContext } from "context/LogContext";
import {
  MultiLineSelectContextProvider,
  useMultiLineSelectContext,
} from "context/MultiLineSelectContext";
import { parsleySettingsMock } from "test_data/parsleySettings";
import SharingMenu from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider mocks={[parsleySettingsMock]}>
    <LogContextProvider initialLogLines={logs}>
      <MultiLineSelectContextProvider>
        {children}
      </MultiLineSelectContextProvider>
    </LogContextProvider>
  </MockedProvider>
);

const logs = [
  "line 1",
  "line 2",
  "line 3",
  "line 4",
  "line 5",
  "line 6",
  "line 7",
];

/**
 * `renderSharingMenu` renders the sharing menu with the default open prop
 * @returns - hook and utils
 */
const renderSharingMenu = () => {
  const { Component: MenuComponent, hook } = renderComponentWithHook(
    useMultiLineSelectContext,
    <SharingMenu />,
  );
  const { Component } = RenderFakeToastContext(<MenuComponent />);
  const utils = renderWithRouterMatch(<Component />, { wrapper });
  return {
    hook,
    utils,
  };
};

describe("sharingMenu", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should render an open menu after setting it to open", async () => {
    const { hook } = renderSharingMenu();
    expect(screen.queryByText("Copy link to lines")).toBeNull();
    act(() => {
      hook.current.setOpenMenu(true);
    });
    expect(screen.getByText("Copy link to line")).toBeInTheDocument();
    expect(screen.getByText("Only search on range")).toBeInTheDocument();
  });
  it("should render an open menu after selecting a start and end line", async () => {
    const { hook } = renderSharingMenu();
    expect(screen.queryByText("Copy link to lines")).toBeNull();
    act(() => {
      hook.current.handleSelectLine(1, false);
    });
    expect(screen.queryByText("Copy link to lines")).toBeNull();
    act(() => {
      hook.current.handleSelectLine(3, true);
    });
    expect(screen.getByText("Copy link to lines")).toBeInTheDocument();
    expect(screen.getByText("Only search on range")).toBeInTheDocument();
  });
  it("clicking `copy selected contents` should copy the line range to the clipboard in Jira format by default", async () => {
    const user = userEvent.setup({ writeToClipboard: true });

    const { hook } = renderSharingMenu();
    act(() => {
      hook.current.handleSelectLine(1, false);
    });
    act(() => {
      hook.current.handleSelectLine(3, true);
    });
    expect(screen.getByText("Copy selected contents")).toBeInTheDocument();
    await user.click(screen.getByText("Copy selected contents"));
    const clipboardText = await navigator.clipboard.readText();
    expect(clipboardText).toBe(
      "{noformat}\nline 2\nline 3\nline 4\n{noformat}",
    );
  });
  it("clicking `copy selected contents` should copy a single selected line to the clipboard in Jira format by default", async () => {
    const user = userEvent.setup({ writeToClipboard: true });

    const { hook } = renderSharingMenu();
    act(() => {
      hook.current.setOpenMenu(true);
      hook.current.handleSelectLine(1, false);
    });

    expect(screen.getByText("Copy selected contents")).toBeInTheDocument();
    await user.click(screen.getByText("Copy selected contents"));
    const clipboardText = await navigator.clipboard.readText();
    expect(clipboardText).toBe("{noformat}\nline 2\n{noformat}");
  });
  it("clicking `copy selected contents` should copy the line range to the clipboard in raw format when localStorage is set to raw", async () => {
    const user = userEvent.setup({ writeToClipboard: true });
    localStorage.setItem(COPY_FORMAT, "raw");

    const { hook } = renderSharingMenu();
    act(() => {
      hook.current.handleSelectLine(1, false);
    });
    act(() => {
      hook.current.handleSelectLine(3, true);
    });
    expect(screen.getByText("Copy selected contents")).toBeInTheDocument();
    await user.click(screen.getByText("Copy selected contents"));
    const clipboardText = await navigator.clipboard.readText();
    expect(clipboardText).toBe("line 2\nline 3\nline 4\n");
  });
  it("clicking `copy selected contents` should copy a single selected line to the clipboard in raw format when localStorage is set to raw", async () => {
    const user = userEvent.setup({ writeToClipboard: true });
    localStorage.setItem(COPY_FORMAT, "raw");

    const { hook } = renderSharingMenu();
    act(() => {
      hook.current.setOpenMenu(true);
      hook.current.handleSelectLine(1, false);
    });

    expect(screen.getByText("Copy selected contents")).toBeInTheDocument();
    await user.click(screen.getByText("Copy selected contents"));
    const clipboardText = await navigator.clipboard.readText();
    expect(clipboardText).toBe("line 2\n");
  });
  it("clicking `copy link to lines` should omit legacy shareLine from copied URL", async () => {
    const user = userEvent.setup({ writeToClipboard: true });

    const { Component: MenuComponent, hook } = renderComponentWithHook(
      useMultiLineSelectContext,
      <SharingMenu />,
    );
    const { Component } = RenderFakeToastContext(<MenuComponent />);
    renderWithRouterMatch(<Component />, {
      route: "?shareLine=5",
      wrapper,
    });
    act(() => {
      hook.current.handleSelectLine(1, false);
    });
    act(() => {
      hook.current.handleSelectLine(3, true);
    });
    await user.click(screen.getByText("Copy link to lines"));
    const clipboardText = await navigator.clipboard.readText();
    expect(clipboardText).toBe(
      "http://localhost:3000/?selectedLineRange=L1-L3",
    );
  });
  it("clicking `copy link to lines` should copy the link to the clipboard", async () => {
    const user = userEvent.setup({ writeToClipboard: true });

    const { hook } = renderSharingMenu();
    act(() => {
      hook.current.handleSelectLine(1, false);
    });
    act(() => {
      hook.current.handleSelectLine(3, true);
    });
    expect(screen.getByText("Copy link to lines")).toBeInTheDocument();
    await user.click(screen.getByText("Copy link to lines"));
    const clipboardText = await navigator.clipboard.readText();
    expect(clipboardText).toBe(
      "http://localhost:3000/?selectedLineRange=L1-L3",
    );
  });
  it("clicking `only search on range` should update the url with the range", async () => {
    const user = userEvent.setup();
    const { hook, utils } = renderSharingMenu();
    const { router } = utils;
    act(() => {
      hook.current.handleSelectLine(1, false);
    });
    act(() => {
      hook.current.handleSelectLine(3, true);
    });
    expect(screen.getByText("Only search on range")).toBeInTheDocument();
    await user.click(screen.getByText("Only search on range"));
    expect(router.state.location.search).toBe(
      "?lower=1&selectedLineRange=L1-L3&upper=3",
    );
  });
  it("clicking `clear selection` should clear the selected line range", () => {
    const { hook } = renderSharingMenu();
    act(() => {
      hook.current.handleSelectLine(1, false);
    });
    act(() => {
      hook.current.handleSelectLine(3, true);
    });
    expect(screen.getByText("Clear selection")).toBeInTheDocument();
    act(() => {
      hook.current.clearSelection();
    });
    expect(hook.current.selectedLines).toStrictEqual({
      endingLine: undefined,
      startingLine: undefined,
    });
  });
  it("should not show a share link button if this is a locally uploaded log", () => {
    const useSpecialHook = () => {
      const useLogContextHook = useLogContext();
      const useMultiLineSelectContextHook = useMultiLineSelectContext();
      return {
        useLogContextHook,
        useMultiLineSelectContextHook,
      };
    };
    const { Component: MenuComponent, hook } = renderComponentWithHook(
      useSpecialHook,
      <SharingMenu />,
    );
    const { Component } = RenderFakeToastContext(<MenuComponent />);
    renderWithRouterMatch(<Component />, {
      route: "?selectedLineRange=L1-L3",
      wrapper,
    });
    act(() => {
      hook.current.useLogContextHook.setLogMetadata({
        logType: LogTypes.LOCAL_UPLOAD,
      });
    });
    expect(screen.queryByText("Copy link to lines")).toBeNull();
  });
  it("should not show 'Add to Parsley AI' if this is a locally uploaded log", () => {
    const useSpecialHook = () => {
      const useLogContextHook = useLogContext();
      const useMultiLineSelectContextHook = useMultiLineSelectContext();
      return {
        useLogContextHook,
        useMultiLineSelectContextHook,
      };
    };
    const { Component: MenuComponent, hook } = renderComponentWithHook(
      useSpecialHook,
      <SharingMenu />,
    );
    const { Component } = RenderFakeToastContext(<MenuComponent />);
    renderWithRouterMatch(<Component />, {
      route: "?selectedLineRange=L1-L3",
      wrapper,
    });
    act(() => {
      hook.current.useMultiLineSelectContextHook.setOpenMenu(true);
      hook.current.useLogContextHook.setLogMetadata({
        logType: LogTypes.LOCAL_UPLOAD,
      });
    });
    expect(screen.queryByText("Add to Parsley AI")).toBeNull();
  });
  it("should show 'Add to Parsley AI' for non-uploaded logs", () => {
    const { hook } = renderSharingMenu();
    act(() => {
      hook.current.setOpenMenu(true);
    });
    expect(screen.getByText("Add to Parsley AI")).toBeInTheDocument();
  });

  it("clicking `copy link to line` should copy the link with selectedLineRange param", async () => {
    const user = userEvent.setup({ writeToClipboard: true });

    const { hook } = renderSharingMenu();
    act(() => {
      hook.current.handleSelectLine(1, false);
      hook.current.setOpenMenu(true);
    });
    expect(screen.getByText("Copy link to line")).toBeInTheDocument();
    await user.click(screen.getByText("Copy link to line"));
    const clipboardText = await navigator.clipboard.readText();
    expect(clipboardText).toBe("http://localhost:3000/?selectedLineRange=L1");
  });
});
