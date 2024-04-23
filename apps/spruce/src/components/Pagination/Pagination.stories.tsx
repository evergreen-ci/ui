import { useState } from "react";
import useTablePagination from "hooks/useTablePagination";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import Pagination from ".";

export default {
  component: Pagination,
} satisfies CustomMeta<typeof Pagination>;

const DefaultImpl = (args: React.ComponentProps<typeof Pagination>) => {
  const { page } = useTablePagination();

  return (
    <>
      <p>Query Params: {page}</p>
      <Pagination {...args} currentPage={page} />
    </>
  );
};
export const Default: CustomStoryObj<typeof Pagination> = {
  render: (args) => <DefaultImpl {...args} />,
  argTypes: {},
  args: {
    totalResults: 100,
    pageSize: 10,
    onChange: null,
  },
};

const ControlledImpl = (args: React.ComponentProps<typeof Pagination>) => {
  const [currentPage, setCurrentPage] = useState(2);

  return (
    <>
      <p>Stateful Value: {currentPage}</p>

      <Pagination
        {...args}
        currentPage={currentPage}
        onChange={setCurrentPage}
      />
    </>
  );
};
export const Controlled: CustomStoryObj<typeof Pagination> = {
  render: (args) => <ControlledImpl {...args} />,
  argTypes: {},
  args: {
    currentPage: 2,
    pageSize: 10,
    totalResults: 100,
  },
};
