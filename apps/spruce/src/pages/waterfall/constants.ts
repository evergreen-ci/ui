import { WalkthroughStep } from "components/WalkthroughGuideCue";

export const VERSION_LIMIT = 5;

export const waterfallGuideId = "data-waterfall-guide-id";

export const walkthroughSteps: WalkthroughStep[] = [
  {
    title: "New Layout",
    description:
      "We've changed the Project Health page to a new layout for increased information density. Columns are commits, rows are build variants, and tasks are box icons.",
    dataTargetId: "task-box",
  },
  {
    title: "Reimagined Task Statuses",
    description:
      "Familiarize yourself with our new task icons using the icon legend at the bottom right.",
    dataTargetId: "task-legend",
  },
  {
    title: "Pin Build Variants",
    description:
      "Pin your favorite build variants at the top to help with debugging and monitoring workflows.",
    dataTargetId: "build-variant-pin",
  },
  {
    title: "Jump to Date",
    description:
      "Use the date picker to find commits from specific dates and track down regressions.",
    dataTargetId: "jump-to-date",
  },
  {
    title: "Summary View",
    description:
      "Introducing an alternative to the charts — view a summary of the task statuses for any given run.",
    dataTargetId: "summary-view",
  },
];
