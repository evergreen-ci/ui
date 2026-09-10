import { ComponentProps, forwardRef } from "react";
import { Button, Size as ViaSize } from "@via-ds/components";

type ViaButtonProps = ComponentProps<typeof Button>;

export type LoadingButtonProps = Omit<
  ViaButtonProps,
  "isPending" | "isDisabled" | "title" | "size"
> & {
  loading?: boolean;
  disabled?: boolean;
  title?: string;
  size?: string;
};

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ disabled = false, loading = false, size, ...rest }, ref) => (
    <Button
      ref={ref}
      isDisabled={disabled}
      isPending={loading}
      size={size as ViaSize}
      {...rest}
    />
  ),
);

LoadingButton.displayName = "LoadingButton";
