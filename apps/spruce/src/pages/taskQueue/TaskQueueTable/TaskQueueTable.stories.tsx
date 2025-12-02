import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { TaskQueueItem } from "gql/generated/types";
import TaskQueueTable from ".";

type TaskQueueColumnData = Omit<TaskQueueItem, "revision">;

const generateTaskQueue = (length: number): TaskQueueColumnData[] => {
  const tq: TaskQueueColumnData[] = [];
  for (let i = 0; i < length; i++) {
    const task: TaskQueueColumnData = {
      activatedBy: "admin",
      buildVariant: "osx-108-debug",
      displayName: "compile",
      expectedDuration: 600000,
      id: `task_${i}`,
      priority: 0,
      project:
        "23c73fc8a605de0e6d71f776128544356dca2a243a459db334d3514ae74a1ba7",
      projectIdentifier: "parsley",
      requester: "gitter_request",
      version: "mongodb_mongo_v4.2_cef23d286f5f9af1295d8097b33df764cc2201fe",
      __typename: "TaskQueueItem",
    };
    tq.push(task);
  }
  return tq;
};

export default {
  component: TaskQueueTable,
} satisfies CustomMeta<typeof TaskQueueTable>;

export const Default: CustomStoryObj<TemplateProps> = {
  args: {
    numTasks: 10,
  },
  argTypes: {
    numTasks: {
      control: { type: "number" },
    },
  },
  render: (args) => <Template {...args} />,
};

type TemplateProps = {
  numTasks: number;
};

const Template = (args: TemplateProps) => {
  const taskQueue = generateTaskQueue(args.numTasks);
  return (
    <div style={{ height: "800px" }}>
      <TaskQueueTable taskQueue={taskQueue} />
    </div>
  );
};
