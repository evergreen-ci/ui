import { CustomStoryObj, CustomMeta } from "test_utils/types";
import TableControl from ".";

export default {
  component: TableControl,
} satisfies CustomMeta<typeof TableControl>;

export const Default: CustomStoryObj<typeof TableControl> = {
  render: (args) => <TableControl {...args} />,
  args: {
    filteredCount: 10,
    limit: 20,
    page: 0,
    disabled: false,
    onClear: () => console.log("Clear filters"),
    onPageSizeChange: (pageSize: number) =>
      console.log("Page size changed:", pageSize),
    onPageChange: (page: number) => console.log("Page changed:", page),
  },
};
