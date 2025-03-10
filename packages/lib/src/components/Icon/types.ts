import type { Size } from "@leafygreen-ui/icon";

export interface LeafygreenIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | (typeof Size)[keyof typeof Size];
  role?: "presentation" | "img";
  ["data-cy"]?: string;
}
