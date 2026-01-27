import { forwardRef } from "react";
import LeafyGreenButton, { ButtonProps } from "@leafygreen-ui/button";
import Icon from "@evg-ui/lib/components/Icon";

export const PlusButton = forwardRef<HTMLDivElement, ButtonProps>(
  ({ leftGlyph, ...rest }, ref) => (
    <LeafyGreenButton ref={ref} leftGlyph={<Icon glyph="Plus" />} {...rest} />
  ),
);

PlusButton.displayName = "PlusButton";
