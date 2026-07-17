import { CustomMeta, CustomStoryObj } from "test_utils/types";
import TableControl from ".";

export default {
  component: TableControl,
} satisfies CustomMeta<typeof TableControl>;

export const Default: CustomStoryObj<typeof TableControl> = {
  args: {
    disabled: false,
    filteredCount: 10,
    label: "items",
    limit: 20,
    onClear: () => console.log("Clear filters"),
    onPageChange: (page: number) => console.log("Page changed:", page),
    onPageSizeChange: (pageSize: number) =>
      console.log("Page size changed:", pageSize),
    page: 0,
    totalCount: 100,
  },
  render: (args) => <TableControl {...args} />,
};
