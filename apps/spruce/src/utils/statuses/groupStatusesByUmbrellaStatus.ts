import { TaskStatus } from "@evg-ui/lib/types/task";
import {
  taskStatusToCopy,
  mapTaskStatusToUmbrellaStatus,
  mapTaskToBarchartColor,
  sortedUmbrellaStatus,
} from "constants/task";
import { toArray, deduplicatedAppend } from "utils/array";

type ColorCount = {
  count: number;
  statuses: string[];
  color: string;
  umbrellaStatus: TaskStatus;
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
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        taskStatusToCopy[stat.status],
        counts[umbrellaStatus].statuses,
      );
    } else {
      counts[umbrellaStatus] = {
        count: stat.count,
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        statuses: toArray(taskStatusToCopy[stat.status]),
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        color: mapTaskToBarchartColor[umbrellaStatus],
        umbrellaStatus: umbrellaStatus as TaskStatus,
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
