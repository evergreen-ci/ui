import {
  MockedProvider,
  MockedProviderProps,
  renderHook,
  waitFor,
  ApolloMock,
} from "@evg-ui/lib/test_utils";
import {
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables,
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables,
} from "gql/generated/types";
import { BASE_VERSION_AND_TASK, LAST_MAINLINE_COMMIT } from "gql/queries";
import { useLastPassingTask } from ".";

interface ProviderProps {
  mocks?: MockedProviderProps["mocks"];
  children: React.ReactNode;
}
const ProviderWrapper: React.FC<ProviderProps> = ({ children, mocks = [] }) => (
  <MockedProvider mocks={mocks}>{children}</MockedProvider>
);

describe("useLastPassingTask", () => {
  it("no last passing task is found when task is not found", () => {
    const { result } = renderHook(() => useLastPassingTask("t1"), {
      wrapper: ({ children }) => ProviderWrapper({ children }),
    });

    expect(result.current.task).toBeUndefined();
  });
  it("a last passing task is found", async () => {
    const { result } = renderHook(() => useLastPassingTask("t1"), {
      wrapper: ({ children }) =>
        ProviderWrapper({
          children,
          mocks: [getPatchTaskWithFailingBaseTask, getLastPassingVersion],
        }),
    });

    await waitFor(() => {
      expect(result.current.task).toBeDefined();
    });

    expect(result.current.task?.id).toBe("last_passing_task");
  });
  it("a last passing task is not found due to an error in the query", async () => {
    const { result } = renderHook(() => useLastPassingTask("t1"), {
      wrapper: ({ children }) =>
        ProviderWrapper({
          children,
          mocks: [
            getPatchTaskWithFailingBaseTask,
            getLastPassingVersionWithError,
          ],
        }),
    });

    await waitFor(() => {
      expect(result.current.task).toBeUndefined();
    });
  });
});

const baseTaskId =
  "evergreen_lint_lint_agent_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_21_11_29_17_55_27";

const getPatchTaskWithFailingBaseTask: ApolloMock<
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables
> = {
  request: {
    query: BASE_VERSION_AND_TASK,
    variables: {
      taskId: "t1",
    },
  },
  result: {
    data: {
      task: {
        id: "evergreen_lint_lint_agent_patch_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_61a8edf132f41750ab47bc72_21_12_02_16_01_54",
        execution: 0,
        displayName: "lint-agent",
        buildVariant: "lint",
        projectIdentifier: "evergreen",
        displayStatus: "failed",
        versionMetadata: {
          baseVersion: {
            id: "baseVersion",
            order: 3676,
            __typename: "Version",
          },
          isPatch: true,
          id: "versionMetadataId",
          __typename: "Version",
        },
        baseTask: {
          id: baseTaskId,
          execution: 0,
          displayStatus: "failed",
          order: 3676,
          __typename: "Task",
        },
        __typename: "Task",
      },
    },
  },
};

const getLastPassingVersion: ApolloMock<
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables
> = {
  request: {
    query: LAST_MAINLINE_COMMIT,
    variables: {
      projectIdentifier: "evergreen",
      skipOrderNumber: 3676,
      buildVariantOptions: {
        tasks: ["^lint-agent$"],
        variants: ["^lint$"],
        statuses: ["success"],
      },
    },
  },
  result: {
    data: {
      mainlineCommits: {
        versions: [
          {
            version: {
              id: "evergreen_44110b57c6977bf3557009193628c9389772163f",
              buildVariants: [
                {
                  tasks: [
                    {
                      id: "last_passing_task",
                      execution: 0,
                      order: 3674,
                      displayStatus: "success",
                      __typename: "Task",
                    },
                  ],
                  __typename: "GroupedBuildVariant",
                },
              ],
              __typename: "Version",
            },
            __typename: "MainlineCommitVersion",
          },
        ],
        __typename: "MainlineCommits",
      },
    },
  },
};

const getLastPassingVersionWithError: ApolloMock<
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables
> = {
  request: {
    query: LAST_MAINLINE_COMMIT,
    variables: {
      projectIdentifier: "evergreen",
      skipOrderNumber: 3676,
      buildVariantOptions: {
        tasks: ["^lint-agent$"],
        variants: ["^lint$"],
        statuses: ["success"],
      },
    },
  },
  error: new Error("Matching task not found!"),
};
