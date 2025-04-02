import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { TaskHistoryTask } from "../types";
import { groupTasks } from "../utils";
import TaskTimeline from ".";

export default {
  component: TaskTimeline,
  args: {
    shouldCollapse: true,
  },
  argTypes: {
    shouldCollapse: {
      control: { type: "boolean" },
    },
  },
} satisfies CustomMeta<TemplateProps>;

export const Default: CustomStoryObj<TemplateProps> = {
  render: (args) => <Template shouldCollapse={args.shouldCollapse} />,
};

type TemplateProps = {
  shouldCollapse: boolean;
};

const Template = (args: TemplateProps) => {
  const groupedTasks = groupTasks(tasks, args.shouldCollapse);
  return <TaskTimeline groupedTasks={groupedTasks} loading={false} />;
};

const tasks: TaskHistoryTask[] = [
  {
    id: "a",
    activated: true,
    displayStatus: TaskStatus.Succeeded,
    execution: 0,
    order: 100,
  },
  {
    id: "b",
    activated: true,
    displayStatus: TaskStatus.WillRun,
    execution: 0,
    order: 99,
  },
  {
    id: "c",
    activated: false,
    displayStatus: TaskStatus.Unscheduled,
    execution: 0,
    order: 98,
  },
  {
    id: "d",
    activated: true,
    displayStatus: TaskStatus.SetupFailed,
    execution: 0,
    order: 97,
  },
  {
    id: "c",
    activated: false,
    displayStatus: TaskStatus.Unscheduled,
    execution: 0,
    order: 96,
  },
  {
    id: "e",
    activated: true,
    displayStatus: TaskStatus.Failed,
    execution: 0,
    order: 95,
  },
  {
    id: "f",
    activated: false,
    displayStatus: TaskStatus.Unscheduled,
    execution: 0,
    order: 94,
  },
  {
    id: "g",
    activated: false,
    displayStatus: TaskStatus.Unscheduled,
    execution: 0,
    order: 93,
  },
  {
    id: "h",
    activated: false,
    displayStatus: TaskStatus.Unscheduled,
    execution: 0,
    order: 92,
  },
  {
    id: "i",
    activated: true,
    displayStatus: TaskStatus.KnownIssue,
    execution: 0,
    order: 91,
  },
  {
    id: "j",
    activated: true,
    displayStatus: TaskStatus.SystemFailed,
    execution: 0,
    order: 90,
  },
];
