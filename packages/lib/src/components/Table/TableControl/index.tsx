import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
import { Chip, Variant as ChipVariant } from "@leafygreen-ui/chip";
import { Pagination } from "../Pagination";
import styles from "./index.module.css";
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
      <div className={styles.flexContainer}>
        <Chip
          data-testid="total-count"
          label={`Total count: ${totalCount}`}
          variant={ChipVariant.Gray}
        />
        <Button
          data-testid="clear-all-filters"
          disabled={disabled}
          onClick={onClearAll}
          size={ButtonSize.Small}
        >
          Clear all filters
        </Button>
      </div>
      <TableControlInnerRow className={styles.paginationContainer}>
        <Pagination
          currentPage={page}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSize={limit}
          totalResults={filteredCount}
        />
      </TableControlInnerRow>
    </TableControlOuterRow>
  );
};

export default TableControl;
