import { ProgressCircle, Text } from "@via-ds/components";
import styles from "./FetchMoreLoader.module.css";

export const FetchMoreLoader: React.FC = () => (
  <div className={styles.loader} data-testid="fetch-more-loader">
    <ProgressCircle aria-label="Fetching more commits" size="large" />
    <Text textStyle="description">Fetching...</Text>
  </div>
);
