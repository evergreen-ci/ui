import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { H2, H2Props, Body, BodyProps } from "@leafygreen-ui/typography";
import { size, fontSize } from "@evg-ui/lib/constants/tokens";

const { gray, red } = palette;

export const navBarHeight = size.xl;

// Top-level layout for the entire site. Manages positioning of navbar.
export const SiteLayout = styled.div`
  display: flex;
  flex-flow: column;
  height: 100vh;
`;

// Layout elements for pages with a LeafyGreen SideNav
export const SideNavPageWrapper = styled.div`
  display: flex;
  overflow: hidden;
  height: calc(100vh - ${navBarHeight});
`;
export const SideNavPageContent = styled.div`
  overflow-x: hidden;
  overflow-y: scroll;
  flex-grow: 1;
  padding: ${size.m} ${size.l};
`;

// Layout elements for non-LG SideNav pages
export const PageWrapper = styled.div`
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  padding: ${size.m} ${size.l};
`;
export const PageLayout = styled.section<{ hasSider?: boolean }>`
  display: flex;
  flex: auto;
  flex-direction: ${({ hasSider }) => (hasSider ? "row" : "column")};
  min-height: 0;
`;

export const siderCardWidth = 275;

export const PageSider = styled.aside<{ width?: number }>`
  ${({ width = siderCardWidth }) => `
   max-width: ${width}px;
   min-width: ${width}px;
   width: ${width}px;
   `}
`;
export const PageContent = styled.main`
  flex: auto;
  margin-left: ${size.s};
  overflow: hidden;
`;

PageSider.defaultProps = { width: siderCardWidth };

export const PageTitle = styled(H2)<H2Props>`
  margin-bottom: ${size.s};
`;

export const PageButtonRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${size.xs};

  button {
    min-width: fit-content;
  }
`;

export const InputLabel = styled.label`
  font-size: ${fontSize.m};
  font-weight: bold;
  color: ${gray.dark2};
`;

export const ErrorMessage = styled(Body)<BodyProps>`
  color: ${red.base};
`;
