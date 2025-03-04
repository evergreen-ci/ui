import { LeafygreenIconProps } from "../../types";

export const KnownFailure: React.ComponentType<LeafygreenIconProps> = ({
  className,
  fill,
  size = 16,
}) => (
  <svg
    aria-label="Known failure Icon"
    className={className}
    fill="none"
    height={size}
    viewBox="0 0 21 21"
    width={size}
  >
    <path
      d="M9.38138 6.37605L10.0001 6.99477L10.6188 6.37605L15.5686 1.42631C16.0079 0.986967 16.7202 0.986967 17.1596 1.42631L18.5738 2.84052C19.0131 3.27986 19.0131 3.99217 18.5738 4.43151L13.624 9.38126L13.0053 9.99998L13.624 10.6187L18.5738 15.5684C19.0131 16.0078 19.0131 16.7201 18.5738 17.1594L17.1596 18.5736C16.7202 19.013 16.0079 19.013 15.5686 18.5736L10.6188 13.6239L10.0001 13.0052L9.38138 13.6239L4.43163 18.5736C3.99229 19.013 3.27998 19.013 2.84064 18.5736L1.42643 17.1594C0.98709 16.7201 0.987089 16.0078 1.42643 15.5684L6.37618 10.6187L6.99489 9.99998L6.37618 9.38126L1.42643 4.43151C0.987089 3.99217 0.987089 3.27986 1.42643 2.84052L2.84064 1.42631C3.27998 0.986967 3.99229 0.986967 4.43163 1.42631L9.38138 6.37605Z"
      stroke={fill}
      strokeWidth="1.75"
    />
  </svg>
);
