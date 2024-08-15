import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { H2, H2Props, Body, BodyProps } from "@leafygreen-ui/typography";
import { size, fontSize } from "constants/tokens";

const { gray, red } = palette;

export const PageWrapper = styled.div`
  grid-area: contents;
  overflow-x: hidden;
  overflow-y: scroll;
  padding: ${size.m} ${size.l};
`;

export const PageGrid = styled.div`
  display: grid;
  grid-template-areas:
    "header header"
    "sidenav contents";
  grid-template-columns: auto minmax(0, 1fr);
  grid-template-rows: auto 1fr;
  height: 100vh;
`;

export const PageLayout = styled.section<{ hasSider?: boolean }>`
  display: flex;
  flex: auto;
  flex-direction: ${({ hasSider }) => (hasSider ? "row" : "column")};
  min-height: 0;
`;
export const PageSider = styled.aside<{ width?: number }>`
  ${({ width = 275 }) => `
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

export const PageTitle = styled(H2)<H2Props>`
  margin-bottom: ${size.s};
`;

export const TableControlInnerRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TableControlOuterRow = styled(TableControlInnerRow)`
  padding-bottom: ${size.xs};
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

export const HR = styled.hr`
  background-color: ${gray.light2};
  border: 0;
  height: 1px;
  width: 100%;
  margin-top: ${size.m};
  margin-bottom: ${size.m};
`;
