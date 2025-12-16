import { useEffect, useRef } from "react";
import { css } from "@leafygreen-ui/emotion";
import Cookies from "js-cookie";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { leaveBreadcrumb } from "@evg-ui/lib/utils/errorReporting";
import { SentryBreadcrumbTypes } from "@evg-ui/lib/utils/sentry/types";
import { useLogWindowAnalytics } from "analytics";
import PaginatedVirtualList from "components/PaginatedVirtualList";
import StickyHeaders from "components/StickyHeaders";
import { PRETTY_PRINT_BOOKMARKS, WRAP } from "constants/cookies";
import { QueryParams } from "constants/queryParams";
import { useLogContext } from "context/LogContext";
import { useParsleySettings } from "hooks/useParsleySettings";
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
  const { setPrettyPrint, setWrap, stickyHeadersEnabled, zebraStriping } =
    preferences;
  const { settings } = useParsleySettings();
  const [shareLine] = useQueryParam<number | undefined>(
    QueryParams.ShareLine,
    undefined,
  );
  const performedScroll = useRef(false);

  const { onStickyHeaderHeightChange, stickyHeaders, updateStickyHeaders } =
    useStickyHeaders(processedLogLines);

  const applyStickyHeaders =
    stickyHeadersEnabled && sectioning.sectioningEnabled;

  useEffect(() => {
    if (listRef.current && !performedScroll.current && settings) {
      // Use a timeout to execute certain actions after the log pane has rendered. All of the
      // code below describes one-time events.
      const timeoutId = setTimeout(() => {
        const jumpToLine =
          shareLine ??
          (settings.jumpToFailingLineEnabled ? failingLine : undefined);
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
        if (Cookies.get(WRAP) === "true") {
          setWrap(true);
        }
        if (Cookies.get(PRETTY_PRINT_BOOKMARKS) === "true") {
          setPrettyPrint(true);
        }
        performedScroll.current = true;
        sendEvent({
          name: "Viewed log with sections and jump to failing line",
          "settings.jump_to_failing_line.enabled":
            settings.jumpToFailingLineEnabled,
          "settings.sections.enabled": settings.sectionsEnabled,
        });
      }, 100);
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listRef, performedScroll, settings, processedLogLines]);

  return (
    <>
      {applyStickyHeaders ? (
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
        updateStickyHeaders={updateStickyHeaders}
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
