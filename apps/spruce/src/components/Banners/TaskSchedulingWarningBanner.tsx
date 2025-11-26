import { Banner } from "@leafygreen-ui/banner";
import { StyledLink } from "@evg-ui/lib/components/styles";
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
      This is a large operation, expected to schedule {totalTasks} tasks. Please
      confirm that this number of tasks is necessary before continuing. For more
      information, please refer to our{" "}
      <StyledLink href={taskSchedulingLimitsDocumentationUrl}>docs.</StyledLink>
    </Banner>
  ) : null;
