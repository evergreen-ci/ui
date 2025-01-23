import { useEffect, useMemo, useRef } from "react";
import throttle from "lodash.throttle";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { useDimensions } from "hooks/useDimensions";
import { leaveBreadcrumb, SentryBreadcrumb } from "utils/errorReporting";
import { types } from ".";
import { useHistoryTable } from "./HistoryTableContext";
import EndOfHistoryRow from "./HistoryTableRow/EndOfHistoryRow";
import LoadingSection from "./LoadingSection";

interface HistoryTableProps {
  loadMoreItems: () => void;
  children: ({
    data,
    index,
  }: {
    index: number;
    data: types.CommitRowType;
  }) => React.ReactElement;
  finalRowCopy?: string;
  loading: boolean;
}
const HistoryTable: React.FC<HistoryTableProps> = ({
  children: Component,
  finalRowCopy,
  loadMoreItems,
  loading,
}) => {
  const {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    onChangeTableWidth,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    processedCommitCount,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    processedCommits,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    selectedCommit,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    visibleColumns,
  } = useHistoryTable();

  const listRef = useRef<VirtuosoHandle>(null);

  const ref = useRef<HTMLDivElement>(null);
  const size = useDimensions<HTMLDivElement>(ref);
  const throttledOnChangeTableWidth = useMemo(
    () => throttle(onChangeTableWidth, 400),
    [onChangeTableWidth],
  );

  useEffect(() => {
    if (size) {
      throttledOnChangeTableWidth(size.width);
    }
  }, [size, throttledOnChangeTableWidth]);

  useEffect(() => {
    if (selectedCommit?.loaded && listRef.current) {
      leaveBreadcrumb(
        "scrolling to selected commit",
        {
          selectedCommit,
        },
        SentryBreadcrumb.UI,
      );
      listRef.current.scrollToIndex(selectedCommit.rowIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCommit?.loaded]);

  // In order to jump to the selected commit, we need to first load the necessary amount of commits
  useEffect(() => {
    if (selectedCommit && !selectedCommit.loaded) {
      leaveBreadcrumb(
        "selectedCommit not loaded, loading more items",
        {
          selectedCommit,
          processedCommitCount,
        },
        SentryBreadcrumb.UI,
      );
      loadMoreItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processedCommitCount]);

  return (
    <div ref={ref} style={{ height: "100%" }}>
      <Virtuoso
        ref={listRef}
        components={{
          Footer: () =>
            loading ? (
              <LoadingSection
                numLoadingRows={10}
                numVisibleCols={visibleColumns.length}
              />
            ) : (
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              <EndOfHistoryRow>{finalRowCopy}</EndOfHistoryRow>
            ),
        }}
        data={processedCommits}
        endReached={() => {
          if (!loading) {
            loadMoreItems();
          }
        }}
        itemContent={(index, data) => <Component data={data} index={index} />}
        totalCount={processedCommitCount}
      />
    </div>
  );
};

export default HistoryTable;
