import styled from "@emotion/styled";
import { CustomStoryObj, CustomMeta, ApolloMock } from "@evg-ui/lib/test_utils";
import { TaskStatus } from "@evg-ui/lib/types";
import {
  AbortInfo,
  MetStatus,
  RequiredStatus,
  TaskOwnerTeamsForTaskQuery,
  TaskOwnerTeamsForTaskQueryVariables,
} from "gql/generated/types";
import { taskQuery } from "gql/mocks/taskData";
import { TASK_OWNER_TEAM } from "gql/queries";
import { Metadata } from "./index";

export default {
  component: Metadata,
} satisfies CustomMeta<typeof Metadata>;

export const Default: CustomStoryObj<typeof Metadata> = {
  render: (args) => (
    <Container>
      <Metadata {...args} task={taskQuery.task} />
    </Container>
  ),
};

export const WithDependencies: CustomStoryObj<typeof Metadata> = {
  render: (args) => (
    <Container>
      <Metadata
        {...args}
        task={{
          ...taskQuery.task,
          dependsOn: [
            {
              buildVariant: "ubuntu1604",
              metStatus: MetStatus.Unmet,
              name: "Some dep",
              requiredStatus: RequiredStatus.MustSucceed,
              taskId: "some_task_id_1",
            },
            {
              buildVariant: "ubuntu1604",
              metStatus: MetStatus.Pending,
              name: "Some dep",
              requiredStatus: RequiredStatus.MustFinish,
              taskId: "some_task_id_2",
            },
            {
              buildVariant: "ubuntu1604",
              metStatus: MetStatus.Met,
              name: "Some dep",
              requiredStatus: RequiredStatus.MustFail,
              taskId: "some_task_id_3",
            },
            {
              buildVariant: "ubuntu1604",
              metStatus: MetStatus.Started,
              name: "Some dep",
              requiredStatus: RequiredStatus.MustFail,
              taskId: "some_task_id_4",
            },
          ],
        }}
      />
    </Container>
  ),
};

export const WithAbortMessage: CustomStoryObj<
  { abortInfoSelection: string } & React.ComponentProps<typeof Metadata>
> = {
  render: ({ abortInfoSelection, ...args }) => (
    <Container>
      <Metadata
        {...args}
        task={{
          ...taskQuery.task,
          aborted: true,
          abortInfo: abortInfoMap[abortInfoSelection],
        }}
      />
    </Container>
  ),
  args: {
    abortInfoSelection: "NoUser",
  },
  argTypes: {
    abortInfoSelection: {
      control: "select",
      options: [
        "NoUser",
        "AbortedBecauseOfFailingTask",
        "AbortedBecauseOfNewVersion",
        "AbortedBecausePRClosed",
      ],
    },
  },
};

export const OOMTracker: CustomStoryObj<typeof Metadata> = {
  render: (args) => (
    <Container>
      <Metadata
        {...args}
        task={{
          ...taskQuery.task,
          details: {
            failingCommand: "",
            description: "'shell.exec' in function 'yarn-test' (step 1 of 1)",
            diskDevices: [],
            oomTracker: {
              detected: true,
              pids: [12345, 67890],
            },
            status: TaskStatus.Failed,
            type: "type",
            failureMetadataTags: [],
            otherFailingCommands: [],
          },
        }}
      />
    </Container>
  ),
};

export const ContainerizedTask: CustomStoryObj<typeof Metadata> = {
  render: (args) => (
    <Container>
      <Metadata
        {...args}
        task={{
          ...taskQuery.task,
          hostId: null,
          ami: null,
          distroId: "",
          pod: {
            id: "pod_id",
          },
          spawnHostLink: null,
        }}
      />
    </Container>
  ),
};

const taskOwnerTeamMock: ApolloMock<
  TaskOwnerTeamsForTaskQuery,
  TaskOwnerTeamsForTaskQueryVariables
> = {
  request: {
    query: TASK_OWNER_TEAM,
    variables: {
      taskId: taskQuery.task.id,
      execution: taskQuery.task.execution,
    },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        id: taskQuery.task.id,
        execution: taskQuery.task.execution,
        taskOwnerTeam: {
          __typename: "TaskOwnerTeam",
          messages: "Assigned based on default team",
          teamName: "Evergreen UI Team",
        },
      },
    },
  },
};
export const WithTaskOwner: CustomStoryObj<typeof Metadata> = {
  render: (args) => (
    <Container>
      <Metadata
        {...args}
        task={{
          ...taskQuery.task,
        }}
      />
    </Container>
  ),
  parameters: {
    apolloClient: {
      mocks: [taskOwnerTeamMock],
    },
  },
};

const Container = styled.div`
  width: 275px;
`;

const abortInfoMap: Record<string, AbortInfo> = {
  NoUser: {
    buildVariantDisplayName: "~ Merge Queue",
    newVersion: "",
    prClosed: false,
    taskDisplayName: "api-task-server",
    taskID: "abc",
    user: "",
  },
  AbortedBecauseOfFailingTask: {
    buildVariantDisplayName: "~ Merge Queue",
    newVersion: "",
    prClosed: false,
    taskDisplayName: "api-task-server",
    taskID: "abc",
    user: "apiserver",
  },
  AbortedBecauseOfNewVersion: {
    buildVariantDisplayName: "",
    newVersion: "5ee1efb3d1fe073e194e8b5c",
    prClosed: false,
    taskDisplayName: "",
    taskID: "",
    user: "apiserver",
  },
  AbortedBecausePRClosed: {
    buildVariantDisplayName: "",
    newVersion: "",
    prClosed: true,
    taskDisplayName: "",
    taskID: "",
    user: "apiserver",
  },
};
