import { lazy } from "react";
import styled from "@emotion/styled";
import { BasicEmptyState } from "@leafygreen-ui/empty-state";
import { size } from "@evg-ui/lib/constants/tokens";
import AIChatModule from "components/AiChatModule";
import BookmarksBar from "components/BookmarksBar";
import LogPane from "components/LogPane";
import { ParsleyRow } from "components/LogRow/RowRenderer";
import SidePanel from "components/SidePanel";
import SubHeader from "components/SubHeader";
import { AiChatProvider } from "context/AiChatProviderContext";
import { useLogContext } from "context/LogContext";

const SectionsFeatureModal = lazy(
  () => import("components/SectionsFeatureModal"),
);

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
  return (
    <Container data-cy="log-window">
      <SectionsFeatureModal />
      <SidePanel
        clearExpandedLines={clearExpandedLines}
        collapseLines={collapseLines}
        expandedLines={expandedLines}
      />
      <BookmarksBar
        failingLine={failingLine}
        lineCount={lineCount}
        scrollToLine={openSectionAndScrollToLine}
      />
      <ColumnContainer>
        <SubHeader />
        <LogPaneContainer>
          {hasLogs && processedLogLines.length && (
            <LogPane
              rowCount={processedLogLines.length}
              rowRenderer={ParsleyRow({
                processedLogLines,
              })}
            />
          )}
          {hasLogs === false && (
            <BasicEmptyState
              description="No logs were found for this resource"
              title="No Logs Found"
            />
          )}
        </LogPaneContainer>
      </ColumnContainer>
      <AiChatProvider>
        <FloatingChatModuleContainer>
          <AIChatModule />
        </FloatingChatModuleContainer>
      </AiChatProvider>
    </Container>
  );
};

const FloatingChatModuleContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 1000;
  margin: ${size.m} ${size.m};
`;
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
`;

export default LogWindow;
