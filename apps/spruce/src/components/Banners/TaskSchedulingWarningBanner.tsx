import { Banner, Text } from "@via-ds/components";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { taskSchedulingLimitsDocumentationUrl } from "constants/externalResources";
import styles from "./styles.module.css";

interface TaskSchedulingWarningBannerProps {
  totalTasks: number;
}
const largeNumFinalizedTasksThreshold = 1000;

export const TaskSchedulingWarningBanner: React.FC<
  TaskSchedulingWarningBannerProps
> = ({ totalTasks }) =>
  totalTasks >= largeNumFinalizedTasksThreshold ? (
    <Banner className={styles.legacyLinks} variant="warning">
      <Text>
        This is a large operation, expected to schedule {totalTasks} tasks.
        Please confirm that this number of tasks is necessary before continuing.
        For more information, please refer to our{" "}
        <StyledLink href={taskSchedulingLimitsDocumentationUrl}>
          docs.
        </StyledLink>
      </Text>
    </Banner>
  ) : null;
