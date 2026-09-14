import {
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
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
  it("renders a chip labeled with each selected task", async () => {
    render(
      <MockedProvider mocks={[taskNamesMock]}>
        <TaskSelector buildVariant="lint" projectIdentifier="evergreen" />
      </MockedProvider>,
      {
        route: "/variant-history/evergreen/lint?visibleColumns=lint-agent",
        path: "/variant-history/:projectId/:variantName",
      },
    );

    await waitFor(() => {
      expect(screen.getByText("lint-agent")).toBeInTheDocument();
    });
  });
});
