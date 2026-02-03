import {
  ApolloMock,
  RenderFakeToastContext as InitializeFakeToastContext,
  MockedProvider,
  MockedResponse,
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
import {
  ProjectFiltersQuery,
  ProjectFiltersQueryVariables,
} from "gql/generated/types";
import { PROJECT_FILTERS } from "gql/queries";
import { parsleySettingsMock } from "test_data/parsleySettings";
import { noFiltersMock } from "test_data/projectFilters";
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
  it("shows message when no filters are defined in project", async () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <ProjectFiltersModal open setOpen={vi.fn()} />,
    );
    render(<Component />, {
      wrapper: wrapper([noFiltersMock, evergreenTaskMock]),
    });
    act(() => {
      hook.current.setLogMetadata(logMetadata);
    });
    await waitForModalLoad();
    expect(screen.getByDataCy("no-filters-message")).toBeInTheDocument();
  });

  it("lists all of a project's filters", async () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <ProjectFiltersModal open setOpen={vi.fn()} />,
    );
    render(<Component />, {
      wrapper: wrapper([projectFiltersMock, evergreenTaskMock]),
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
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <ProjectFiltersModal open setOpen={vi.fn()} />,
    );

    render(<Component />, {
      route: "?filters=110my_filter_1",
      wrapper: wrapper([projectFiltersMock, evergreenTaskMock]),
    });
    act(() => {
      hook.current.setLogMetadata(logMetadata);
    });
    await waitForModalLoad();
    const checkbox = screen.getAllByRole("checkbox")[1];
    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });
    expect(checkbox).toHaveAttribute("aria-disabled", "true");
  });

  it("disables submit button when no filters have been selected", async () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <ProjectFiltersModal open setOpen={vi.fn()} />,
    );
    render(<Component />, {
      wrapper: wrapper([projectFiltersMock, evergreenTaskMock]),
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
      wrapper: wrapper([projectFiltersMock, evergreenTaskMock]),
    });
    act(() => {
      hook.current.setLogMetadata(logMetadata);
    });
    await waitForModalLoad();

    // LeafyGreen checkbox has pointer-events: none so we click on the labels as a workaround.
    const checkboxes = screen.getAllByRole("checkbox");
    const checkbox2 = checkboxes[2];
    const checkbox3 = checkboxes[3];
    const checkbox2Label = checkbox2.nextElementSibling as HTMLElement;
    const checkbox3Label = checkbox3.nextElementSibling as HTMLElement;
    await user.click(checkbox2Label);
    await user.click(checkbox3Label);

    expect(
      screen.queryByRole("button", { name: "Apply filters" }),
    ).toHaveAttribute("aria-disabled", "false");
    await user.click(screen.getByRole("button", { name: "Apply filters" }));
    expect(router.state.location.search).toBe(
      "?filters=100original,111my_filter_2,101my_filter_3",
    );
  });

  it("should allow clicking on the filter name to check the checkbox", async () => {
    const user = userEvent.setup();
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <ProjectFiltersModal open setOpen={vi.fn()} />,
    );
    render(<Component />, {
      wrapper: wrapper([projectFiltersMock, evergreenTaskMock]),
    });
    act(() => {
      hook.current.setLogMetadata(logMetadata);
    });
    await waitForModalLoad();
    await user.click(screen.getByText("my_filter_2"));
    const checkboxes = screen.getAllByRole("checkbox");
    const checkbox2 = checkboxes[2];
    await waitFor(() => {
      expect(checkbox2).toBeChecked();
    });
  });
});

const waitForModalLoad = async () => {
  await waitFor(() =>
    expect(screen.queryByDataCy("project-filters-modal")).toBeVisible(),
  );
  await waitFor(() =>
    expect(
      screen.queryByDataCy("table-loader-loading-row"),
    ).not.toBeInTheDocument(),
  );
};

const logMetadata = {
  execution: "0",
  logType: LogTypes.EVERGREEN_TASK_LOGS,
  taskID:
    "spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35",
};

const projectFiltersMock: ApolloMock<
  ProjectFiltersQuery,
  ProjectFiltersQueryVariables
> = {
  request: {
    query: PROJECT_FILTERS,
    variables: {
      projectId: "spruce",
    },
  },
  result: {
    data: {
      project: {
        __typename: "Project",
        id: "spruce",
        parsleyFilters: [
          {
            __typename: "ParsleyFilter",
            caseSensitive: true,
            description: "",
            exactMatch: true,
            expression: "my_filter_1",
          },
          {
            __typename: "ParsleyFilter",
            caseSensitive: true,
            description: "Filter Two",
            exactMatch: false,
            expression: "my_filter_2",
          },
          {
            __typename: "ParsleyFilter",
            caseSensitive: false,
            description: "",
            exactMatch: false,
            expression: "my_filter_3",
          },
        ],
      },
    },
  },
};
