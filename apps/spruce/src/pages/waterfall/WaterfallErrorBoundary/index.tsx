import React, { ErrorInfo } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { TableSkeleton } from "@leafygreen-ui/skeleton-loader";
import { H1, InlineCode } from "@leafygreen-ui/typography";
import { Navigate } from "react-router-dom";
import { size } from "@evg-ui/lib/constants/tokens";
import { getWaterfallRoute } from "constants/routes";
import { reportError } from "utils/errorReporting";
import { VERSION_LIMIT } from "../styles";

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

class WaterfallErrorBoundary extends React.Component<
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

  static getDerivedStateFromError(
    error: Error,
  ): Partial<WaterfallErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error });
    reportError(new Error("An error occurred in the Waterfall page.", error), {
      tags: { component: "Waterfall", project: this.props.projectIdentifier },
      fingerprint: [errorInfo.componentStack],
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
                <Button onClick={this.handleResetPage} variant="primary">
                  Reset Page
                </Button>
              </ButtonsContainer>
            </InnerContainer>
          </Container>
          <TableSkeleton
            data-cy="waterfall-skeleton"
            numCols={VERSION_LIMIT + 1}
            numRows={15}
          />
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
  padding: 2rem;
  box-sizing: border-box;
  position: absolute;
  background-color: rgba(255, 255, 255, 0.8);
  width: 100%;
`;

const InnerContainer = styled.div`
  opacity: 1;
`;

const ButtonsContainer = styled.div`
  margin-top: ${size.l};
  display: flex;
  gap: 1rem;
`;

export default WaterfallErrorBoundary;