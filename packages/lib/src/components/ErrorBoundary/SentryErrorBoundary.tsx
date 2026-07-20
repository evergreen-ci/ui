import { ErrorBoundary } from "@sentry/react";
import { setScope } from "../../utils/sentry";
import { refreshOnOldBundleError } from "./utils";
/**
 * DO NOT USE THIS COMPONENT DIRECTLY INSTEAD USE `ErrorBoundary`.
 *
 * `SentryErrorBoundary` is a wrapper around the `ErrorBoundary` component from `@sentry/react`. It sets the scope
 * before capturing the error. This component is used in production builds.
 * @param param0 - The props
 * @param param0.children - The children
 * @param param0.homeURL - The home URL of the application.
 * @param param0.FallbackComponent - Custom fallback component.
 * @returns - The wrapped component.
 */
const SentryErrorBoundary: React.FC<{
  children: React.ReactNode;
  homeURL: string;
  FallbackComponent: React.ComponentType<{ homeURL: string }>;
}> = ({ FallbackComponent, children, homeURL }) => (
  <ErrorBoundary
    beforeCapture={(scope) => {
      setScope(scope);
    }}
    fallback={<FallbackComponent homeURL={homeURL} />}
    onError={(error) => refreshOnOldBundleError(error as Error)}
  >
    {children}
  </ErrorBoundary>
);

export default SentryErrorBoundary;
