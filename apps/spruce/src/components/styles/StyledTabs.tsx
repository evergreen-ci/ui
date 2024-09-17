import styled from "@emotion/styled";
import { Tabs } from "@leafygreen-ui/tabs";
import { size } from "constants/tokens";

export const StyledTabs = styled(Tabs)`
  > div {
    margin-bottom: ${size.s};
  }
`;
