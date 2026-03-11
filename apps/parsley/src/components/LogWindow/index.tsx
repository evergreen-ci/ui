import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { BasicEmptyState } from "@leafygreen-ui/empty-state";
import { useChatContext } from "@evg-ui/fungi";
import { CharKey } from "@evg-ui/lib/constants/keys";
import { useKeyboardShortcut } from "@evg-ui/lib/hooks";
import { getLocalStorageBoolean } from "@evg-ui/lib/utils/localStorage";
import BookmarksBar from "components/BookmarksBar";
import { Chatbot } from "components/Chatbot";
import LogPane from "components/LogPane";
import { ParsleyRow } from "components/LogRow/RowRenderer";
import SidePanel from "components/SidePanel";
import SubHeader from "components/SubHeader";
import { DRAWER_OPENED } from "constants/storageKeys";
import { useLogContext } from "context/LogContext";
import { useIsParsleyAIAvailable } from "hooks";

const LogWindow: React.FC = () => {
  const {
    clearExpandedLines,
    collapseLines,
    expandedLines,
    failingLine,
    hasLogs,
    isUploadedLog,
    lineCount,
    openSectionAndScrollToLine,
    processedLogLines,
  } = useLogContext();

  const rowRenderer = ParsleyRow({ processedLogLines });

  const [sidePanelCollapsed, setSidePanelCollapsed] = useState<boolean>(
    getLocalStorageBoolean(DRAWER_OPENED, false),
  );

  const { drawerOpen, setDrawerOpen } = useChatContext();
  const isParsleyAIAvailable = useIsParsleyAIAvailable();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isUploadedLog) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isUploadedLog]);

  useKeyboardShortcut(
    { charKey: CharKey.BracketRight },
    () => {
      if (!drawerOpen) {
        setSidePanelCollapsed(true);
      }
      setDrawerOpen((o) => !o);
    },
    { disabled: !isParsleyAIAvailable },
  );

  return (
    <Container data-cy="log-window">
      <SidePanel
        clearExpandedLines={clearExpandedLines}
        collapseLines={collapseLines}
        expandedLines={expandedLines}
        panelCollapsed={sidePanelCollapsed}
        setPanelCollapsed={setSidePanelCollapsed}
      />
      <BookmarksBar
        failingLine={failingLine}
        lineCount={lineCount}
        scrollToLine={openSectionAndScrollToLine}
      />
      <ColumnContainer>
        <SubHeader setSidePanelCollapsed={setSidePanelCollapsed} />
        <Chatbot>
          <LogPaneContainer>
            {hasLogs && processedLogLines.length && (
              <LogPane
                rowCount={processedLogLines.length}
                rowRenderer={rowRenderer}
              />
            )}
            {hasLogs === false && (
              <BasicEmptyState
                description="No logs were found for this resource"
                title="No Logs Found"
              />
            )}
          </LogPaneContainer>
        </Chatbot>
      </ColumnContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  // ColumnContainer should take up the remaining page width after SidePanel & BookmarksBar.
  flex: 1 1 auto;
`;

const LogPaneContainer = styled.div`
  display: flex;
  flex-direction: column;
  // LogPaneContainer should take up the remaining page height after SubHeader.
  flex: 1 1 auto;
  height: 100%;
`;

export default LogWindow;
