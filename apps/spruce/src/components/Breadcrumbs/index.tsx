import {
  Breadcrumb as ViaBreadcrumb,
  Breadcrumbs as ViaBreadcrumbs,
} from "@via-ds/components";
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
      >
        {text}
      </ViaBreadcrumb>
    ))}
  </ViaBreadcrumbs>
);

export default Breadcrumbs;
