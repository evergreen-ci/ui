import {
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  TaskNamesForBuildVariantQuery,
  TaskNamesForBuildVariantQueryVariables,
} from "gql/generated/types";
import { TASK_NAMES_FOR_BUILD_VARIANT } from "gql/queries";
import TaskSelector from "./TaskSelector";

const taskNamesMock: ApolloMock<
  TaskNamesForBuildVariantQuery,
  TaskNamesForBuildVariantQueryVariables
> = {
  request: {
    query: TASK_NAMES_FOR_BUILD_VARIANT,
    variables: {
      projectIdentifier: "evergreen",
      buildVariant: "lint",
    },
  },
  result: {
    data: {
      taskNamesForBuildVariant: ["lint-agent", "lint-service"],
    },
  },
};

describe("taskSelector", () => {
  it("summarizes tasks from the url in the field instead of rendering chips", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider mocks={[taskNamesMock]}>
        <TaskSelector buildVariant="lint" projectIdentifier="evergreen" />
      </MockedProvider>,
      {
        route: "/variant-history/evergreen/lint?visibleColumns=lint-agent",
        path: "/variant-history/:projectId/:variantName",
      },
    );

    const input = await screen.findByPlaceholderText("1 item selected");
    expect(screen.queryByText("lint-agent")).not.toBeInTheDocument();

    await user.click(input);

    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: "lint-agent" }),
      ).toHaveAttribute("aria-selected", "true");
    });
    expect(
      screen.getByRole("option", { name: "lint-service" }),
    ).toHaveAttribute("aria-selected", "false");
  });

  it("writes the selected tasks to the url", async () => {
    const user = userEvent.setup();
    const { router } = render(
      <MockedProvider mocks={[taskNamesMock]}>
        <TaskSelector buildVariant="lint" projectIdentifier="evergreen" />
      </MockedProvider>,
      {
        route: "/variant-history/evergreen/lint",
        path: "/variant-history/:projectId/:variantName",
      },
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Select tasks")).toBeEnabled();
    });
    await user.click(screen.getByPlaceholderText("Select tasks"));
    await user.click(await screen.findByRole("option", { name: "lint-agent" }));

    await waitFor(() => {
      expect(router.state.location.search).toBe("?visibleColumns=lint-agent");
    });
  });
});
