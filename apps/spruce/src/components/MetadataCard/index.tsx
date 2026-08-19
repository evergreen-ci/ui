import { Children } from "react";
import { InfoSprinkle } from "@leafygreen-ui/info-sprinkle";
import { ListSkeleton } from "@leafygreen-ui/skeleton-loader";
import { BaseFontSize } from "@leafygreen-ui/tokens";
import { Body, BodyProps, Overline } from "@leafygreen-ui/typography";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { cx } from "@evg-ui/lib/utils/css";
import { ErrorWrapper } from "components/ErrorWrapper";
import { SiderCard } from "components/styles";
import { Divider } from "components/styles/divider";
import styles from "./index.module.css";

interface MetadataTitleWithLinkProps {
  href: string;
  title: string;
}

export const MetadataTitleWithAPILink: React.FC<MetadataTitleWithLinkProps> = ({
  href,
  title,
}) => (
  <div className={styles.titleWrapper}>
    <MetadataCardTitle weight="medium">{title}</MetadataCardTitle>
    <StyledLink className={styles.apiLink} hideExternalIcon={false} href={href}>
      Open in API
    </StyledLink>
  </div>
);

interface Props {
  className?: string;
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
      <ErrorWrapper data-testid="metadata-card-error">
        {error.message}
      </ErrorWrapper>
    )}
    {!loading && !error && (
      <div className={styles.itemsContainer}>{children}</div>
    )}
  </SiderCard>
);

interface ItemProps {
  as?: BodyProps["as"];
  children: React.ReactNode;
  "data-testid"?: string;
  label?: string;
  labelColor?: string;
  tooltipDescription?: string;
}

export const MetadataItem: React.FC<ItemProps> = ({
  as = "p",
  children,
  "data-testid": dataTestId,
  label,
  labelColor,
  tooltipDescription,
}) => (
  <span className={styles.itemWrapper}>
    {label ? (
      <Body as={as} className={styles.item} data-testid={dataTestId}>
        <MetadataLabel color={labelColor}>{label}:</MetadataLabel> {children}
      </Body>
    ) : (
      <Body as={as} className={styles.item} data-testid={dataTestId}>
        {children}
      </Body>
    )}
    {tooltipDescription && (
      <InfoSprinkle align="right" baseFontSize={BaseFontSize.Body1}>
        {tooltipDescription}
      </InfoSprinkle>
    )}
  </span>
);

interface MetadataSectionProps {
  children?: React.ReactNode;
  title?: string;
}

export const MetadataSection: React.FC<MetadataSectionProps> = ({
  children,
  title,
}) => {
  if (Children.toArray(children).length === 0) return null;
  return (
    <div>
      {title && (
        <>
          <Overline className={styles.header}>{title}</Overline>
          <Divider margin={`${size.xxs} 0`} />
        </>
      )}
      <div className={styles.itemsContainer}>{children}</div>
    </div>
  );
};

export const MetadataLabel: React.FC<{
  children?: React.ReactNode;
  color?: string;
}> = ({ children, color }) => (
  <b style={color ? { color } : undefined}>{children}</b>
);

export const MetadataCardTitle: React.FC<BodyProps> = ({
  className,
  ...rest
}) => <Body className={cx(styles.cardTitle, className)} {...rest} />;

export default MetadataCard;
