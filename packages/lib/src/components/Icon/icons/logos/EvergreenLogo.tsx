import { palette } from "@leafygreen-ui/palette";
import { LeafygreenIconProps } from "../../types";

const { green } = palette;

export const EvergreenLogo: React.ComponentType<LeafygreenIconProps> = ({
  className,
  fill = green.dark1,
  size = 16,
}) => (
  <svg
    aria-label="Evergreen Icon"
    className={className}
    fill="none"
    height={size}
    viewBox="0 0 258 258"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M144.206 213.445H114.693C110.693 213.445 107.449 216.688 107.449 220.689V250.201C107.449 254.202 110.693 257.445 114.693 257.445H144.206C148.206 257.445 151.449 254.202 151.449 250.201V220.689C151.449 216.688 148.206 213.445 144.206 213.445Z"
      fill={fill}
    />
    <path
      d="M237.92 218.638L188.116 155.363H71.0083L20.5234 218.649C16.5211 224.712 20.8722 232.791 28.1364 232.791H230.312C237.582 232.791 241.933 224.701 237.92 218.638Z"
      fill={fill}
    />
    <path
      d="M208.375 146.21L167.82 89.1536H90.4297L49.6287 146.227C45.6264 152.289 49.9774 160.369 57.2417 160.369H200.767C208.037 160.369 212.388 152.278 208.375 146.216V146.21Z"
      fill={fill}
    />
    <path
      d="M184.463 79.9953L132.867 2.05749C131.048 -0.689405 127.019 -0.684039 125.2 2.06286L73.7767 80.006C69.7744 86.0685 74.1254 94.1482 81.3897 94.1482H176.85C184.119 94.1482 188.47 86.0577 184.457 79.9953H184.463Z"
      fill={fill}
    />
  </svg>
);
