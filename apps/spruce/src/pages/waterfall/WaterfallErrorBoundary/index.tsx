import React, { ErrorInfo } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Body } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";
import { reportError } from "utils/errorReporting";

interface WaterfallErrorBoundaryProps {
  children: React.ReactNode;
  projectIdentifier: string;
}

interface WaterfallErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class WaterfallErrorBoundary extends React.Component<
  WaterfallErrorBoundaryProps,
  WaterfallErrorBoundaryState
> {
  constructor(props: WaterfallErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
    this.handleTryAgain = this.handleTryAgain.bind(this);
  }

  static getDerivedStateFromError(
    error: Error,
  ): Partial<WaterfallErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Optionally log error details to an error reporting service
    this.setState({ error });
    reportError(new Error("An error occurred in the Waterfall page.", error), {
      tags: { component: "Waterfall", project: this.props.projectIdentifier },
      fingerprint: [errorInfo.componentStack],
    }).warning();
  }

  /**
   * Resets the error boundary so users can retry the failed action.
   */
  handleTryAgain = () => {
    this.setState({
      hasError: false,
      error: null,
    });
    window.location.reload();
  };

  static handleGoBack = () => {
    window.history.back();
  };

  render() {
    const { error, hasError } = this.state;
    if (hasError) {
      return (
        <Container>
          <HeadingContainer>Something went wrong.</HeadingContainer>
          <Body>{error?.message ?? "An unexpected error has occurred."}</Body>
          <ButtonsContainer>
            <Button onClick={this.handleTryAgain}>Try Again</Button>
            <Button onClick={WaterfallErrorBoundary.handleGoBack}>
              Go back to previous page
            </Button>
          </ButtonsContainer>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default WaterfallErrorBoundary;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem;
  box-sizing: border-box;
`;

const HeadingContainer = styled.div`
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: ${size.m};
`;

const ButtonsContainer = styled.div`
  margin-top: ${size.xl};
  display: flex;
  gap: 1rem;
`;
