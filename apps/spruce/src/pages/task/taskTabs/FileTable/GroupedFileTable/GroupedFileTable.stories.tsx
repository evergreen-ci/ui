import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import GroupedFileTable from ".";

const files = [
  {
    associatedLinks: [
      {
        link: "coverage_link",
        name: "Coverage",
      },
    ],
    link: "some_link",
    name: "some_file",
    urlParsley: null,
  },
  {
    associatedLinks: [],
    link: "another_link",
    name: "another_file",
    urlParsley: "parsley_link",
  },
];

export default {
  component: GroupedFileTable,
} satisfies CustomMeta<typeof GroupedFileTable>;

export const DefaultTable: CustomStoryObj<typeof GroupedFileTable> = {
  args: {
    files,
    taskName: "Task 1",
  },
  render: (args) => <GroupedFileTable {...args} />,
};
