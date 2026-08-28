import { H2, H4, Skeleton } from "@via-ds/components";
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
  return <H4>{children}</H4>;
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

  return (
    <div className={cx(styles.container, size === "medium" && styles.medium)}>
      {loading ? (
        <div
          className={cx(
            styles.pageHeader,
            size === "large" && styles.headerLarge,
          )}
        >
          <Skeleton isLoading>
            <TitleTypography size={size}>{title}</TitleTypography>
          </Skeleton>
        </div>
      ) : (
        <>
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
                <span
                  className={cx(
                    styles.badgeWrapper,
                    size === "large" && styles.badgeWrapperLarge,
                  )}
                >
                  {badge}
                </span>
              </TitleTypography>
            </span>
            {buttons ?? null}
          </div>
          {subtitle}
        </>
      )}
    </div>
  );
};

export default PageTitle;
