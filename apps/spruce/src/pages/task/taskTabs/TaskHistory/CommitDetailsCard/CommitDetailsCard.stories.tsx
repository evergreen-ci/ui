import WithToastContext from "@evg-ui/lib/test_utils/toast-decorator";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { SortedTaskStatus, TaskStatus } from "@evg-ui/lib/types/task";
import { TestStatus } from "@evg-ui/lib/types/test";
import { TestResult } from "gql/generated/types";
import { tasks } from "../testData";
import CommitDetailsCard from ".";

export default {
  component: CommitDetailsCard,
  decorators: [(Story: () => JSX.Element) => WithToastContext(Story)],
  args: {
    isCurrentTask: true,
    status: TaskStatus.Succeeded,
    canRestart: true,
    message:
      "DEVPROD-1234: Create Commit Details Card component which will be used in the Commit Details List. It should handle overflow correctly and render different status colors.",
    isMatching: true,
  },
  argTypes: {
    isCurrentTask: {
      control: { type: "boolean" },
    },
    status: {
      options: SortedTaskStatus,
      control: { type: "select" },
    },
    canRestart: {
      control: { type: "boolean" },
    },
    message: {
      control: { type: "text" },
    },
    isMatching: {
      control: { type: "boolean" },
    },
  },
} satisfies CustomMeta<TemplateProps>;

export const Default: CustomStoryObj<TemplateProps> = {
  render: (args) => <Template {...args} />,
};

export const WithFailingTests: CustomStoryObj<TemplateProps> = {
  render: (args) => (
    <Template {...args} hasFailingTests status={TaskStatus.Failed} />
  ),
};

export const WithLongMessage: CustomStoryObj<TemplateProps> = {
  render: (args) => (
    <Template
      {...args}
      message="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    />
  ),
};

type TemplateProps = {
  isCurrentTask: boolean;
  status: TaskStatus;
  canRestart: boolean;
  message: string;
  isMatching: boolean;
  hasFailingTests: boolean;
};

const testResults: TestResult[] = Array.from({ length: 15 }, (_, idx) => ({
  id: `e2e_test_${idx}`,
  testFile: `e2e_test_${idx}`,
  status: idx % 3 === 0 ? TestStatus.SilentFail : TestStatus.Fail,
  logs: { urlParsley: `${idx}-parsley-url.mongodb.com` },
}));

const getStoryTask = (args: TemplateProps) => {
  const task = args.hasFailingTests
    ? {
        ...tasks[0],
        tests: { testResults },
      }
    : tasks[0];

  return {
    ...task,
    displayStatus: args.status,
    canRestart: args.canRestart,
    versionMetadata: {
      ...task.versionMetadata,
      message: args.message,
    },
  };
};

const Template = (args: TemplateProps) => {
  const storyTask = getStoryTask(args);
  return (
    <CommitDetailsCard
      isCurrentTask={args.isCurrentTask}
      isMatching={args.isMatching}
      owner="evergreen-ci"
      repo="evergreen"
      task={storyTask}
    />
  );
};
