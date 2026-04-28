import { useEffect, useRef } from "react";
import { css } from "@leafygreen-ui/emotion";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { leaveBreadcrumb } from "@evg-ui/lib/utils/errorReporting";
import { getLocalStorageBoolean } from "@evg-ui/lib/utils/localStorage";
import { SentryBreadcrumbTypes } from "@evg-ui/lib/utils/sentry/types";
import { useLogWindowAnalytics } from "analytics";
import PaginatedVirtualList from "components/PaginatedVirtualList";
import StickyHeaders from "components/StickyHeaders";
import { QueryParams } from "constants/queryParams";
import { PRETTY_PRINT_BOOKMARKS, WRAP } from "constants/storageKeys";
import { useLogContext } from "context/LogContext";
import { useStickyHeaders } from "hooks/useStickyHeaders";
import { findLineIndex } from "utils/findLineIndex";

interface LogPaneProps {
  rowRenderer: (index: number) => React.ReactNode;
  rowCount: number;
}
const LogPane: React.FC<LogPaneProps> = ({ rowCount, rowRenderer }) => {
  const {
    failingLine,
    listRef,
    preferences,
    processedLogLines,
    scrollToLine,
    sectioning,
  } = useLogContext();
  const { sendEvent } = useLogWindowAnalytics();
  const {
    jumpToFailingLineEnabled,
    sectionsEnabled,
    setPrettyPrint,
    setWrap,
    stickyHeaders: stickyHeadersPreference,
    zebraStriping,
  } = preferences;
  const [shareLine] = useQueryParam<number | undefined>(
    QueryParams.ShareLine,
    undefined,
  );
  const performedScroll = useRef(false);

  const {
    getScrollOffsetForLine,
    onStickyHeaderHeightChange,
    stickyHeaders,
    updateStickyHeaders,
  } = useStickyHeaders(processedLogLines);

  const stickyHeadersEnabled =
    stickyHeadersPreference && sectioning.sectioningEnabled;

  useEffect(() => {
    if (listRef.current && !performedScroll.current) {
      // Use a timeout to execute certain actions after the log pane has rendered. All of the
      // code below describes one-time events.
      const timeoutId = setTimeout(() => {
        const jumpToLine =
          shareLine ?? (jumpToFailingLineEnabled ? failingLine : undefined);
        const initialScrollIndex = findLineIndex(processedLogLines, jumpToLine);
        if (initialScrollIndex > -1) {
          leaveBreadcrumb(
            "Triggered initial scroll",
            { failingLine, initialScrollIndex, shareLine },
            SentryBreadcrumbTypes.User,
          );
          scrollToLine(initialScrollIndex);
        } else {
          leaveBreadcrumb(
            "shareLine or failingLine not provided or found in processedLogLines",
            { failingLine, shareLine },
            SentryBreadcrumbTypes.UI,
          );
        }
        // Wrap and pretty print can be enabled after the log pane has initially loaded.
        if (getLocalStorageBoolean(WRAP)) {
          setWrap(true);
        }
        if (getLocalStorageBoolean(PRETTY_PRINT_BOOKMARKS)) {
          setPrettyPrint(true);
        }
        performedScroll.current = true;
        sendEvent({
          name: "Viewed log with sections and jump to failing line",
          "settings.jump_to_failing_line.enabled": jumpToFailingLineEnabled,
          "settings.sections.enabled": sectionsEnabled,
        });
      }, 100);
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    listRef,
    performedScroll,
    jumpToFailingLineEnabled,
    sectionsEnabled,
    processedLogLines,
    sendEvent,
  ]);

  const stickyHeadersProps = stickyHeadersEnabled
    ? {
        getScrollOffset: getScrollOffsetForLine,
        onRangeChanged: ({ startIndex }: { startIndex: number }) =>
          updateStickyHeaders(startIndex),
        overscan: 0,
      }
    : { overscan: 300 };

  return (
    <>
      {stickyHeadersEnabled ? (
        <StickyHeaders
          onHeightChange={onStickyHeaderHeightChange}
          stickyHeaders={stickyHeaders}
        />
      ) : null}
      <PaginatedVirtualList
        ref={listRef}
        className={zebraStriping ? zebraStripingStyles : undefined}
        paginationOffset={200}
        paginationThreshold={500000}
        rowCount={rowCount}
        rowRenderer={rowRenderer}
        {...stickyHeadersProps}
      />
    </>
  );
};

const zebraStripingStyles = css`
  div[data-index]:nth-child(2n) {
    background-color: rgba(0, 0, 0, 0.07);
  }
`;

LogPane.displayName = "VirtuosoLogPane";

export default LogPane;
