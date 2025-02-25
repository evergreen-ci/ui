import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { RenderFakeToastContext as InitializeFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  act,
  renderWithRouterMatch as render,
  renderComponentWithHook,
  screen,
  stubGetClientRects,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { LogTypes } from "constants/enums";
import { LogContextProvider, useLogContext } from "context/LogContext";
import { parsleySettingsMock } from "test_data/parsleySettings";
import { evergreenTaskMock } from "test_data/task";
import ProjectFiltersModal from ".";

const wrapper = (mocks: MockedResponse[]) => {
  const provider = ({ children }: { children: React.ReactNode }) => (
    <MockedProvider mocks={[parsleySettingsMock, ...mocks]}>
      <LogContextProvider initialLogLines={[]}>{children}</LogContextProvider>
    </MockedProvider>
  );
  return provider;
};

describe("projectFiltersModal", () => {
  beforeAll(() => {
    stubGetClientRects();
    InitializeFakeToastContext();
  });
  it("shows message when no filters are defined in project", () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <ProjectFiltersModal open setOpen={vi.fn()} />,
    );
    render(<Component />, {
      wrapper: wrapper([evergreenTaskMock]),
    });
    act(() => {
      hook.current.setLogMetadata(logMetadata);
    });
    expect(screen.getByDataCy("no-filters-message")).toBeInTheDocument();
  });

  it("lists all of a project's filters", async () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <ProjectFiltersModal open setOpen={vi.fn()} />,
    );
    render(<Component />, {
      wrapper: wrapper([evergreenTaskMock]),
    });
    act(() => {
      hook.current.setLogMetadata(logMetadata);
    });
    await waitForModalLoad();
    expect(screen.queryByText("my_filter_1")).toBeVisible();
    expect(screen.queryByText("my_filter_2")).toBeVisible();
    expect(screen.queryByText("my_filter_3")).toBeVisible();
  });

  it("if a filter is already included in the URL, its checkbox will be checked & disabled", async () => {
    const user = userEvent.setup();
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <ProjectFiltersModal open setOpen={vi.fn()} />,
    );
    render(<Component />, {
      route: "?filters=100my_filter_1",
      wrapper: wrapper([evergreenTaskMock]),
    });
    act(() => {
      hook.current.setLogMetadata(logMetadata);
    });
    await waitForModalLoad();
    await user.hover(screen.getByLabelText("Info With Circle Icon"));
    await waitFor(() => {
      expect(screen.queryByDataCy("project-filter-tooltip")).toBeVisible();
    });
    const checkbox = screen.getAllByRole("checkbox")[0];
    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveAttribute("aria-disabled", "true");
  });

  it("disables submit button when no filters have been selected", async () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <ProjectFiltersModal open setOpen={vi.fn()} />,
    );
    render(<Component />, {
      wrapper: wrapper([evergreenTaskMock]),
    });
    act(() => {
      hook.current.setLogMetadata(logMetadata);
    });
    await waitForModalLoad();
    expect(
      screen.queryByRole("button", { name: "Apply filters" }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("properly applies filters to the URL", async () => {
    const user = userEvent.setup();
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <ProjectFiltersModal open setOpen={vi.fn()} />,
    );
    const { router } = render(<Component />, {
      route: "?filters=100original",
      wrapper: wrapper([evergreenTaskMock]),
    });
    act(() => {
      hook.current.setLogMetadata(logMetadata);
    });
    await waitForModalLoad();
    // LeafyGreen checkbox has pointer-events: none so we click on the labels as a workaround.
    await user.click(screen.getByText("my_filter_2"));
    await user.click(screen.getByText("my_filter_3"));
    expect(
      screen.queryByRole("button", { name: "Apply filters" }),
    ).toHaveAttribute("aria-disabled", "false");
    await user.click(screen.getByRole("button", { name: "Apply filters" }));
    expect(router.state.location.search).toBe(
      "?filters=100original,111my_filter_2,101my_filter_3",
    );
  });
});

const waitForModalLoad = async () => {
  await waitFor(() =>
    expect(screen.queryByDataCy("project-filters-modal")).toBeVisible(),
  );
  await waitFor(() =>
    expect(screen.queryAllByDataCy("project-filter")).toHaveLength(3),
  );
};

const logMetadata = {
  execution: "0",
  logType: LogTypes.EVERGREEN_TASK_LOGS,
  taskID:
    "spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35",
};
