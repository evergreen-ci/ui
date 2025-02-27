import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { InfoSprinkle } from "@leafygreen-ui/info-sprinkle";
import { PolymorphicAs } from "@leafygreen-ui/polymorphic";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { wordBreakCss } from "@evg-ui/lib/components/styles";
import { ErrorWrapper } from "components/ErrorWrapper";
import { SiderCard } from "components/styles";
import { Divider } from "components/styles/divider";

interface Props {
  error?: ApolloError;
  loading?: boolean;
  children: React.ReactNode;
}

export const MetadataCard: React.FC<Props> = ({
  children,
  error,
  loading,
  ...rest
}) => (
  <SiderCard {...rest}>
    {loading && !error && (
      <Skeleton active paragraph={{ rows: 4 }} title={false} />
    )}
    {error && !loading && (
      <ErrorWrapper data-cy="metadata-card-error">{error.message}</ErrorWrapper>
    )}
    {!loading && !error && children}
  </SiderCard>
);

export const MetadataTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div>
    <Title weight="medium">{children}</Title>
    <Divider />
  </div>
);

interface ItemProps {
  as?: PolymorphicAs;
  children: React.ReactNode;
  "data-cy"?: string;
  description?: string;
}

export const MetadataItem: React.FC<ItemProps> = ({
  as = "p",
  children,
  "data-cy": dataCy,
  description,
}) => (
  <MetadataItemWrapper>
    <Item as={as} data-cy={dataCy}>
      {children}
    </Item>
    <span>
      {description && <InfoSprinkle align="right">{description}</InfoSprinkle>}
    </span>
  </MetadataItemWrapper>
);

const Title = styled(Body)<BodyProps>`
  font-size: 15px;
`;

const Item = styled(Body)<BodyProps>`
  ${wordBreakCss}
  font-size: 12px;
  line-height: 14px;

  // TODO: Remove when fixed: https://jira.mongodb.org/browse/EVG-18183
  // Override LG's fixed line height
  a {
    line-height: 14px;
  }

  :not(:last-child) {
    margin-bottom: 12px;
  }
  width: fit-content;
`;

const MetadataItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
`;
export const MetadataLabel = styled.b<{ color?: string }>`
  ${({ color }) => color && `color: ${color};`}
`;
