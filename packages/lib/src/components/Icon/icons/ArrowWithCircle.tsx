import { LeafygreenIconProps } from "../types";

export const ArrowWithCircle: React.ComponentType<LeafygreenIconProps> = ({
  className,
  "data-cy": dataCy,
  onClick,
}) => (
  <svg
    aria-label="Arrow With Circle Icon"
    className={className}
    data-cy={dataCy}
    fill="none"
    height="14"
    onClick={onClick}
    width="14"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clipRule="evenodd"
      d="M7 14A7 7 0 1 0 7 0a7 7 0 0 0 0 14Zm1.512-7.909h-5.4a.778.778 0 0 0-.779.778v.263c0 .43.349.778.778.778H8.51L7.317 9.103a.778.778 0 0 0 0 1.1l.186.186a.778.778 0 0 0 1.1 0l2.84-2.84a.778.778 0 0 0 0-1.1l-.187-.186a.966.966 0 0 0-.02-.02L8.603 3.612a.778.778 0 0 0-1.1 0l-.186.186a.778.778 0 0 0 0 1.1L8.512 6.09Z"
      fill="#001E2B"
      fillRule="evenodd"
    />
  </svg>
);
