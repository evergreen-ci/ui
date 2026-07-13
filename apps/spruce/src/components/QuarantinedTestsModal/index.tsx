import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { Button } from "@leafygreen-ui/button";
import {
  SearchInput,
  Size as SearchInputSize,
} from "@leafygreen-ui/search-input";
import { LGTableDataType } from "@leafygreen-ui/table";
import { Disclaimer } from "@leafygreen-ui/typography";
import Icon from "@evg-ui/lib/components/Icon";
import {
  BaseTable,
  LGColumnDef,
  LGRowData,
  TablePlaceholder,
  useLeafyGreenTable,
} from "@evg-ui/lib/components/Table";
import { size } from "@evg-ui/lib/constants/tokens";
import { DisplayModal } from "components/DisplayModal";

interface QuarantinedTestsModalProps<T extends LGRowData> {
  columns: LGColumnDef<T>[];
  dataCyPrefix: string;
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

export const QuarantinedTestsModal = <T extends LGRowData>({
  columns,
  dataCyPrefix,
  getSearchText,
  loading = false,
  onClickDownload,
  open,
  rows,
  searchPlaceholder,
  setOpen,
  subtitle,
  totalCount,
}: QuarantinedTestsModalProps<T>) => {
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
      data-cy={`${dataCyPrefix}-modal`}
      open={open}
      setOpen={setOpen}
      size="large"
      subtitle={subtitle}
      title="Tests skipped due to TSS quarantine"
    >
      <HeaderRow>
        <SearchInput
          aria-label={searchPlaceholder}
          data-cy={`${dataCyPrefix}-search`}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={searchPlaceholder}
          size={SearchInputSize.Small}
          value={search}
        />
        <Button
          data-cy={`${dataCyPrefix}-download`}
          leftGlyph={<Icon glyph="Download" />}
          onClick={onClickDownload}
          size="small"
        >
          Download JSON
        </Button>
      </HeaderRow>
      {!loading && rows.length < totalCount && (
        <Disclaimer data-cy={`${dataCyPrefix}-truncation-note`}>
          Showing the first {rows.length} of {totalCount} tests. Download the
          JSON for all available stored tests.
        </Disclaimer>
      )}
      <OverflowContainer>
        <BaseTable
          data-cy={`${dataCyPrefix}-table`}
          emptyComponent={<TablePlaceholder message="No matching tests." />}
          loading={loading}
          loadingRows={5}
          shouldAlternateRowColor
          table={table}
        />
      </OverflowContainer>
    </DisplayModal>
  );
};

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${size.xs};
  margin-bottom: ${size.xs};
`;

const OverflowContainer = styled.div`
  max-height: 600px;
  overflow-y: scroll;
  margin-top: ${size.xs};
`;
