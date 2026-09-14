import { CopyButton } from "components/CopyButton";
import { MetadataItem, MetadataLabel } from "components/MetadataCard";
import styles from "./index.module.css";

interface CopyableIDProps {
  "data-testid"?: string;
  textToCopy: string;
  tooltipLabel: string;
}

export const CopyableID: React.FC<CopyableIDProps> = ({
  "data-testid": dataTestId,
  textToCopy,
  tooltipLabel,
}) => (
  <MetadataItem data-testid={dataTestId} elementType="div">
    <div className={styles.container}>
      <span className={styles.labelWrapper}>
        <MetadataLabel>ID: </MetadataLabel>
        {textToCopy}
      </span>
      <span className={styles.copyButtonWrapper}>
        <CopyButton textToCopy={textToCopy} tooltipLabel={tooltipLabel} />
      </span>
    </div>
  </MetadataItem>
);
