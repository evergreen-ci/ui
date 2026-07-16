import { useState } from "react";
import usePagination from "hooks/usePagination";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import Pagination from ".";

export default {
  component: Pagination,
} satisfies CustomMeta<typeof Pagination>;

const DefaultImpl = (args: React.ComponentProps<typeof Pagination>) => {
  const { page } = usePagination();

  return (
    <>
      <p>usePagination: {page}</p>
      <Pagination {...args} currentPage={page} />
    </>
  );
};
export const Default: CustomStoryObj<typeof Pagination> = {
  args: {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    onChange: null,
    pageSize: 10,
    totalResults: 100,
  },
  argTypes: {},
  render: (args) => <DefaultImpl {...args} />,
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
  args: {
    currentPage: 2,
    pageSize: 10,
    totalResults: 100,
  },
  argTypes: {},
  render: (args) => <ControlledImpl {...args} />,
};
