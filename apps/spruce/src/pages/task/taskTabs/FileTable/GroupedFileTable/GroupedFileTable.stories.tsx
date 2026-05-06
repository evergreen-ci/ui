import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";
import GroupedFileTable from ".";

const files = [
  {
    name: "some_file",
    link: "some_link",
    urlParsley: null,
    associatedLinks: [
      {
        name: "Coverage",
        link: "coverage_link",
      },
    ],
  },
  {
    name: "another_file",
    link: "another_link",
    urlParsley: "parsley_link",
    associatedLinks: [],
  },
];

export default {
  component: GroupedFileTable,
} satisfies CustomMeta<typeof GroupedFileTable>;

export const DefaultTable: CustomStoryObj<typeof GroupedFileTable> = {
  render: (args) => <GroupedFileTable {...args} />,
  args: {
    taskName: "Task 1",
    files,
  },
};
