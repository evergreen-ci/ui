import { getSignalProcessingUrl } from "utils/environmentVariables";
import styles from "./TrendChartsPlugin.module.css";

interface Props {
  taskId: string;
}

const TrendChartsPlugin: React.FC<Props> = ({ taskId }) => (
  <iframe
    allow="clipboard-read; clipboard-write; publickey-credentials-get"
    className={styles.iframe}
    src={`${getSignalProcessingUrl()}/task/${taskId}/performanceData`}
    title="Task Performance Data"
  />
);

export default TrendChartsPlugin;
