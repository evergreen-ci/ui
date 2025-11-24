import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { Card } from "@leafygreen-ui/card";
import { ParagraphSkeleton } from "@leafygreen-ui/skeleton-loader";
import { size } from "@evg-ui/lib/constants/tokens";
import { ErrorWrapper } from "components/ErrorWrapper";

interface Props {
  error?: ApolloError;
  loading?: boolean;
  metaData: boolean;
  children: React.ReactNode;
}
interface StylingProps {
  metaData: boolean;
}

export const HostCard: React.FC<Props> = ({
  children,
  error,
  loading,
  metaData,
}) => (
  <SiderCard metaData={metaData}>
    {loading && <ParagraphSkeleton />}
    {error && (
      <ErrorWrapper data-cy="metadata-card-error">{error.message}</ErrorWrapper>
    )}
    {children}
  </SiderCard>
);

const SiderCard = styled(Card)<StylingProps>`
  padding: ${size.s} 0;
  margin-bottom: ${size.l};
  padding-right: ${(props) => (props.metaData ? 0 : size.m)};
  padding-left: ${(props) => (props.metaData ? size.s : size.m)};
  margin-left: ${(props) => (props.metaData ? 0 : size.m)};
  margin-right: ${(props) => (props.metaData ? 0 : size.m)};
  > * {
    ${(props) => props.metaData && `margin-top: ${size.s}`};
  }
`;
