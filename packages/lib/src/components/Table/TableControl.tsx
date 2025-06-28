import React from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { size } from "../../constants/tokens";

interface Props {
  filteredCount: number;
  totalCount: number;
  limit: number;
  page: number;
  label: string;
  disabled?: boolean;
  onClear: () => void;
  onPageSizeChange?: (pageSize: number) => void;
  onPageChange?: (page: number) => void;
}

const TableControl: React.FC<Props> = ({
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
  const handlePageSizeChange = (pageSize: number) => {
    onPageSizeChange?.(pageSize);
  };

  const onClearAll = () => {
    onClear();
  };

  return (
    <OuterRow>
      <FlexContainer>
        <ResultCount
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
      <InnerRow>
        <SimplePagination
          currentPage={page}
          data-cy="tasks-table-pagination"
          onChange={onPageChange}
          pageSize={limit}
          totalResults={filteredCount}
        />
        <SimplePageSizeSelector
          data-cy="tasks-table-page-size-selector"
          disabled={disabled}
          onChange={handlePageSizeChange}
          value={limit}
        />
      </InnerRow>
    </OuterRow>
  );
};

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

const PaddedButton = styled(Button)`
  margin-left: ${size.m};
`;

const OuterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${size.s};
`;

const InnerRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.s};
`;

const ResultCount: React.FC<{
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

const SimplePagination: React.FC<{
  currentPage: number;
  onChange?: (page: number) => void;
  totalResults: number;
  pageSize: number;
  "data-cy"?: string;
}> = ({ currentPage, "data-cy": dataCy, pageSize, totalResults }) => {
  const totalPages = Math.ceil(totalResults / pageSize);

  return (
    <div data-cy={dataCy}>
      Page {currentPage + 1} of {totalPages}
    </div>
  );
};

const SimplePageSizeSelector: React.FC<{
  value: number;
  disabled?: boolean;
  onChange: (pageSize: number) => void;
  "data-cy"?: string;
}> = ({ "data-cy": dataCy, disabled, onChange, value }) => (
  <select
    data-cy={dataCy}
    disabled={disabled}
    onChange={(e) => onChange(Number(e.target.value))}
    value={value}
  >
    <option value={10}>10</option>
    <option value={20}>20</option>
    <option value={50}>50</option>
    <option value={100}>100</option>
  </select>
);

export default TableControl;
