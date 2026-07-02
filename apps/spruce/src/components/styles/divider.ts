import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { size } from "@evg-ui/lib/constants/tokens";

const { gray } = palette;

const Divider = styled.hr<{ margin?: string }>`
  background-color: ${gray.light2};
  border: 0;
  height: 1px;
  margin: ${({ margin }) => margin || `${size.xs} 0`};
`;

export { Divider };
