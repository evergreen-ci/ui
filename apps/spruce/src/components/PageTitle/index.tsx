import { Skeleton } from "@leafygreen-ui/skeleton-loader";
import { H2, Subtitle } from "@leafygreen-ui/typography";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
import { cx } from "@evg-ui/lib/utils/css";
import styles from "./index.module.css";

type Size = "large" | "medium";

interface TitleTypographyProps {
  size?: Size;
  children: React.ReactNode;
}

const TitleTypography: React.FC<TitleTypographyProps> = ({
  children,
  size = "medium",
}) => {
  if (size === "large") {
    return <H2>{children}</H2>;
  }
  return <Subtitle>{children}</Subtitle>;
};

interface Props {
  loading: boolean;
  title: React.ReactNode;
  pageTitle?: string;
  subtitle?: React.ReactNode;
  badge: React.ReactNode;
  buttons?: React.ReactNode;
  size?: Size;
  children?: React.ReactNode;
}

const PageTitle: React.FC<Props> = ({
  badge,
  buttons,
  children,
  loading,
  pageTitle = "Evergreen",
  size,
  subtitle,
  title,
}) => {
  usePageTitle(pageTitle);

  return loading ? (
    <div
      className={cx(styles.pageHeader, size === "large" && styles.headerLarge)}
    >
      <Skeleton />
    </div>
  ) : (
    <div className={cx(styles.container, size === "medium" && styles.medium)}>
      <div
        className={cx(
          styles.pageHeader,
          size === "large" && styles.headerLarge,
        )}
      >
        <span className={styles.titleWrapper}>
          <TitleTypography size={size}>
            <span data-testid="page-title">{title}</span>
            {children}
            <div
              className={cx(
                styles.badgeWrapper,
                size === "large" && styles.badgeWrapperLarge,
              )}
            >
              {badge}
            </div>
          </TitleTypography>
        </span>
        {buttons ?? null}
      </div>
      {subtitle}
    </div>
  );
};

export default PageTitle;
