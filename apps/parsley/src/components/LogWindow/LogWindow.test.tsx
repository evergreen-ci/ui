import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  act,
  renderWithRouterMatch as render,
  renderComponentWithHook,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ChatProvider } from "components/Chatbot";
import { LogTypes } from "constants/enums";
import { LogContextProvider, useLogContext } from "context/LogContext";
import LogWindow from ".";

const wrapper = () => {
  const renderContent = ({ children }: React.PropsWithChildren) => (
    <MockedProvider mocks={[]}>
      <LogContextProvider initialLogLines={["line 1", "line 2"]}>
        <ChatProvider>{children}</ChatProvider>
      </LogContextProvider>
    </MockedProvider>
  );
  return renderContent;
};

describe("LogWindow keyboard shortcuts", () => {
  beforeAll(() => {
    // Mock scrollTo which is used by the chat drawer
    HTMLDivElement.prototype.scrollTo = vi.fn();
  });

  it("should toggle chat drawer when ] key is pressed", async () => {
    const user = userEvent.setup();
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <LogWindow />,
    );
    const { Component: WrappedComponent } = RenderFakeToastContext(
      <Component />,
    );
    render(<WrappedComponent />, {
      route: "/",
      wrapper: wrapper(),
    });

    act(() => {
      hook.current.setLogMetadata({
        execution: "0",
        logType: LogTypes.EVERGREEN_TASK_LOGS,
        taskID: "test_task_id",
      });
    });

    // Chat drawer should be closed initially
    await waitFor(() => {
      expect(screen.getByDataCy("chat-drawer")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
    });

    // Press ] to open
    await user.keyboard("{]}");

    await waitFor(() => {
      expect(screen.getByDataCy("chat-drawer")).toHaveAttribute(
        "aria-hidden",
        "false",
      );
    });

    // Press ] again to close
    await user.keyboard("{]}");

    await waitFor(() => {
      expect(screen.getByDataCy("chat-drawer")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
    });
  });

  it("should not toggle chat when ] pressed on uploaded log", async () => {
    const user = userEvent.setup();
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <LogWindow />,
    );
    const { Component: WrappedComponent } = RenderFakeToastContext(
      <Component />,
    );
    render(<WrappedComponent />, {
      route: "/",
      wrapper: wrapper(),
    });

    act(() => {
      hook.current.setLogMetadata({
        execution: "0",
        logType: LogTypes.LOCAL_UPLOAD,
        taskID: undefined,
      });
    });

    // Chat drawer should be closed initially
    await waitFor(() => {
      expect(screen.getByDataCy("chat-drawer")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
    });

    // Press ] - should NOT open for uploaded logs
    await user.keyboard("{]}");

    // Give it time to potentially open (it shouldn't)
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    // Drawer should still be closed
    expect(screen.getByDataCy("chat-drawer")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
