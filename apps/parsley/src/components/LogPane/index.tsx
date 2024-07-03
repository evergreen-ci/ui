import { useEffect, useRef, useState } from "react";
import { css } from "@leafygreen-ui/emotion";
import Cookies from "js-cookie";
import { ListRange } from "react-virtuoso";
import PaginatedVirtualList from "components/PaginatedVirtualList";
import { PRETTY_PRINT_BOOKMARKS, WRAP } from "constants/cookies";
import { QueryParams } from "constants/queryParams";
import { useLogContext } from "context/LogContext";
import { useMaintainLineVisibilityAfterTogglingFilter } from "hooks/useMaintainLineVisibilityAfterTogglingFilter";
import { useParsleySettings } from "hooks/useParsleySettings";
import { useQueryParam } from "hooks/useQueryParam";
import { SentryBreadcrumb, leaveBreadcrumb } from "utils/errorReporting";
import { findLineIndex } from "utils/findLineIndex";

interface LogPaneProps {
  rowRenderer: (index: number) => React.ReactNode;
  rowCount: number;
}
const LogPane: React.FC<LogPaneProps> = ({ rowCount, rowRenderer }) => {
  const [visibleRange, setVisibleRange] = useState<ListRange | undefined>();
  const { failingLine, listRef, preferences, processedLogLines, scrollToLine } =
    useLogContext();
  const { setPrettyPrint, setWrap, zebraStriping } = preferences;
  const { settings } = useParsleySettings();
  useMaintainLineVisibilityAfterTogglingFilter({ visibleRange });
  const [shareLine] = useQueryParam<number | undefined>(
    QueryParams.ShareLine,
    undefined,
  );
  const performedScroll = useRef(false);

  useEffect(() => {
    if (listRef.current && !performedScroll.current && settings) {
      // Use a timeout to execute certain actions after the log pane has rendered. All of the
      // code below describes one-time events.
      setTimeout(() => {
        const jumpToLine =
          shareLine ??
          (settings.jumpToFailingLineEnabled ? failingLine : undefined);
        const initialScrollIndex = findLineIndex(processedLogLines, jumpToLine);
        if (initialScrollIndex > -1) {
          leaveBreadcrumb(
            "Triggered initial scroll",
            { failingLine, initialScrollIndex, shareLine },
            SentryBreadcrumb.User,
          );
          scrollToLine(initialScrollIndex);
        } else {
          leaveBreadcrumb(
            "shareLine or failingLine not provided or found in processedLogLines",
            { failingLine, shareLine },
            SentryBreadcrumb.UI,
          );
        }
        // Wrap and pretty print can be enabled after the log pane has initially loaded.
        if (Cookies.get(WRAP) === "true") {
          setWrap(true);
        }
        if (Cookies.get(PRETTY_PRINT_BOOKMARKS) === "true") {
          setPrettyPrint(true);
        }
        performedScroll.current = true;
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listRef, performedScroll, settings]);

  return (
    <PaginatedVirtualList
      ref={listRef}
      className={zebraStriping ? zebraStripingStyles : undefined}
      paginationOffset={200}
      paginationThreshold={500000}
      rangeChanged={setVisibleRange}
      rowCount={rowCount}
      rowRenderer={rowRenderer}
    />
  );
};

const zebraStripingStyles = css`
  div[data-index]:nth-child(2n) {
    background-color: rgba(0, 0, 0, 0.07);
  }
`;

LogPane.displayName = "VirtuosoLogPane";

export default LogPane;
