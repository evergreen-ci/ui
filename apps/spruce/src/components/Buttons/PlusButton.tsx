import { forwardRef } from "react";
import { ButtonProps, Button as LeafyGreenButton } from "@leafygreen-ui/button";
import Plus from "@via-ds/icons/Plus";

export const PlusButton = forwardRef<HTMLDivElement, ButtonProps>(
  ({ leftGlyph, ...rest }, ref) => (
    <LeafyGreenButton ref={ref} leftGlyph={<Plus />} {...rest} />
  ),
);

PlusButton.displayName = "PlusButton";
