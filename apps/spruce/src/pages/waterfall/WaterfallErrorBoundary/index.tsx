import React, { Component, ErrorInfo } from "react";
import styled from "@emotion/styled";
import { Button } from "@leafygreen-ui/button";
import { H1, InlineCode } from "@leafygreen-ui/typography";
import { Navigate } from "react-router-dom";
import { Icon } from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";
import { reportError } from "@evg-ui/lib/utils";
import { getWaterfallRoute } from "constants/routes";
import WaterfallSkeleton from "../WaterfallSkeleton";

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
          <Container>
            <InnerContainer>
              <H1>Oops! Something went wrong.</H1>
              <InlineCode>
                Error: {error?.message ?? "An unexpected error has occurred."}
              </InlineCode>
              <ButtonsContainer>
                <Button
                  onClick={this.handleResetPage}
                  rightGlyph={<Icon glyph="ArrowRight" />}
                  variant="primary"
                >
                  Return to waterfall
                </Button>
              </ButtonsContainer>
            </InnerContainer>
          </Container>
          <WaterfallSkeleton enableAnimations={false} />
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: ${size.s};
  box-sizing: border-box;
  position: absolute;
  background-color: rgba(255, 255, 255, 0.8);
  width: 98vw;
`;

const InnerContainer = styled.div`
  opacity: 1;
`;

const ButtonsContainer = styled.div`
  margin-top: ${size.l};
  display: flex;
  gap: ${size.s};
`;

export default WaterfallErrorBoundary;
