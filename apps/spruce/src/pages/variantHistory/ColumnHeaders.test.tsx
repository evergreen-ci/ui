import {
  ApolloMock,
  RenderFakeToastContext,
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { trimStringFromMiddle } from "@evg-ui/lib/utils";
import { ProviderWrapper } from "components/HistoryTable/hooks/test-utils";
import {
  TaskNamesForBuildVariantQuery,
  TaskNamesForBuildVariantQueryVariables,
} from "gql/generated/types";
import { TASK_NAMES_FOR_BUILD_VARIANT } from "gql/queries";
import ColumnHeaders from "./ColumnHeaders";
import { variantHistoryMaxLength as maxLength } from "./constants";

const longTaskName = "really_really_really_really_really_really_long_task_name";
const trimmedTaskName = trimStringFromMiddle(longTaskName, maxLength);

describe("columnHeaders (Variant History)", () => {
  it("renders an initial skeleton for the 7 column headers when loading", () => {
    const { Component } = RenderFakeToastContext(
      <ColumnHeaders
        projectIdentifier="evergreen"
        variantName="some_variant"
      />,
    );
    render(<Component />, {
      wrapper: ProviderWrapper,
    });
    expect(screen.queryAllByDataCy("loading-header-cell")).toHaveLength(7);
  });

  it("renders the column headers properly when not loading", async () => {
    const { Component } = RenderFakeToastContext(
      <ColumnHeaders
        projectIdentifier="evergreen"
        variantName="some_variant"
      />,
    );
    render(<Component />, {
      wrapper: ({ children }) =>
        ProviderWrapper({
          children,
          state: {
            visibleColumns: ["task1", "task2", "task3"],
          },
          mocks: [mock(["task1", "task2", "task3"])],
        }),
    });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("loading-header-cell")).toHaveLength(0);
    });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("header-cell")).toHaveLength(3);
    });
  });

  it("should not show more column headers then the columnLimit", async () => {
    const { Component } = RenderFakeToastContext(
      <ColumnHeaders
        projectIdentifier="evergreen"
        variantName="some_variant"
      />,
    );
    render(<Component />, {
      wrapper: ({ children }) =>
        ProviderWrapper({
          children,
          state: {
            visibleColumns: ["task1", "task2", "task3", "task4", "task5"],
            columnLimit: 3,
          },
          mocks: [mock(["task1", "task2", "task3", "task4", "task5"])],
        }),
    });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("loading-header-cell")).toHaveLength(0);
    });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("header-cell")).toHaveLength(3);
    });
  });

  it("should truncate the task name only if it is too long", async () => {
    const { Component } = RenderFakeToastContext(
      <ColumnHeaders
        projectIdentifier="evergreen"
        variantName="some_variant"
      />,
    );
    render(<Component />, {
      wrapper: ({ children }) =>
        ProviderWrapper({
          children,
          state: {
            visibleColumns: [longTaskName, "task2"],
          },
          mocks: [mock([longTaskName, "task2"])],
        }),
    });

    await waitFor(() => {
      expect(screen.queryAllByDataCy("loading-header-cell")).toHaveLength(0);
    });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("header-cell")).toHaveLength(2);
    });
    expect(screen.queryByText(longTaskName)).toBeNull();
    expect(screen.queryByText("task2")).toBeVisible();
  });

  it("should show a tooltip with the full name when hovering over a truncated task name", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <ColumnHeaders
        projectIdentifier="evergreen"
        variantName="some_variant"
      />,
    );
    render(<Component />, {
      wrapper: ({ children }) =>
        ProviderWrapper({
          children,
          state: {
            visibleColumns: [longTaskName],
          },
          mocks: [mock([longTaskName])],
        }),
    });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("loading-header-cell")).toHaveLength(0);
    });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("header-cell")).toHaveLength(1);
    });

    expect(screen.queryByText(trimmedTaskName)).toBeVisible();
    await user.hover(screen.getByText(trimmedTaskName));
    await screen.findByText(longTaskName);
  });
});

const mock = (
  taskNames: TaskNamesForBuildVariantQuery["taskNamesForBuildVariant"],
): ApolloMock<
  TaskNamesForBuildVariantQuery,
  TaskNamesForBuildVariantQueryVariables
> => ({
  request: {
    query: TASK_NAMES_FOR_BUILD_VARIANT,
    variables: {
      projectIdentifier: "evergreen",
      buildVariant: "some_variant",
    },
  },
  result: {
    data: {
      taskNamesForBuildVariant: taskNames,
    },
  },
});
