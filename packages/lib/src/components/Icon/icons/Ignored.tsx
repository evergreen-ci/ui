import { LeafygreenIconProps } from "../types";

export const Ignored: React.ComponentType<LeafygreenIconProps> = ({
  className,
  "data-cy": dataCy,
  fill,
  size = 16,
}) => (
  <svg
    aria-label="Ignored Icon"
    className={className}
    data-cy={dataCy}
    fill="currentColor"
    height={size}
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clipRule="evenodd"
      d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12ZM5 7a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H5Z"
      fill={fill}
      fillRule="evenodd"
    />
  </svg>
);
