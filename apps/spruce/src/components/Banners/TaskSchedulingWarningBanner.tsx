import { Banner } from "@via-ds/components/banner";
import { Link, Text } from "@via-ds/components/typography";
import { taskSchedulingLimitsDocumentationUrl } from "constants/externalResources";

interface TaskSchedulingWarningBannerProps {
  totalTasks: number;
}
const largeNumFinalizedTasksThreshold = 1000;

export const TaskSchedulingWarningBanner: React.FC<
  TaskSchedulingWarningBannerProps
> = ({ totalTasks }) =>
  totalTasks >= largeNumFinalizedTasksThreshold ? (
    <Banner variant="warning">
      <Text>
        This is a large operation, expected to schedule {totalTasks} tasks.
        Please confirm that this number of tasks is necessary before continuing.
        For more information, please refer to our{" "}
        <Link
          href={taskSchedulingLimitsDocumentationUrl}
          isStandalone={false}
          linkStyle="external"
        >
          docs.
        </Link>
      </Text>
    </Banner>
  ) : null;
