import React, { Component, ErrorInfo } from "react";
import { Button, H1, Text } from "@via-ds/components";
import { Navigate } from "react-router-dom";
import Icon from "@evg-ui/lib/components/Icon";
import { reportError } from "@evg-ui/lib/utils/errorReporting";
import { getWaterfallRoute } from "constants/routes";
import WaterfallSkeleton from "../WaterfallSkeleton";
import styles from "./index.module.css";

interface WaterfallErrorBoundaryProps {
  children: React.ReactNode;
  projectIdentifier: string;
}

interface WaterfallErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  redirect: boolean;
  redirectPath?: string;
}

class WaterfallErrorBoundary extends Component<
  WaterfallErrorBoundaryProps,
  WaterfallErrorBoundaryState
> {
  constructor(props: WaterfallErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      redirect: false,
      redirectPath: undefined,
    };
    this.handleResetPage = this.handleResetPage.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  componentDidUpdate(prevProps: WaterfallErrorBoundaryProps) {
    if (prevProps.projectIdentifier !== this.props.projectIdentifier) {
      this.resetState();
    }
  }

  static getDerivedStateFromError(
    error: Error,
  ): Partial<WaterfallErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error });
    reportError(new Error("An error occurred in the Waterfall page.", error), {
      tags: { component: "Waterfall", project: this.props.projectIdentifier },
      fingerprint: errorInfo.componentStack ? [errorInfo.componentStack] : [],
    }).warning();
  }

  resetState = () => {
    this.setState({
      hasError: false,
      error: null,
      redirect: false,
      redirectPath: undefined,
    });
  };

  handleResetPage = () => {
    this.setState({
      redirect: true,
      hasError: false,
      error: null,
      redirectPath: getWaterfallRoute(this.props.projectIdentifier),
    });
  };

  render() {
    const { error, hasError, redirect, redirectPath } = this.state;

    if (hasError) {
      return (
        <div>
          <div className={styles.container}>
            <div>
              <H1>Oops! Something went wrong.</H1>
              <Text textStyle="inlineCode">
                Error: {error?.message ?? "An unexpected error has occurred."}
              </Text>
              <div className={styles.buttonsContainer}>
                <Button onPress={this.handleResetPage} variant="primary">
                  Return to waterfall
                  <Icon glyph="ArrowRight" />
                </Button>
              </div>
            </div>
          </div>
          <WaterfallSkeleton />
        </div>
      );
    }
    if (redirect && redirectPath) {
      this.resetState();
      return <Navigate to={redirectPath} />;
    }
    return this.props.children;
  }
}

export default WaterfallErrorBoundary;
