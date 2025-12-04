import { forwardRef } from "react";
import LeafyGreenButton, { ButtonProps } from "@leafygreen-ui/button";
import { Spinner } from "@leafygreen-ui/loading-indicator/spinner";

type Props = Omit<ButtonProps, "isLoading"> & {
  loading?: boolean;
};

export const LoadingButton = forwardRef<HTMLDivElement, Props>(
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
