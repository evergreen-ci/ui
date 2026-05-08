import { forwardRef } from "react";
import { Button as LeafyGreenButton, ButtonProps } from "@leafygreen-ui/button";
import { Spinner } from "@leafygreen-ui/loading-indicator/spinner";

export type LoadingButtonProps = Omit<ButtonProps, "isLoading"> & {
  loading?: boolean;
};

export const LoadingButton = forwardRef<HTMLElement, LoadingButtonProps>(
  ({ loading = false, ...rest }, ref) => (
    <LeafyGreenButton
      ref={ref}
      isLoading={loading}
      loadingIndicator={<Spinner />}
      {...rest}
    />
  ),
);

LoadingButton.displayName = "LoadingButton";
