import styled from "@emotion/styled";
import {
  CustomStoryObj,
  CustomMeta,
  ApolloMock,
} from "@evg-ui/lib/test_utils/types";
import { TaskStatus } from "@evg-ui/lib/types/task";
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
};

export const OOMTracker: CustomStoryObj<typeof Metadata> = {
  render: (args) => (
    <Container>
      <Metadata
        {...args}
        task={{
          ...taskQuery.task,
          details: {
            description: "'shell.exec' in function 'yarn-test' (step 1 of 1)",
            diskDevices: [],
            failingCommand: "",
            failureMetadataTags: [],
            oomTracker: {
              detected: true,
              pids: [12345, 67890],
            },
            otherFailingCommands: [],
            status: TaskStatus.Failed,
            type: "type",
          },
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
      execution: taskQuery.task.execution,
      taskId: taskQuery.task.id,
    },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        execution: taskQuery.task.execution,
        id: taskQuery.task.id,
        taskOwnerTeam: {
          __typename: "TaskOwnerTeam",
          messages: "Assigned based on default team",
          teamName: "Evergreen UI Team",
        },
      },
    },
  },
};

export const WithRunningETA: CustomStoryObj<typeof Metadata> = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Container>
      <Metadata
        {...args}
        task={{
          ...taskQuery.task,
          activatedTime: new Date("2020-09-30T19:16:30.000Z"),
          displayStatus: TaskStatus.Started,
          expectedDuration: 5 * 60 * 1000,
          finishTime: null,
          ingestTime: new Date("2020-09-30T19:16:00.000Z"),
          startTime: new Date(),
        }}
      />
    </Container>
  ),
};

export const WithTimeline: CustomStoryObj<typeof Metadata> = {
  render: (args) => (
    <Container>
      <Metadata
        {...args}
        task={{
          ...taskQuery.task,
          activatedTime: new Date("2020-09-30T19:16:30.000Z"),
          finishTime: new Date("2020-09-30T21:32:00.000Z"),
          ingestTime: new Date("2020-09-30T19:16:00.000Z"),
          startTime: new Date("2020-09-30T21:30:00.000Z"),
        }}
      />
    </Container>
  ),
};

export const WithTaskOwner: CustomStoryObj<typeof Metadata> = {
  parameters: {
    apolloClient: {
      mocks: [taskOwnerTeamMock],
    },
  },
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
};

const Container = styled.div`
  width: 275px;
`;

const abortInfoMap: Record<string, AbortInfo> = {
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
  NoUser: {
    buildVariantDisplayName: "~ Merge Queue",
    newVersion: "",
    prClosed: false,
    taskDisplayName: "api-task-server",
    taskID: "abc",
    user: "",
  },
};
