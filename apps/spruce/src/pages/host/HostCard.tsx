import { Body, Card, Skeleton } from "@via-ds/components";
import { ErrorWrapper } from "components/ErrorWrapper";
import styles from "./HostCard.module.css";

interface Props {
  error?: Error;
  loading?: boolean;
  children: React.ReactNode;
}

export const HostCard: React.FC<Props> = ({ children, error, loading }) => (
  <Card className={styles.hostCard}>
    {loading && (
      <Skeleton isLoading>
        <Body>Loading host events</Body>
        <Body>Loading host events</Body>
        <Body>Loading host events</Body>
      </Skeleton>
    )}
    {error && (
      <ErrorWrapper data-testid="metadata-card-error">
        {error.message}
      </ErrorWrapper>
    )}
    {children}
  </Card>
);
