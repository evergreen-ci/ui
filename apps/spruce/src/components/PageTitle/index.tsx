import styled from "@emotion/styled";
import { Skeleton } from "@leafygreen-ui/skeleton-loader";
import { H2, Subtitle } from "@leafygreen-ui/typography";
import { size as tokenSize } from "@evg-ui/lib/constants/tokens";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";

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
    <PageHeader size={size}>
      <Skeleton />
    </PageHeader>
  ) : (
    <Container size={size}>
      <PageHeader size={size}>
        <TitleWrapper size={size}>
          <TitleTypography size={size}>
            <span data-cy="page-title">{title}</span>
            {children}
            <BadgeWrapper size={size}>{badge}</BadgeWrapper>
          </TitleTypography>
        </TitleWrapper>
        {buttons ?? null}
      </PageHeader>
      {subtitle}
    </Container>
  );
};

const Container = styled.div<TitleTypographyProps>`
  display: flex;
  flex-direction: column;
  margin-bottom: ${(props) =>
    props.size === "medium" ? tokenSize.m : tokenSize.l};
`;
const BadgeWrapper = styled.div<TitleTypographyProps>`
  display: inline-flex;
  margin-left: ${({ size }) => (size === "large" ? tokenSize.m : tokenSize.s)};
  vertical-align: ${({ size }) =>
    size === "large" ? "middle" : "text-bottom"};
`;

const PageHeader = styled.div<TitleTypographyProps>`
  ${({ size }) => size === "large" && `margin-top: ${tokenSize.s};`}
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const TitleWrapper = styled.span<TitleTypographyProps>`
  max-width: ${(props) => (props.size === "medium" ? "70%" : "100%")};
`;

export default PageTitle;
