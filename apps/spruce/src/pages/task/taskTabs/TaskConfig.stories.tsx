import WithToastContext from "@evg-ui/lib/test_utils/toast-decorator";
import {
  ApolloMock,
  CustomMeta,
  CustomStoryObj,
} from "@evg-ui/lib/test_utils/types";
import { TaskConfigQuery, TaskConfigQueryVariables } from "gql/generated/types";
import { TASK_CONFIG } from "gql/queries";
import { TaskConfigTab } from "./TaskConfig";

const taskConfigMock: ApolloMock<TaskConfigQuery, TaskConfigQueryVariables> = {
  request: {
    query: TASK_CONFIG,
    variables: {
      execution: 0,
      taskId: "task-id",
    },
  },
  result: {
    data: {
      task: {
        id: "task-id",
        execution: 0,
        config: {
          activate: true,
          allowedBranches: [],
          allowedRequesters: ["github"],
          allowForGitTag: false,
          batchTime: 0,
          cronBatchTime: null,
          dependsOn: [
            {
              name: "compile",
              omitGeneratedTasks: false,
              patchOptional: true,
              status: "success",
              variant: "ubuntu2204",
            },
          ],
          disable: false,
          execTimeoutSecs: 3600,
          gitTagOnly: false,
          groupName: "example-tasks",
          isGroup: false,
          isPartOfGroup: true,
          name: "test",
          patchOnly: false,
          patchable: true,
          priority: 5,
          ps: "",
          runOn: ["ubuntu2204"],
          stepback: true,
        },
      },
    },
  },
};

export default {
  component: TaskConfigTab,
  decorators: [(Story: () => React.JSX.Element) => WithToastContext(Story)],
  parameters: {
    apolloClient: {
      mocks: [taskConfigMock],
    },
  },
} satisfies CustomMeta<typeof TaskConfigTab>;

export const Default: CustomStoryObj<typeof TaskConfigTab> = {
  args: {
    execution: 0,
    taskId: "task-id",
  },
};
