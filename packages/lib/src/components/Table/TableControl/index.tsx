import styled from "@emotion/styled";
import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
import { Pagination } from "../Pagination";
import { TableControlOuterRow, TableControlInnerRow } from "./styles";

interface Props {
  disabled?: boolean;
  filteredCount: number;
  limit?: number;
  onClear: () => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  page: number;
}

const TableControl: React.FC<Props> = ({
  disabled = false,
  filteredCount,
  limit,
  onClear,
  onPageChange,
  onPageSizeChange,
  page,
}) => {
  const handlePageSizeChange = (pageSize: number) => {
    onPageSizeChange?.(pageSize);
  };

  const handlePageChange = (newPage: number) => {
    onPageChange?.(newPage);
  };

  const onClearAll = () => {
    onClear();
  };

  return (
    <TableControlOuterRow>
      <FlexContainer>
        <Button
          data-cy="clear-all-filters"
          disabled={disabled}
          onClick={onClearAll}
          size={ButtonSize.Small}
        >
          Clear all filters
        </Button>
      </FlexContainer>
      <PaginationContainer>
        <Pagination
          currentPage={page}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSize={limit}
          totalResults={filteredCount}
        />
      </PaginationContainer>
    </TableControlOuterRow>
  );
};

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

const PaginationContainer = styled(TableControlInnerRow)`
  * {
    min-width: fit-content;
  }
`;

export default TableControl;
