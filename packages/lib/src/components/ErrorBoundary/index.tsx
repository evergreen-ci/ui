import { isInitialized } from "@sentry/core";
import DefaultErrorBoundary from "./DefaultErrorBoundary";
import SentryErrorBoundary from "./SentryErrorBoundary";

/**
 * `ErrorBoundary` is a wrapper around the `DefaultErrorBoundary` and `SentryErrorBoundary` components. It decides which
 * error boundary to use based on whether Sentry is initialized or not.
 * @param param0 - The props
 * @param param0.children - The children
 * @param param0.homeURL - The home URL of the application.
 * @returns - The wrapped component.
 */
const ErrorBoundary: React.FC<{
  children: React.ReactNode;
  homeURL: string;
}> = ({ children, homeURL }) => {
  const shouldUseSentry = isInitialized();

  if (shouldUseSentry) {
    return (
      <SentryErrorBoundary homeURL={homeURL}>{children}</SentryErrorBoundary>
    );
  }
  return (
    <DefaultErrorBoundary homeURL={homeURL}>{children}</DefaultErrorBoundary>
  );
};

export default ErrorBoundary;
