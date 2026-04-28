import styled from "@emotion/styled";
import { Menu, MenuItem } from "@leafygreen-ui/menu";
import pluralize from "pluralize";
import { useChatContext } from "@evg-ui/fungi";
import Icon from "@evg-ui/lib/components/Icon";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useQueryParam, useQueryParams } from "@evg-ui/lib/hooks";
import {
  getLocalStorageString,
  setLocalStorageString,
} from "@evg-ui/lib/utils/localStorage";
import { copyToClipboard } from "@evg-ui/lib/utils/string";
import { useLogWindowAnalytics } from "analytics";
import { CopyFormat } from "constants/enums";
import { QueryParams, urlParseOptions } from "constants/queryParams";
import { COPY_FORMAT } from "constants/storageKeys";
import { useLogContext } from "context/LogContext";
import { useMultiLineSelectContext } from "context/MultiLineSelectContext";
import { useIsParsleyAIAvailable } from "hooks/useIsParsleyAIAvailable";
import { getJiraFormat, getRawLines } from "utils/string";
import SharingMenuButton from "./SharingMenuButton";
import { getLinesInProcessedLogLinesFromSelectedLines } from "./utils";

interface SharingMenuProps {
  lineNumber: number;
}

const SharingMenu: React.FC<SharingMenuProps> = ({ lineNumber }) => {
  const {
    clearSelection,
    openMenu: open,
    selectedLines,
    setOpenMenu: setOpen,
  } = useMultiLineSelectContext();
  const { getLine, isUploadedLog, processedLogLines } = useLogContext();
  const { toggleChip } = useChatContext();
  const isParsleyAIAvailable = useIsParsleyAIAvailable();

  const [params, setParams] = useQueryParams(urlParseOptions);
  const [bookmarks, setBookmarks] = useQueryParam<number[]>(
    QueryParams.Bookmarks,
    [],
    urlParseOptions,
  );
  const [, setShareLine] = useQueryParam<number | undefined>(
    QueryParams.ShareLine,
    undefined,
    urlParseOptions,
  );
  const dispatchToast = useToastContext();
  const { sendEvent } = useLogWindowAnalytics();

  const handleAddToParsleyAI = async () => {
    const { endingLine, startingLine } = selectedLines;
    if (startingLine === undefined) return;

    const lineNumbers = getLinesInProcessedLogLinesFromSelectedLines(
      processedLogLines,
      selectedLines,
    );
    sendEvent({ name: "Clicked add to Parsley AI button" });
    setOpen(false);
    toggleChip({
      badgeLabel: endingLine
        ? `Lines ${startingLine}–${endingLine}`
        : `Line ${startingLine}`,
      content: getRawLines(lineNumbers, getLine),
      identifier: endingLine
        ? `lines-${startingLine}-to-${endingLine}`
        : `line-${startingLine}`,
      metadata: {
        endingLine,
        startingLine,
      },
    });
  };

  const handleCopySelectedLines = async () => {
    const { startingLine } = selectedLines;
    if (startingLine === undefined) return;
    // Create an array of line numbers that represent the range in selectedLines
    const lineNumbers = getLinesInProcessedLogLinesFromSelectedLines(
      processedLogLines,
      selectedLines,
    );

    const savedFormat = getLocalStorageString(COPY_FORMAT);
    const copyFormat =
      savedFormat === CopyFormat.Raw ? CopyFormat.Raw : CopyFormat.Jira;
    const getText = copyFormat === CopyFormat.Raw ? getRawLines : getJiraFormat;
    const formatLabel = copyFormat === CopyFormat.Raw ? "raw" : "Jira";

    await copyToClipboard(getText(lineNumbers, getLine));
    setLocalStorageString(COPY_FORMAT, copyFormat);
    setOpen(false);
    sendEvent({
      name: "Clicked copy share lines to clipboard button",
    });
    dispatchToast.success(
      `Copied ${pluralize("line", lineNumbers.length, true)} to clipboard (${formatLabel})`,
      true,
      { timeout: 5000 },
    );
  };

  const handleOnlySearchOnRange = () => {
    const { endingLine, startingLine } = selectedLines;
    if (startingLine === undefined) return;
    setParams({
      ...params,
      [QueryParams.LowerRange]: startingLine,
      [QueryParams.UpperRange]: endingLine ?? startingLine,
    });
    setOpen(false);
    sendEvent({
      name: "Used range limit for search",
    });
  };

  const handleToggleBookmark = () => {
    const { startingLine } = selectedLines;
    if (startingLine === undefined) return;

    if (bookmarks.includes(startingLine)) {
      const newBookmarks = bookmarks.filter((b) => b !== startingLine);
      setBookmarks(newBookmarks);
      sendEvent({ name: "Deleted bookmark" });
    } else {
      const newBookmarks = [...bookmarks, startingLine].sort((a, b) => a - b);
      setBookmarks(newBookmarks);
      sendEvent({ name: "Created bookmark" });
    }
    setOpen(false);
  };

  const isBookmarked =
    selectedLines.startingLine !== undefined &&
    bookmarks.includes(selectedLines.startingLine);

  const handleShareLinkToSelectedLines = async () => {
    const { startingLine } = selectedLines;
    if (startingLine === undefined) return;
    setShareLine(startingLine);
    const url = new URL(window.location.href);
    url.searchParams.set(QueryParams.ShareLine, startingLine.toString());

    await copyToClipboard(url.toString());
    setOpen(false);
    sendEvent({ name: "Clicked copy share link button" });
    dispatchToast.success("Copied link to clipboard", true, { timeout: 5000 });
  };

  return (
    <StyledMenu
      align="right"
      data-cy="sharing-menu"
      open={open}
      setOpen={setOpen}
      trigger={<SharingMenuButton lineNumber={lineNumber} />}
    >
      <MenuItem glyph={<Icon glyph="Trash" />} onClick={clearSelection}>
        Clear selection
      </MenuItem>
      {isParsleyAIAvailable && (
        <MenuItem
          glyph={<Icon glyph="Sparkle" />}
          onClick={handleAddToParsleyAI}
        >
          Add to Parsley AI
        </MenuItem>
      )}
      <MenuItem
        glyph={<Icon glyph="MagnifyingGlass" />}
        onClick={handleOnlySearchOnRange}
      >
        Only search on range
      </MenuItem>
      <MenuItem
        glyph={<Icon glyph={isBookmarked ? "Checkmark" : "Plus"} />}
        onClick={handleToggleBookmark}
      >
        {isBookmarked ? "Remove bookmark" : "Bookmark line"}
      </MenuItem>
      <MenuItem glyph={<Icon glyph="Copy" />} onClick={handleCopySelectedLines}>
        Copy selected contents
      </MenuItem>
      {!isUploadedLog && (
        <MenuItem
          glyph={<Icon glyph="Export" />}
          onClick={handleShareLinkToSelectedLines}
        >
          Copy share link
        </MenuItem>
      )}
    </StyledMenu>
  );
};

const StyledMenu = styled(Menu)`
  width: fit-content;
`;
export default SharingMenu;
