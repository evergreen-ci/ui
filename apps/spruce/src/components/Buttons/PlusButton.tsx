import { ComponentProps, forwardRef, type ReactNode } from "react";
import { Button, Size as ViaSize } from "@via-ds/components";
import Icon from "@evg-ui/lib/components/Icon";

type ViaButtonProps = ComponentProps<typeof Button>;

export const PlusButton = forwardRef<
  HTMLButtonElement,
  Omit<ViaButtonProps, "isDisabled" | "size"> & {
    disabled?: boolean;
    size?: string;
  }
>(({ children, disabled, size, ...rest }, ref) => (
  <Button ref={ref} isDisabled={disabled} size={size as ViaSize} {...rest}>
    <Icon glyph="Plus" role="presentation" />
    {children as ReactNode}
  </Button>
));

PlusButton.displayName = "PlusButton";
