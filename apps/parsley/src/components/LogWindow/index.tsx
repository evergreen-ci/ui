import { useState } from "react";
import styled from "@emotion/styled";
import { BasicEmptyState } from "@leafygreen-ui/empty-state";
import Cookie from "js-cookie";
import { useChatContext } from "@evg-ui/fungi";
import { CharKey } from "@evg-ui/lib/constants/keys";
import { useKeyboardShortcut } from "@evg-ui/lib/hooks";
import BookmarksBar from "components/BookmarksBar";
import { Chatbot } from "components/Chatbot";
import LogPane from "components/LogPane";
import { ParsleyRow } from "components/LogRow/RowRenderer";
import SidePanel from "components/SidePanel";
import SubHeader from "components/SubHeader";
import { DRAWER_OPENED } from "constants/cookies";
import { useLogContext } from "context/LogContext";
import { useIsParsleyAIAvailable } from "hooks";

const LogWindow: React.FC = () => {
  const {
    clearExpandedLines,
    collapseLines,
    expandedLines,
    failingLine,
    hasLogs,
    lineCount,
    openSectionAndScrollToLine,
    processedLogLines,
  } = useLogContext();

  const rowRenderer = ParsleyRow({ processedLogLines });

  const [sidePanelCollapsed, setSidePanelCollapsed] = useState<boolean>(
    Cookie.get(DRAWER_OPENED) === "true",
  );

  const { drawerOpen, setDrawerOpen } = useChatContext();
  const isParsleyAIAvailable = useIsParsleyAIAvailable();

  useKeyboardShortcut(
    { charKey: CharKey.BracketRight },
    () => {
      if (!drawerOpen) {
        setSidePanelCollapsed(true);
      }
      setDrawerOpen((o) => !o);
    },
    { disabled: !isParsleyAIAvailable, ignoreFocus: true },
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
