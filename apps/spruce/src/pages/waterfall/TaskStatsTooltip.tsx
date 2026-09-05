import { useState } from "react";
import { skipToken, useQuery } from "@apollo/client/react";
import {
  Button,
  Popover,
  PopoverRoot,
  Skeleton,
  Text,
} from "@via-ds/components";
import Icon from "@evg-ui/lib/components/Icon";
import { taskStatusToCopy } from "@evg-ui/lib/constants/task";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { Divider } from "components/styles";
import { TaskBox } from "components/TaskBox";
import {
  WaterfallTaskStatsQuery,
  WaterfallTaskStatsQueryVariables,
} from "gql/generated/types";
import { WATERFALL_TASK_STATS } from "gql/queries";
import { walkthroughSteps, waterfallGuideId } from "./constants";
import styles from "./TaskStatsTooltip.module.css";
import { Version } from "./types";

export const TaskStatsTooltip: React.FC<
  Pick<Version, "id"> & {
    isFirstVersion: boolean;
  }
> = ({ id, isFirstVersion }) => {
  const [open, setOpen] = useState(false);

  const { data, loading } = useQuery<
    WaterfallTaskStatsQuery,
    WaterfallTaskStatsQueryVariables
  >(
    WATERFALL_TASK_STATS,
    open
      ? {
          variables: { versionId: id },
          fetchPolicy: "no-cache",
        }
      : skipToken,
  );

  const isLoading = loading && !data;

  const totalTaskCount =
    data?.version?.taskStatusStats?.counts?.reduce(
      (total, { count }) => total + count,
      0,
    ) ?? 0;

  const buttonContainerProps = isFirstVersion
    ? { [waterfallGuideId]: walkthroughSteps[5].targetId }
    : {};

  return (
    <PopoverRoot
      align="end"
      isOpen={open}
      onOpenChange={setOpen}
      side="right"
      triggerType="dialog"
    >
      <div className={styles.buttonContainer}>
        <Button
          aria-label="Show task stats"
          data-testid="task-stats-tooltip-button"
          size="small"
          variant="tertiary"
          {...buttonContainerProps}
        >
          <Icon glyph="Chart" />
        </Button>
      </div>
      <Popover>
        <div className={styles.popover} data-testid="task-stats-tooltip">
          {isLoading ? (
            <Skeleton isLoading>
              <Text>Loading task stats</Text>
            </Skeleton>
          ) : (
            <table>
              <tbody>
                {data?.version?.taskStatusStats?.counts?.map(
                  ({ count, status }) => (
                    <tr key={`task_stats_row_${status}`}>
                      <td className={`${styles.cell} ${styles.count}`}>
                        {count}
                      </td>
                      <td className={styles.cell}>
                        <TaskBox status={status as TaskStatus} />
                      </td>
                      <td className={styles.cell}>
                        {taskStatusToCopy[status as TaskStatus]}
                      </td>
                    </tr>
                  ),
                )}
                <tr>
                  <td className={styles.cell} colSpan={3}>
                    <Divider />
                  </td>
                </tr>
                <tr>
                  <td className={`${styles.cell} ${styles.count}`}>
                    {totalTaskCount}
                  </td>
                  <td className={styles.cell} colSpan={2}>
                    Total tasks
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </Popover>
    </PopoverRoot>
  );
};
