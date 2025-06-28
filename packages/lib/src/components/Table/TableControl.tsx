import React from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { size } from "../../constants/tokens";

interface TableControlProps {
  filteredCount: number;
  totalCount: number;
  limit: number;
  page: number;
  label: string;
  disabled?: boolean;
  onClear: () => void;
  onPageSizeChange?: (pageSize: number) => void;
  onPageChange?: (page: number) => void;
  ResultCountComponent: React.ComponentType<{
    numerator: number;
    denominator: number;
    dataCyNumerator?: string;
    dataCyDenominator?: string;
    label: string;
  }>;
  PaginationComponent: React.ComponentType<{
    currentPage: number;
    onChange?: (page: number) => void;
    totalResults: number;
    pageSize: number;
    "data-cy"?: string;
  }>;
  PageSizeSelectorComponent: React.ComponentType<{
    value: number;
    disabled?: boolean;
    onChange: (pageSize: number) => void;
    "data-cy"?: string;
  }>;
  OuterRowComponent: React.ComponentType<{ children: React.ReactNode }>;
  InnerRowComponent: React.ComponentType<{ children: React.ReactNode }>;
}

const TableControl: React.FC<TableControlProps> = ({
  InnerRowComponent,
  OuterRowComponent,
  PageSizeSelectorComponent,
  PaginationComponent,
  ResultCountComponent,
  disabled = false,
  filteredCount,
  label,
  limit,
  onClear,
  onPageChange,
  onPageSizeChange,
  page,
  totalCount,
}) => {
  const onClearAll = () => {
    onClear();
  };

  const handlePageSizeChange = (pageSize: number) => {
    onPageSizeChange?.(pageSize);
  };

  return (
    <OuterRowComponent>
      <FlexContainer>
        <ResultCountComponent
          dataCyDenominator="total-count"
          dataCyNumerator="filtered-count"
          denominator={totalCount}
          label={label}
          numerator={filteredCount}
        />
        <PaddedButton
          data-cy="clear-all-filters"
          disabled={disabled}
          onClick={onClearAll}
          size="small"
        >
          Clear all filters
        </PaddedButton>
      </FlexContainer>
      <InnerRowComponent>
        <PaginationComponent
          currentPage={page}
          data-cy="tasks-table-pagination"
          onChange={onPageChange}
          pageSize={limit}
          totalResults={filteredCount}
        />
        <PageSizeSelectorComponent
          data-cy="tasks-table-page-size-selector"
          disabled={disabled}
          onChange={handlePageSizeChange}
          value={limit}
        />
      </InnerRowComponent>
    </OuterRowComponent>
  );
};

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

const PaddedButton = styled(Button)`
  margin-left: ${size.m};
`;

export default TableControl;
