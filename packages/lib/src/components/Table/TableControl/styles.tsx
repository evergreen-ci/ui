import styled from "@emotion/styled";
import { size } from "../../../constants/tokens";

export const TableControlInnerRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TableControlOuterRow = styled(TableControlInnerRow)`
  padding-bottom: ${size.xs};
`;
