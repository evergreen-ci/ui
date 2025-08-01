import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { Menu, MenuItem } from "@leafygreen-ui/menu";
import pluralize from "pluralize";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { copyToClipboard } from "@evg-ui/lib/utils/string";
import { useLogWindowAnalytics } from "analytics";
import { QueryParams, urlParseOptions } from "constants/queryParams";
import { useLogContext } from "context/LogContext";
import { useMultiLineSelectContext } from "context/MultiLineSelectContext";
import { getJiraFormat } from "utils/string";
import { getLinesInProcessedLogLinesFromSelectedLines } from "./utils";

const SharingMenu: React.FC = () => {
  const {
    clearSelection,
    openMenu: open,
    selectedLines,
    setOpenMenu: setOpen,
  } = useMultiLineSelectContext();
  const { getLine, isUploadedLog, processedLogLines } = useLogContext();
  const [params, setParams] = useQueryParams(urlParseOptions);
  const dispatchToast = useToastContext();
  const { sendEvent } = useLogWindowAnalytics();
  const setMenuOpen = () => {
    sendEvent({ name: "Toggled share menu", open });
    setOpen(!open);
  };

  const handleCopySelectedLines = async () => {
    const { startingLine } = selectedLines;
    if (startingLine === undefined) return;
    // Create an array of line numbers that represent the range in selectedLines
    const lineNumbers = getLinesInProcessedLogLinesFromSelectedLines(
      processedLogLines,
      selectedLines,
    );

    await copyToClipboard(getJiraFormat(lineNumbers, getLine));
    setOpen(false);
    sendEvent({
      name: "Clicked copy share lines to clipboard button",
    });
    dispatchToast.success(
      `Copied ${pluralize("line", lineNumbers.length, true)} to clipboard`,
    );
  };

  const handleOnlySearchOnRange = () => {
    const { endingLine, startingLine } = selectedLines;
    if (startingLine === undefined || endingLine === undefined) return;
    setParams({
      ...params,
      [QueryParams.LowerRange]: startingLine,
      [QueryParams.UpperRange]: endingLine,
    });
    setOpen(false);
    sendEvent({
      name: "Used range limit for search",
    });
  };

  const handleShareLinkToSelectedLines = async () => {
    const { startingLine } = selectedLines;
    if (startingLine === undefined) return;
    // Take the current URL and add the shareLine query param
    const url = new URL(window.location.href);
    url.searchParams.set(QueryParams.ShareLine, startingLine.toString());

    await copyToClipboard(url.toString());
    setOpen(false);
    sendEvent({ name: "Clicked copy share link button" });
    dispatchToast.success("Copied link to clipboard");
  };

  const lineCount =
    selectedLines.endingLine === undefined ||
    selectedLines.startingLine === undefined
      ? 1
      : selectedLines.endingLine - selectedLines.startingLine + 1;

  return (
    <StyledMenu
      align="right"
      data-cy="sharing-menu"
      open={open}
      setOpen={setMenuOpen}
      trigger={
        // @ts-expect-error: Styled LeafyGreen component throws an error
        <MenuIcon
          aria-label="Expand share menu"
          data-cy="sharing-menu-button"
          onClick={setMenuOpen}
        >
          <Icon glyph="Ellipsis" />
        </MenuIcon>
      }
    >
      <MenuItem
        glyph={<Icon glyph="Copy" />}
        onClick={handleCopySelectedLines}
        title={`Copy the selected ${pluralize(
          "line",
          lineCount,
        )} to your clipboard with JIRA formatting.`}
      >
        Copy selected contents
      </MenuItem>
      {!isUploadedLog && (
        <MenuItem
          glyph={<Icon glyph="Export" />}
          onClick={handleShareLinkToSelectedLines}
          title={`Copy a link to ${pluralize("this", lineCount)} ${pluralize(
            "line",
            lineCount,
          )}.`}
        >
          Copy share link to selected {pluralize("line", lineCount)}
        </MenuItem>
      )}
      <MenuItem
        glyph={<Icon glyph="MagnifyingGlass" />}
        onClick={handleOnlySearchOnRange}
        title="Limit the range Parsley will search to only these lines."
      >
        Only search on range
      </MenuItem>
      <MenuItem
        glyph={<Icon glyph="Trash" />}
        onClick={clearSelection}
        title="Clear the selected lines."
      >
        Clear selection
      </MenuItem>
    </StyledMenu>
  );
};

const MenuIcon = styled(IconButton)`
  height: 16px;
  width: 16px;
  margin-left: ${size.xxs};
`;

const StyledMenu = styled(Menu)`
  width: fit-content;
`;
export default SharingMenu;
