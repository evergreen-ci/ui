import { useMemo, useState } from "react";
import { LGTableDataType } from "@leafygreen-ui/table";
import { Button } from "@via-ds/components/button";
import { SearchField } from "@via-ds/components/search-field";
import { Disclaimer } from "@via-ds/components/typography";
import Icon from "@evg-ui/lib/components/Icon";
import {
  BaseTable,
  LGColumnDef,
  LGRowData,
  TablePlaceholder,
  useLeafyGreenTable,
} from "@evg-ui/lib/components/Table";
import { DisplayModal } from "components/DisplayModal";
import styles from "./index.module.css";

interface SkippedTestsModalProps<T extends LGRowData> {
  columns: LGColumnDef<T>[];
  getSearchText: (row: T) => string;
  loading?: boolean;
  onClickDownload: () => void;
  open: boolean;
  rows: LGTableDataType<T>[];
  searchPlaceholder: string;
  setOpen: (open: boolean) => void;
  subtitle: string;
  totalCount: number;
}

export const SkippedTestsModal = <T extends LGRowData>({
  columns,
  getSearchText,
  loading = false,
  onClickDownload,
  open,
  rows,
  searchPlaceholder,
  setOpen,
  subtitle,
  totalCount,
}: SkippedTestsModalProps<T>) => {
  const [search, setSearch] = useState("");

  const visibleRows = useMemo(
    () =>
      rows.filter((row) =>
        getSearchText(row).toLowerCase().includes(search.toLowerCase()),
      ),
    [rows, getSearchText, search],
  );

  const table = useLeafyGreenTable<T>({
    columns,
    data: visibleRows,
    enableColumnFilters: false,
  });

  return (
    <DisplayModal
      data-testid="skipped-tests-modal"
      open={open}
      setOpen={setOpen}
      size="large"
      subtitle={subtitle}
      title="Tests skipped by TSS"
    >
      <div className={styles.headerRow}>
        <SearchField
          aria-label={searchPlaceholder}
          onChange={(v) => setSearch(v)}
          placeholder={searchPlaceholder}
          size="small"
          value={search}
        />
        <Button
          data-testid="skipped-tests-download"
          isDisabled={loading}
          onPress={onClickDownload}
          size="small"
        >
          <Icon glyph="Download" />
          Download JSON
        </Button>
      </div>
      {!loading && rows.length < totalCount && (
        <Disclaimer data-testid="skipped-tests-truncation-note">
          Showing the first {rows.length} of {totalCount} tests. Download the
          JSON for all available stored tests.
        </Disclaimer>
      )}
      <div className={styles.overflowContainer}>
        <BaseTable
          data-testid="skipped-tests-table"
          emptyComponent={<TablePlaceholder message="No matching tests." />}
          loading={loading}
          loadingRows={5}
          shouldAlternateRowColor
          table={table}
        />
      </div>
    </DisplayModal>
  );
};
