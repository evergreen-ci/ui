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
      color: ${gray.dark2};
      content: "#";
      margin-left: ${size.xs};
      opacity: 1;
      transition: opacity 0.2s ease-in-out;
    }
  }

  ::after {
    color: ${gray.dark2};
    content: "#";
    margin-left: ${size.xs};
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }
`;

export const formComponentSpacingCSS = "margin-bottom: 48px;";

export const SettingsCard = styled(Card)`
  padding: ${size.m};

  ${formComponentSpacingCSS}
`;
