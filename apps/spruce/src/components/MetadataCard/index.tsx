import styled from "@emotion/styled";
import { InfoSprinkle } from "@leafygreen-ui/info-sprinkle";
import { ListSkeleton } from "@leafygreen-ui/skeleton-loader";
import { BaseFontSize } from "@leafygreen-ui/tokens";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import { wordBreakCss } from "@evg-ui/lib/components";
import { ErrorWrapper } from "components/ErrorWrapper";
import { SiderCard } from "components/styles";
import { Divider } from "components/styles/divider";

interface Props {
  error?: Error;
  loading?: boolean;
  title?: React.ReactNode;
  children: React.ReactNode;
}

const MetadataCard: React.FC<Props> = ({
  children,
  error,
  loading,
  title,
  ...rest
}) => (
  <SiderCard {...rest}>
    {title && (
      <>
        {typeof title === "string" ? (
          <MetadataCardTitle weight="medium">{title}</MetadataCardTitle>
        ) : (
          title
        )}
        <Divider />
      </>
    )}
    {loading && !error && <ListSkeleton />}
    {error && !loading && (
      <ErrorWrapper data-cy="metadata-card-error">{error.message}</ErrorWrapper>
    )}
    {!loading && !error && children}
  </SiderCard>
);

interface ItemProps {
  as?: BodyProps["as"];
  children: React.ReactNode;
  "data-cy"?: string;
  tooltipDescription?: string;
}

export const MetadataItem: React.FC<ItemProps> = ({
  as = "p",
  children,
  "data-cy": dataCy,
  tooltipDescription,
}) => (
  <MetadataItemWrapper>
    <Item as={as} data-cy={dataCy}>
      {children}
    </Item>
    {tooltipDescription && (
      <InfoSprinkle align="right" baseFontSize={BaseFontSize.Body1}>
        {tooltipDescription}
      </InfoSprinkle>
    )}
  </MetadataItemWrapper>
);

export const MetadataLabel = styled.b<{ color?: string }>`
  ${({ color }) => color && `color: ${color};`}
`;
export const MetadataCardTitle = styled(Body)`
  font-size: 15px;
`;

const Item = styled(Body)`
  ${wordBreakCss}
  font-size: 12px;
  line-height: 14px;

  // TODO: Remove when fixed: https://jira.mongodb.org/browse/EVG-18183
  // Override LG's fixed line height
  a {
    line-height: 14px;
  }

  width: fit-content;
`;

const MetadataItemWrapper = styled.span`
  display: flex;
  flex-direction: row;
  gap: 4px;
  line-height: 14px;

  :not(:last-child) {
    margin-bottom: 12px;
  }
`;

export default MetadataCard;
