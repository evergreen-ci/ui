import { taskStatusToCopy } from "@evg-ui/lib/constants";
import { TaskStatus, TaskStatusUmbrella } from "@evg-ui/lib/types";
import {
  mapTaskStatusToUmbrellaStatus,
  mapTaskToBarchartColor,
  sortedUmbrellaStatus,
} from "constants/task";
import { toArray, deduplicatedAppend } from "utils/array";

type ColorCount = {
  count: number;
  statuses: string[];
  color: string;
  umbrellaStatus: TaskStatusUmbrella;
  statusCounts: { [key: string]: number };
};

export const groupStatusesByUmbrellaStatus = (
  statusCounts: {
    status: string;
    count: number;
  }[],
) => {
  const counts: { [key: string]: ColorCount } = {};

  statusCounts.forEach((stat) => {
    const umbrellaStatus = mapTaskStatusToUmbrellaStatus[stat.status];
    if (counts[umbrellaStatus]) {
      counts[umbrellaStatus].count += stat.count;
      counts[umbrellaStatus].statuses = deduplicatedAppend(
        taskStatusToCopy[stat.status as TaskStatus],
        counts[umbrellaStatus].statuses,
      );
    } else {
      counts[umbrellaStatus] = {
        count: stat.count,
        statuses: toArray(taskStatusToCopy[stat.status as TaskStatus]),
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        color: mapTaskToBarchartColor[umbrellaStatus],
        umbrellaStatus: umbrellaStatus as TaskStatusUmbrella,
        statusCounts: {},
      };
    }
    if (!counts[umbrellaStatus].statusCounts[stat.status]) {
      counts[umbrellaStatus].statusCounts[stat.status] = stat.count;
    } else {
      counts[umbrellaStatus].statusCounts[stat.status] += stat.count;
    }
  });

  let max = -1;
  let total = 0;
  const stats: ColorCount[] = [];

  // Populate STATS array with ColorCount object in sorted color order
  sortedUmbrellaStatus.forEach((umbrellaStatus) => {
    if (counts[umbrellaStatus]) {
      total += counts[umbrellaStatus].count;
      max = Math.max(max, counts[umbrellaStatus].count);
      stats.push(counts[umbrellaStatus]);
    }
  });

  return { stats, max, total };
};
