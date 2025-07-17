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
  render: (args) => <DefaultImpl {...args} />,
  argTypes: {},
  args: {
    totalResults: 100,
    pageSize: 10,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
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
