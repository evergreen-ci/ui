import { TooltipJustify } from "@leafygreen-ui/guide-cue";
import { FilterType } from "components/TupleSelectWithRegexConditional";
import { WalkthroughStep } from "components/WalkthroughGuideCue";
import { validators } from "utils";
import { ServerFilters } from "./types";

// Total number of versions checked by the server. Defined on the backend too, so make sure to update both.
export const VERSION_SEARCH_LIMIT = 300;
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
    tooltipJustify: TooltipJustify.End,
  },
  {
    title: "Pin Build Variants",
    description:
      "Pin variants to the top of the page to help with debugging and monitoring common workflows.",
    targetId: "build-variant-pin",
    tooltipJustify: TooltipJustify.Start,
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
    description: "A summary of task statuses for any given run.",
    targetId: "summary-view",
    shouldClick: true,
  },
];

export const tupleSelectOptions = [
  {
    value: FilterType.Regex,
    displayName: "Regex",
    validator: validators.validateRegexp,
  },
  {
    value: FilterType.Exact,
    displayName: "Exact",
    validator: () => true,
  },
];

/**
 * Timestamp of the last deploy that made changes to `displayStatusCache`, in UTC.
 * This timestamp should correspond to 2025/01/21 10:05AM EST.
 * TODO: Remove in DEVPROD-15269.
 */
export const displayStatusCacheAddedDate = new Date(
  Date.UTC(2025, 0, 21, 15, 5),
);

export const resetFilterState: ServerFilters = {
  requesters: undefined,
  statuses: undefined,
  tasks: undefined,
  variants: undefined,
};
