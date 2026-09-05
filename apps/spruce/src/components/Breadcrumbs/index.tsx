import { Fragment } from "react";
import { palette } from "@leafygreen-ui/palette";
import { Tooltip } from "@leafygreen-ui/tooltip";
import ChevronRight from "@via-ds/icons/ChevronRight";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { trimStringFromMiddle } from "@evg-ui/lib/utils/string";
import styles from "./index.module.css";

const { gray } = palette;

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
          <ChevronRight
            className={styles.paddedIcon}
            data-testid="breadcrumb-chevron"
            fill={gray.dark2}
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
    <Tooltip
      align="top"
      data-testid="breadcrumb-tooltip"
      enabled={shouldTrimMessage}
      justify="middle"
      trigger={
        to ? (
          <div data-testid={dataTestId}>
            <StyledRouterLink onClick={onClick} to={to}>
              {message}
            </StyledRouterLink>
          </div>
        ) : (
          <div data-testid={dataTestId}>{message}</div>
        )
      }
      triggerEvent="hover"
    >
      {text}
    </Tooltip>
  );
};

export default Breadcrumbs;
