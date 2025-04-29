import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { size } from "@evg-ui/lib/constants/tokens";
import PageSizeSelector from "components/PageSizeSelector";
import Pagination from "components/Pagination";
import { ResultCountLabel } from "components/ResultCountLabel";
import { TableControlOuterRow, TableControlInnerRow } from "components/styles";
import usePagination from "hooks/usePagination";

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
  const { setLimit } = usePagination();

  const handlePageSizeChange = (pageSize: number) => {
    setLimit(pageSize);
    onPageSizeChange?.(pageSize);
  };
  const onClearAll = () => {
    onClear();
  };

  return (
    <TableControlOuterRow>
      <FlexContainer>
        <ResultCountLabel
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
      <TableControlInnerRow>
        <Pagination
          currentPage={page}
          data-cy="tasks-table-pagination"
          onChange={onPageChange}
          pageSize={limit}
          totalResults={filteredCount}
        />
        <PageSizeSelector
          data-cy="tasks-table-page-size-selector"
          disabled={disabled}
          onChange={handlePageSizeChange}
          value={limit}
        />
      </TableControlInnerRow>
    </TableControlOuterRow>
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
