import { palette } from "@leafygreen-ui/palette";
import { styled } from "@linaria/react";

const { blue, green, purple, red, yellow } = palette;

interface HighlightProps extends React.ComponentPropsWithoutRef<"mark"> {
  color?: string;
}

interface HighlightStyle extends React.CSSProperties {
  "--highlight-color": string;
}

const getHighlightStyle = (
  color: string,
  style?: React.CSSProperties,
): HighlightStyle => ({
  ...style,
  "--highlight-color": color,
});

const Highlight: React.FC<HighlightProps> = ({
  color = palette.red.light2,
  style,
  ...props
}) => (
  <StyledHighlight
    {...props}
    color={color}
    style={getHighlightStyle(color, style)}
  />
);

const StyledHighlight = styled.mark<{ color?: string }>`
  background-color: var(--highlight-color);
  font-weight: bold;
`;

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

export { highlightColorList };
export default Highlight;
