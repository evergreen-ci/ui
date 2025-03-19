import { Component } from "react";
import ErrorFallback from "./ErrorFallback/ErrorFallback";

type DefaultErrorBoundaryProps = {
  children: React.ReactNode;
  homeURL: string;
};

/**
 * DO NOT USE THIS COMPONENT DIRECTLY INSTEAD USE `ErrorBoundary`.
 *
 * `DefaultErrorBoundary` is a generic Error Boundary component. This component is used in development builds.
 * @param param0 - The props
 * @param param0.children - The children
 * @param param0.homeURL - The home URL of the application.
 * @returns - The wrapped component.
 */
class DefaultErrorBoundary extends Component<
  DefaultErrorBoundaryProps,
  { hasError: boolean }
> {
  constructor(props: DefaultErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error({ error, errorInfo });
  }

  render() {
    const { hasError } = this.state;
    if (hasError) {
      return <ErrorFallback homeURL={this.props.homeURL} />;
    }
    const { children } = this.props;
    return children;
  }
}

export default DefaultErrorBoundary;
