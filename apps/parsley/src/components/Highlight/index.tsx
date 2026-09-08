import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";

const { blue, green, purple, red, yellow } = palette;

const highlightColorList = [
  green.light1,
  blue.light2,
  red.light3,
  yellow.light2,
  green.light2,
  purple.light2,
  blue.light1,
  green.light3,
  red.light2,
];

const highlightColors = new Set<string>(highlightColorList);

const Highlight = styled.mark<{ color?: string }>`
  background-color: ${({ color }) =>
    color && highlightColors.has(color) ? color : red.light2};
  font-weight: bold;
`;

export { highlightColorList };
export default Highlight;
