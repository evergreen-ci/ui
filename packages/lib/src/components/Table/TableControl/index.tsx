import styled from "@emotion/styled";
import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
import { Chip, Variant as ChipVariant } from "@leafygreen-ui/chip";
import { size } from "../../../constants/tokens";
import { Pagination } from "../Pagination";
import { TableControlInnerRow, TableControlOuterRow } from "./styles";

interface Props {
  disabled?: boolean;
  totalCount: number;
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
  totalCount,
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
        <Chip label={`Total count: ${totalCount}`} variant={ChipVariant.Gray} />
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
  gap: ${size.xs};
`;

const PaginationContainer = styled(TableControlInnerRow)`
  * {
    min-width: fit-content;
  }
`;

export default TableControl;
