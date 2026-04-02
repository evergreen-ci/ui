import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { InfoSprinkle } from "@leafygreen-ui/info-sprinkle";
import { palette } from "@leafygreen-ui/palette";
import { ListSkeleton } from "@leafygreen-ui/skeleton-loader";
import { BaseFontSize } from "@leafygreen-ui/tokens";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import { StyledLink, wordBreakCss } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { ErrorWrapper } from "components/ErrorWrapper";
import { SiderCard } from "components/styles";
import { Divider } from "components/styles/divider";

const { gray } = palette;

interface MetadataTitleWithLinkProps {
  href: string;
  title: string;
}

export const MetadataTitleWithAPILink: React.FC<MetadataTitleWithLinkProps> = ({
  href,
  title,
}) => (
  <TitleWrapper>
    <MetadataCardTitle weight="medium">{title}</MetadataCardTitle>
    <StyledLink
      css={css`
        font-size: 12px;
      `}
      hideExternalIcon={false}
      href={href}
    >
      Open in API
    </StyledLink>
  </TitleWrapper>
);

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

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

interface SectionProps {
  children: React.ReactNode;
  label: string;
}

export const MetadataSection: React.FC<SectionProps> = ({
  children,
  label,
}) => (
  <SectionContainer>
    <SectionLabel>{label}</SectionLabel>
    {children}
  </SectionContainer>
);

export const MetadataLabel = styled.b<{ color?: string }>`
  ${({ color }) => color && `color: ${color};`}
`;
export const MetadataCardTitle = styled(Body)`
  font-size: 15px;
`;

const Item = styled(Body)`
  ${wordBreakCss}
  font-size: 13px;
  line-height: 18px;

  // TODO: Remove when fixed: https://jira.mongodb.org/browse/EVG-18183
  // Override LG's fixed line height
  a {
    line-height: 18px;
  }

  width: fit-content;
`;

const MetadataItemWrapper = styled.span`
  display: flex;
  flex-direction: row;
  gap: 4px;
  line-height: 18px;

  :not(:last-child) {
    margin-bottom: 10px;
  }
`;

const SectionContainer = styled.div`
  margin-top: ${size.s};

  &:first-of-type {
    margin-top: ${size.xs};
  }
`;

const SectionLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${gray.dark1};
  display: block;
  margin-bottom: ${size.xs};
  padding-bottom: 4px;
  border-bottom: 1px solid ${gray.light2};
`;

export default MetadataCard;
