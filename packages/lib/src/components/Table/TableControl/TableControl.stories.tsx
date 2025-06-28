import React from "react";
import styled from "@emotion/styled";
import { CustomStoryObj, CustomMeta } from "test_utils/types";
import { size } from "../../../constants/tokens";
import TableControl from "../TableControl";

const MockResultCountLabel: React.FC<{
  numerator: number;
  denominator: number;
  dataCyNumerator?: string;
  dataCyDenominator?: string;
  label: string;
}> = ({
  dataCyDenominator,
  dataCyNumerator,
  denominator,
  label,
  numerator,
}) => (
  <div>
    <span data-cy={dataCyNumerator}>{numerator}</span>/
    <span data-cy={dataCyDenominator}>{denominator}</span>
    <span> {label}</span>
  </div>
);

const MockPagination: React.FC<{
  currentPage: number;
  onChange?: (page: number) => void;
  totalResults: number;
  pageSize: number;
  "data-cy"?: string;
}> = ({ currentPage, pageSize, totalResults }) => (
  <div data-cy="pagination">
    Page {currentPage + 1} of {Math.ceil(totalResults / pageSize)}
  </div>
);

const MockPageSizeSelector: React.FC<{
  value: number;
  disabled?: boolean;
  onChange: (pageSize: number) => void;
  "data-cy"?: string;
}> = ({ value }) => <div>{value} / page</div>;

const MockOuterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: ${size.xs};
`;

const MockInnerRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default {
  component: TableControl,
} satisfies CustomMeta<typeof TableControl>;

export const Default: CustomStoryObj<typeof TableControl> = {
  render: (args) => (
    <TableControl
      {...args}
      InnerRowComponent={MockInnerRow}
      OuterRowComponent={MockOuterRow}
      PageSizeSelectorComponent={MockPageSizeSelector}
      PaginationComponent={MockPagination}
      ResultCountComponent={MockResultCountLabel}
    />
  ),
  args: {
    filteredCount: 10,
    totalCount: 100,
    limit: 20,
    page: 0,
    label: "items",
    disabled: false,
    onClear: () => console.log("Clear filters"),
    onPageSizeChange: (pageSize: number) =>
      console.log("Page size changed:", pageSize),
    onPageChange: (page: number) => console.log("Page changed:", page),
  },
};
