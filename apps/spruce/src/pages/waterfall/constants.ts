import { WalkthroughStep } from "components/WalkthroughGuideCue";

export const VERSION_LIMIT = 5;

export const waterfallPageContainerId = "waterfall-page";

export const waterfallGuideId = "data-waterfall-guide-id";

export const walkthroughSteps: WalkthroughStep[] = [
  {
    title: "New Layout",
    description:
      "We've introduced a new layout for increased information density. Columns are commits, rows are build variants, and squares are tasks.",
    targetId: "task-box",
  },
  {
    title: "Reimagined Task Statuses",
    description:
      "Familiarize yourself with our new task icons using the icon legend at the bottom right.",
    targetId: "task-legend",
  },
  {
    title: "Pin Build Variants",
    description:
      "Pin variants to the top of the page to help with debugging and monitoring common workflows.",
    targetId: "build-variant-pin",
  },
  {
    title: "Jump to Date",
    description:
      "Use the date picker to find commits from specific dates and track down regressions.",
    targetId: "jump-to-date",
  },
  {
    title: "Search by Git Hash",
    description:
      "Explore other filtering options in the menu, such as search by git hash.",
    targetId: "search-git-hash",
    shouldClick: true,
  },
  {
    title: "Summary View",
    description:
      "An alternative to Project Health charts — view a summary of task statuses for any given run.",
    targetId: "summary-view",
    shouldClick: true,
  },
];
