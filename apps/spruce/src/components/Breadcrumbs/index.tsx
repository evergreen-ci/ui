import {
  Breadcrumb as ViaBreadcrumb,
  Breadcrumbs as ViaBreadcrumbs,
} from "@via-ds/components/breadcrumbs";
import {
  Tooltip,
  TooltipRoot,
  TooltipTrigger,
} from "@via-ds/components/tooltip";
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
  <ViaBreadcrumbs
    className={styles.container}
    includesCurrentPage
    onAction={(key) => breadcrumbs[Number(key)]?.onClick?.()}
  >
    {breadcrumbs.map(({ "data-testid": dataTestId, text = "", to }, index) => (
      <ViaBreadcrumb
        key={`breadcrumb-${text}`}
        data-testid={dataTestId}
        href={to}
        id={index}
        textValue={text}
      >
        <BreadcrumbLabel text={text} />
      </ViaBreadcrumb>
    ))}
  </ViaBreadcrumbs>
);

const BreadcrumbLabel: React.FC<{ text: string }> = ({ text }) => {
  const shouldTrimMessage = text.length > 30;
  return (
    <TooltipRoot
      align="center"
      delay={0}
      isDisabled={!shouldTrimMessage}
      side="top"
    >
      <TooltipTrigger>
        <span>{trimStringFromMiddle(text, 30)}</span>
      </TooltipTrigger>
      <Tooltip data-testid="breadcrumb-tooltip">{text}</Tooltip>
    </TooltipRoot>
  );
};

export default Breadcrumbs;
