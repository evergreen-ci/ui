import { Children } from "react";
import {
  Align,
  Body,
  H5,
  H6,
  InfoSprinkle,
  Label,
  LabeledValue,
  Link,
  Skeleton,
  TextAliasProps,
} from "@via-ds/components";
import { size } from "@evg-ui/lib/constants/tokens";
import { cx } from "@evg-ui/lib/utils/css";
import { ErrorWrapper } from "components/ErrorWrapper";
import { SiderCard } from "components/styles";
import { Divider } from "components/styles/Divider";
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
    <MetadataCardTitle>{title}</MetadataCardTitle>
    <Link className={styles.apiLink} href={href}>
      Open in API
    </Link>
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
          <MetadataCardTitle>{title}</MetadataCardTitle>
        ) : (
          title
        )}
        <Divider />
      </>
    )}
    {loading && !error && (
      <Skeleton isLoading>
        <div className={styles.itemsContainer}>
          <Body>Loading metadata</Body>
          <Body>Loading metadata</Body>
          <Body>Loading metadata</Body>
        </div>
      </Skeleton>
    )}
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
  children: React.ReactNode;
  "data-testid"?: string;
  elementType?: "p" | "div";
  label?: string;
  labelColor?: string;
  tooltipDescription?: string;
}

export const MetadataItem: React.FC<ItemProps> = ({
  children,
  "data-testid": dataTestId,
  elementType = "p",
  label,
  labelColor,
  tooltipDescription,
}) => (
  <div className={styles.itemWrapper}>
    {label ? (
      <LabeledValue
        className={styles.item}
        data-testid={dataTestId}
        orientation="horizontal"
      >
        <Label style={labelColor ? { color: labelColor } : undefined}>
          {label}:
        </Label>
        <Body elementType={elementType === "div" ? "div" : "span"}>
          {children}
        </Body>
      </LabeledValue>
    ) : (
      <Body
        className={styles.item}
        data-testid={dataTestId}
        elementType={elementType}
      >
        {children}
      </Body>
    )}
    {tooltipDescription && (
      <InfoSprinkle align={Align.End}>{tooltipDescription}</InfoSprinkle>
    )}
  </div>
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
          <H6 className={styles.header}>{title}</H6>
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
  <strong style={color ? { color } : undefined}>{children}</strong>
);

export const MetadataCardTitle: React.FC<TextAliasProps> = ({
  className,
  ...rest
}) => <H5 className={cx(styles.cardTitle, className)} {...rest} />;

export default MetadataCard;
