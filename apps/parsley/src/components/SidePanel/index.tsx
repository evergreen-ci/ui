import styled from "@emotion/styled";
import { SideNav } from "@leafygreen-ui/side-nav";
import { size } from "@evg-ui/lib/constants/tokens";
import { DRAWER_OPENED } from "constants/storageKeys";
import { ExpandedLines } from "types/logs";
import { setLocalStorageBoolean } from "utils/localStorage";
import {
  ExpandedNavGroup,
  FilterNavGroup,
  HighlightNavGroup,
} from "./NavGroup";

interface SidePanelProps {
  ["data-cy"]?: string;
  expandedLines: ExpandedLines;
  collapseLines: (idx: number) => void;
  clearExpandedLines: () => void;
  panelCollapsed: boolean;
  setPanelCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidePanel: React.FC<SidePanelProps> = ({
  clearExpandedLines,
  collapseLines,
  "data-cy": dataCy,
  expandedLines,
  panelCollapsed,
  setPanelCollapsed,
}) => (
  <StyledSideNav
    aria-label="Side panel"
    collapsed={panelCollapsed}
    data-cy={dataCy}
    setCollapsed={(collapse) => {
      // panelCollapsed represents the initial state of the sidenav
      setLocalStorageBoolean(DRAWER_OPENED, !panelCollapsed);
      setPanelCollapsed(collapse);
    }}
    widthOverride={290}
  >
    <PaddedContainer>
      <FilterNavGroup clearExpandedLines={clearExpandedLines} />
      <ExpandedNavGroup
        collapseLines={collapseLines}
        expandedLines={expandedLines}
      />
      <HighlightNavGroup />
    </PaddedContainer>
  </StyledSideNav>
);

const StyledSideNav = styled(SideNav)`
  z-index: 2;
  box-shadow: 0 ${size.xxs} ${size.xxs} rgba(0, 0, 0, 0.25);
`;

const PaddedContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xs};
  padding: 0 ${size.xs};
`;

export default SidePanel;
