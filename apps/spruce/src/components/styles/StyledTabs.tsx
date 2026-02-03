import { ComponentType } from "react";
import styled from "@emotion/styled";
import { Tabs, TabsProps } from "@leafygreen-ui/tabs";
import { size } from "@evg-ui/lib/constants";

export const StyledTabs = styled(Tabs)<TabsProps>`
  [role="tabpanel"] {
    margin-top: ${size.s};
  }
` as ComponentType<TabsProps>;
