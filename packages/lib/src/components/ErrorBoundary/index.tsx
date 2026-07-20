import { isInitialized } from "@sentry/core";
import DefaultErrorBoundary from "./DefaultErrorBoundary";
import ErrorFallback from "./ErrorFallback/ErrorFallback";
import SentryErrorBoundary from "./SentryErrorBoundary";

/**
 * `ErrorBoundary` is a wrapper around the `DefaultErrorBoundary` and `SentryErrorBoundary` components. It decides which
 * error boundary to use based on whether Sentry is initialized or not.
 * @param param0 - The props
 * @param param0.children - The children
 * @param param0.homeURL - The home URL of the application.
 * @param param0.FallbackComponent - Optional custom fallback component. Defaults to the built-in LeafyGreen ErrorFallback.
 * @returns - The wrapped component.
 */
export const ErrorBoundary: React.FC<{
  children: React.ReactNode;
  homeURL: string;
  FallbackComponent?: React.ComponentType<{ homeURL: string }>;
}> = ({ FallbackComponent = ErrorFallback, children, homeURL }) => {
  const shouldUseSentry = isInitialized();

  if (shouldUseSentry) {
    return (
      <SentryErrorBoundary
        FallbackComponent={FallbackComponent}
        homeURL={homeURL}
      >
        {children}
      </SentryErrorBoundary>
    );
  }
  return (
    <DefaultErrorBoundary
      FallbackComponent={FallbackComponent}
      homeURL={homeURL}
    >
      {children}
    </DefaultErrorBoundary>
  );
};
