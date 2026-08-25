import { cx } from "@evg-ui/lib/utils/css";
import { useDateFormat } from "hooks/useDateFormat";
import styles from "./MetadataTimeline.module.css";

interface MetadataTimelineRowProps {
  children: React.ReactNode;
  label: string;
  "data-testid"?: string;
  isRunning?: boolean;
}

export const MetadataTimelineRow: React.FC<MetadataTimelineRowProps> = ({
  children,
  "data-testid": dataTestId,
  isRunning,
  label,
}) => (
  <li
    className={cx(styles.row, isRunning && styles.rowRunning)}
    data-testid={dataTestId}
  >
    <b className={styles.label}>{label}</b>
    <span
      className={cx(styles.timestamp, isRunning && styles.timestampRunning)}
    >
      {children}
    </span>
  </li>
);

interface MetadataTimelineTimestampRowProps {
  label: string;
  timestamp: Date;
  "data-testid"?: string;
}

export const MetadataTimelineTimestampRow: React.FC<
  MetadataTimelineTimestampRowProps
> = ({ "data-testid": dataTestId, label, timestamp }) => {
  const getDateCopy = useDateFormat();

  return (
    <MetadataTimelineRow data-testid={dataTestId} label={label}>
      <span title={getDateCopy(timestamp)}>
        {getDateCopy(timestamp, { omitSeconds: true })}
      </span>
    </MetadataTimelineRow>
  );
};

export const MetadataTimelineContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <ul className={cx(styles.container, className)}>{children}</ul>
);
