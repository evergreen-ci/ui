import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import { palette } from "@leafygreen-ui/palette";
import { H3, H3Props } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";

const { gray } = palette;

export const SettingsCardTitle = styled(H3)<H3Props>`
  margin: ${size.m} 0 ${size.s} 0;
  :hover {
    ::after {
      content: "#";
      margin-left: ${size.xs};
      color: ${gray.dark2};
    }
  }
`;

export const formComponentSpacingCSS = "margin-bottom: 48px;";

export const SettingsCard = styled(Card)`
  padding: ${size.m};

  ${formComponentSpacingCSS}
`;
