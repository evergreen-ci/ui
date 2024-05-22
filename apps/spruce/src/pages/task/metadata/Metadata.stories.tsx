import styled from "@emotion/styled";
import { MetStatus, RequiredStatus } from "gql/generated/types";
import { taskQuery } from "gql/mocks/taskData";
import { CustomStoryObj, CustomMeta } from "test_utils/types";
import { Metadata } from "./index";

export default {
  component: Metadata,
} satisfies CustomMeta<typeof Metadata>;

export const Default: CustomStoryObj<typeof Metadata> = {
  render: (args) => (
    <Container>
      <Metadata
        {...args}
        task={taskQuery.task}
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        taskId={taskQuery.task.id}
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        error={null}
      />
    </Container>
  ),
};

export const WithDependencies: CustomStoryObj<typeof Metadata> = {
  render: (args) => (
    <Container>
      <Metadata
        {...args}
        // @ts-expect-error: FIXME. This comment was added by an automated script.
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
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        taskId={taskQuery.task.id}
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        error={null}
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
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        task={{
          ...taskQuery.task,
          aborted: true,
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          abortInfo: abortInfoMap[abortInfoSelection],
        }}
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        taskId={taskQuery.task.id}
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        error={null}
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

export const ContainerizedTask: CustomStoryObj<typeof Metadata> = {
  render: (args) => (
    <Container>
      <Metadata
        {...args}
        task={{
          ...taskQuery.task,
          hostId: null,
          ami: null,
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          distroId: null,
          pod: {
            id: "pod_id",
          },
          spawnHostLink: null,
        }}
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        taskId={taskQuery.task.id}
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        error={null}
      />
    </Container>
  ),
};

const Container = styled.div`
  width: 400px;
`;

const abortInfoMap = {
  NoUser: {
    buildVariantDisplayName: "~ Commit Queue",
    newVersion: null,
    prClosed: false,
    taskDisplayName: "api-task-server",
    taskID: "abc",
    user: null,
  },
  AbortedBecauseOfFailingTask: {
    buildVariantDisplayName: "~ Commit Queue",
    newVersion: null,
    prClosed: false,
    taskDisplayName: "api-task-server",
    taskID: "abc",
    user: "apiserver",
  },
  AbortedBecauseOfNewVersion: {
    buildVariantDisplayName: null,
    newVersion: "5ee1efb3d1fe073e194e8b5c",
    prClosed: false,
    taskDisplayName: null,
    taskID: null,
    user: "apiserver",
  },
  AbortedBecausePRClosed: {
    buildVariantDisplayName: null,
    newVersion: null,
    prClosed: true,
    taskDisplayName: null,
    taskID: null,
    user: "apiserver",
  },
};
