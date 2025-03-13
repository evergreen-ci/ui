import { palette } from "@leafygreen-ui/palette";
import { LeafygreenIconProps } from "../types";

const { black } = palette;

export const Expand: React.ComponentType<LeafygreenIconProps> = ({
  className,
  fill = black,
  size = 16,
}) => (
  <svg
    aria-label="Expand Icon"
    className={className}
    fill="none"
    height={size}
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 3v2.5a.5.5 0 1 1-1 0V4l-2.5 2.5a.707.707 0 0 1-1-1L12 3h-1.5a.5.5 0 1 1 0-1H13a1 1 0 0 1 1 1Z"
      fill={fill}
    />
    <path
      d="M12 3h-1.5a.5.5 0 1 1 0-1H13a1 1 0 0 1 1 1v2.5a.5.5 0 0 1-1 0V4m-1-1a1 1 0 0 1 1 1m-1-1L9.5 5.5a.707.707 0 0 0 1 1L13 4"
      stroke={fill}
    />
    <path
      d="M2 12V9a.5.5 0 1 1 1 0v2l2.5-2.5a.707.707 0 1 1 1 1L4 12h1.5a.5.5 0 1 1 0 1H3a1 1 0 0 1-1-1Z"
      fill={fill}
    />
    <path
      d="M4 12h1.5a.5.5 0 0 1 0 1H3a1 1 0 0 1-1-1V9a.5.5 0 0 1 1 0v2m1 1a1 1 0 0 1-1-1m1 1 2.5-2.5a.707.707 0 1 0-1-1L3 11"
      stroke={fill}
    />
  </svg>
);
