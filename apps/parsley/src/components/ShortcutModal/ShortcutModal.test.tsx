import { useState } from "react";
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
import { LogTypes } from "constants/enums";
import { LogContextProvider, useLogContext } from "context/LogContext";
import ShortcutModal from ".";

const ModalWrapper = () => {
  const [open, setOpen] = useState(false);
  return <ShortcutModal open={open} setOpen={setOpen} />;
};

const wrapper = () => {
  const renderContent = ({ children }: React.PropsWithChildren) => (
    <MockedProvider mocks={[]}>
      <LogContextProvider initialLogLines={[]}>{children}</LogContextProvider>
    </MockedProvider>
  );
  return renderContent;
};

describe("shortcutModal", () => {
  it("should toggle open when user executes keyboard shortcut", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(<ModalWrapper />);
    render(<Component />, {
      route: "/",
      wrapper: wrapper(),
    });
    expect(screen.getByDataCy("shortcut-modal")).not.toBeVisible();

    await user.keyboard("{Shift>}{?}{/Shift}");
    await waitFor(() => {
      expect(screen.getByDataCy("shortcut-modal")).toBeVisible();
    });
  });

  it("should close when the user clicks outside of the modal", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(<ModalWrapper />);
    render(<Component />, {
      route: "/",
      wrapper: wrapper(),
    });
    expect(screen.getByDataCy("shortcut-modal")).not.toBeVisible();

    await user.keyboard("{Shift>}{?}{/Shift}");
    await waitFor(() => {
      expect(screen.getByDataCy("shortcut-modal")).toBeVisible();
    });

    await user.click(document.body as HTMLElement);
    await waitFor(() => {
      expect(screen.getByDataCy("shortcut-modal")).not.toBeVisible();
    });
  });

  it("should show Parsley AI shortcut for non-uploaded logs", async () => {
    const user = userEvent.setup();
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <ModalWrapper />,
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

    await user.keyboard("{Shift>}{?}{/Shift}");
    await waitFor(() => {
      expect(screen.getByDataCy("shortcut-modal")).toBeVisible();
    });

    expect(
      screen.getByText("Toggle the Parsley AI chat window"),
    ).toBeInTheDocument();
  });

  it("should hide Parsley AI shortcut for uploaded logs", async () => {
    const user = userEvent.setup();
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <ModalWrapper />,
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

    await user.keyboard("{Shift>}{?}{/Shift}");
    await waitFor(() => {
      expect(screen.getByDataCy("shortcut-modal")).toBeVisible();
    });

    expect(
      screen.queryByText("Toggle the Parsley AI chat window"),
    ).not.toBeInTheDocument();
  });
});
