import { ComponentType } from "react";
import styled from "@emotion/styled";
import { Tabs, TabsProps } from "@leafygreen-ui/tabs";
import { size } from "@evg-ui/lib/constants/tokens";

export const StyledTabs = styled(Tabs)<TabsProps>`
  > div > [role="tablist"] {
    margin-bottom: ${size.s};
  }
` as ComponentType<TabsProps>;
