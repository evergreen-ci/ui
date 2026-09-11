import { Fragment } from "react";
import { Tooltip, TooltipRoot, TooltipTrigger } from "@via-ds/components/tooltip";
import tokens from "@via-ds/tokens";
import Icon from "@evg-ui/lib/components/Icon";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { trimStringFromMiddle } from "@evg-ui/lib/utils/string";
import styles from "./index.module.css";



export interface Breadcrumb {
  text: string;
  to?: string;
  onClick?: () => void;
  "data-testid"?: string;
}
interface BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
}
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbs }) => (
  <nav className={styles.container}>
    {breadcrumbs.map((bc, index) => (
      <Fragment key={`breadcrumb-${bc.text}`}>
        <BreadcrumbFragment breadcrumb={bc} />
        {breadcrumbs.length - 1 !== index && (
          <Icon
            className={styles.paddedIcon}
            data-testid="breadcrumb-chevron"
            fill={tokens.color.neutral["700"].$value}
            glyph="ChevronRight"
            size="small"
          />
        )}
      </Fragment>
    ))}
  </nav>
);

interface BreadcrumbFragmentProps {
  breadcrumb: Breadcrumb;
}
const BreadcrumbFragment: React.FC<BreadcrumbFragmentProps> = ({
  breadcrumb,
}) => {
  const { "data-testid": dataTestId, onClick, text = "", to } = breadcrumb;
  const shouldTrimMessage = text.length > 30;
  const message = trimStringFromMiddle(text, 30);
  return (
    <TooltipRoot side="top" align="start" isDisabled={!shouldTrimMessage}>
      <TooltipTrigger>
        {to ? (
          <div data-testid={dataTestId}>
            <StyledRouterLink onClick={onClick} to={to}>
              {message}
            </StyledRouterLink>
          </div>
        ) : (
          <div data-testid={dataTestId}>{message}</div>
        )}
      </TooltipTrigger>
      <Tooltip>{text}</Tooltip>
    </TooltipRoot>
  );
};

export default Breadcrumbs;
