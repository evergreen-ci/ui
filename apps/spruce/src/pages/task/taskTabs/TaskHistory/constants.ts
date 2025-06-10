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
      "An at-a-glance view of task history to help with gauging overall task health and investigating test failures.",
    targetId: "task-history-tab",
  },
  {
    title: "Task History Overview",
    description:
      "A timeline of this task's previous runs. Paginate to view additional history.",
    targetId: "task-history-overview",
    beaconAlign: BeaconAlign.Left,
    tooltipAlign: TooltipAlign.Left,
  },
  {
    title: "Commit Details",
    description:
      "Each card is tied to a task in the timeline. Failing tests will be shown here.",
    targetId: "commit-details",
    beaconAlign: BeaconAlign.Left,
    tooltipAlign: TooltipAlign.Left,
  },
  {
    title: "Search Test Failures",
    description:
      "Search for specific tests to identify common failures between different tasks.",
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
    description: "Use this button to reset the view to the current task.",
    targetId: "jump-to-task",
  },
  {
    title: "View Options",
    description: "Choose to collapse or expand inactive commits.",
    targetId: "inactive-commits",
  },
];

export const walkthroughHistoryTabProps = {
  [taskHistoryGuideId]: walkthroughSteps[0].targetId,
};

export const walkthroughTimelineProps = {
  [taskHistoryGuideId]: walkthroughSteps[1].targetId,
};

export const walkthroughCommitCardProps = {
  [taskHistoryGuideId]: walkthroughSteps[2].targetId,
};

export const walkthroughFailureSearchProps = {
  [taskHistoryGuideId]: walkthroughSteps[3].targetId,
};

export const walkthroughDateFilterProps = {
  [taskHistoryGuideId]: walkthroughSteps[4].targetId,
};

export const walkthroughJumpButtonProps = {
  [taskHistoryGuideId]: walkthroughSteps[5].targetId,
};

export const walkthroughInactiveViewProps = {
  [taskHistoryGuideId]: walkthroughSteps[6].targetId,
};
