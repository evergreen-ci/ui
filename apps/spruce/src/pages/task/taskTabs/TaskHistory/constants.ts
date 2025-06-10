import {
  BeaconAlign,
  TooltipAlign,
  WalkthroughStep,
} from "components/WalkthroughGuideCue";

export const ACTIVATED_TASKS_LIMIT = 50;

export const taskHistoryGuideId = "data-task-history-guide-id";

export const walkthroughSteps: WalkthroughStep[] = [
  {
    title: "Introducing the Task History Tab",
    description:
      "An at-a-glance view of task history for gauging overall task health and investigating test failures.",
    targetId: "task-history-tab",
  },
  {
    title: "Task Timeline",
    description:
      "The timeline shows this task's previous runs. Paginate to view additional history.",
    targetId: "task-timeline",
    beaconAlign: BeaconAlign.Left,
    tooltipAlign: TooltipAlign.Left,
  },
  {
    title: "View Options",
    description:
      "Choose to collapse or expand inactive commits in the timeline.",
    targetId: "inactive-commits",
  },
  {
    title: "Commit Details",
    description:
      "Each card represents a task in the timeline and contains additional commit information.",
    targetId: "commit-details",
    beaconAlign: BeaconAlign.Left,
    tooltipAlign: TooltipAlign.Left,
  },
  {
    title: "Search Test Failures",
    description:
      "Search for specific tests to identify common failures across different task runs.",
    targetId: "search-test-failures",
    beaconAlign: BeaconAlign.Left,
    tooltipAlign: TooltipAlign.Left,
  },
  {
    title: "Filter by Date",
    description:
      "Jump directly to any given date in the task history. Tasks are TTL'd after 1 year.",
    targetId: "search-by-date",
  },
  {
    title: "Jump to Current Task",
    description: "Use this button to reset the page to its original state.",
    targetId: "jump-to-task",
  },
];

export const walkthroughHistoryTabProps = {
  [taskHistoryGuideId]: walkthroughSteps[0].targetId,
};

export const walkthroughTimelineProps = {
  [taskHistoryGuideId]: walkthroughSteps[1].targetId,
};

export const walkthroughInactiveViewProps = {
  [taskHistoryGuideId]: walkthroughSteps[2].targetId,
};

export const walkthroughCommitCardProps = {
  [taskHistoryGuideId]: walkthroughSteps[3].targetId,
};

export const walkthroughFailureSearchProps = {
  [taskHistoryGuideId]: walkthroughSteps[4].targetId,
};

export const walkthroughDateFilterProps = {
  [taskHistoryGuideId]: walkthroughSteps[5].targetId,
};

export const walkthroughJumpButtonProps = {
  [taskHistoryGuideId]: walkthroughSteps[6].targetId,
};

/**
 * Pixel height that indicates height of the sticky header.
 * This is to make it so that `scrollIntoView` works correctly, as `scrollIntoView` will ignore overlapping
 * sticky elements by default.
 */
export const stickyHeaderScrollOffset = 185;
