import { Button } from "@via-ds/components/button";
import { Chip, ChipGroup, ChipVariant } from "@via-ds/components/chip";
import { Pagination } from "../../Pagination";
import styles from "./index.module.css";
import { TableControlInnerRow, TableControlOuterRow } from "./styles";

interface Props {
  disabled?: boolean;
  totalCount: number;
  filteredCount: number;
  limit?: number;
  loading?: boolean;
  onClear: () => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  page: number;
  selectedCount?: number;
}

const TableControl: React.FC<Props> = ({
  disabled = false,
  filteredCount,
  limit,
  loading,
  onClear,
  onPageChange,
  onPageSizeChange,
  page,
  selectedCount,
  totalCount,
}) => {
  const handlePageSizeChange = (pageSize: number) => {
    onPageSizeChange?.(pageSize);
  };

  const handlePageChange = (newPage: number) => {
    onPageChange?.(newPage);
  };

  return (
    <TableControlOuterRow>
      <div className={styles.flexContainer}>
        <ChipGroup aria-label="Table count">
          <Chip
            data-testid="total-count"
            id="total-count"
            variant={ChipVariant.Gray}
          >
            {`Total count: ${totalCount}`}
          </Chip>
          {selectedCount !== undefined && (
            <Chip data-testid="selected-count" variant={ChipVariant.Gray}>
              {`Selected: ${selectedCount}`}
            </Chip>
          )}
        </ChipGroup>
        <Button
          data-testid="clear-all-filters"
          isDisabled={disabled}
          onPress={onClear}
          size="small"
        >
          Clear all filters
        </Button>
      </div>
      <TableControlInnerRow>
        <Pagination
          currentPage={page}
          loading={loading}
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
