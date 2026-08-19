import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import GroupedFileTable from ".";

const files = [
  {
    name: "some_file",
    link: "https://example.com/some_file",
    urlParsley: null,
    associatedLinks: [
      {
        name: "Coverage",
        link: "https://example.com/coverage",
      },
    ],
  },
  {
    name: "another_file",
    link: "https://example.com/another_file",
    urlParsley: "https://example.com/parsley",
    associatedLinks: [],
  },
];

const maliciousFiles = [
  {
    name: "javascript_link_file",
    link: "javascript:alert(document.domain)",
    urlParsley: null,
    associatedLinks: [
      {
        name: "Coverage",
        link: "vbscript:msgbox(document.domain)",
      },
    ],
  },
  {
    name: "data_url_file",
    link: "https://example.com/safe_file",
    urlParsley: "data:text/html,<script>alert(document.domain)</script>",
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

export const MaliciousLinks: CustomStoryObj<typeof GroupedFileTable> = {
  render: (args) => <GroupedFileTable {...args} />,
  args: {
    taskName: "Task 1",
    files: maliciousFiles,
  },
};
