import styled from "@emotion/styled";
import { IconButton } from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import { Icon } from "@evg-ui/lib/components/Icon";
import { transitionDuration } from "@evg-ui/lib/constants/tokens";

const { gray } = palette;

interface Props {
  onClick: () => void;
  open: boolean;
}
const CaretToggle: React.FC<Props> = ({ onClick, open }) => (
  <IconButton
    aria-label={`${open ? "Close" : "Open"} section`}
    data-testid="caret-toggle"
    onClick={onClick}
  >
    <AnimatedIcon fill={gray.dark1} glyph="ChevronRight" open={open} />
  </IconButton>
);

const AnimatedIcon = styled(Icon)<{ open: boolean }>`
  transform: ${({ open }): string => (open ? "rotate(90deg)" : "unset")};
  transition-property: transform;
  transition-duration: ${transitionDuration.default}ms;
`;

export { CaretToggle };
