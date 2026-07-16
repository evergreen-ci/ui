import { TooltipJustify } from "@leafygreen-ui/guide-cue";
import { WalkthroughStep } from "components/WalkthroughGuideCue";
import { validators } from "utils";
import { FilterType, ServerFilters } from "./types";

/**
 * Total number of versions checked by the server. Defined on the backend too, so make sure to update both.
 */
export const VERSION_SEARCH_LIMIT = 300;
export const VERSION_LIMIT = 5;

/* localStorage fields for default filter settings */
export const TASK_FILTER_SETTING_KEY = "task-filter-setting";
export const VARIANT_FILTER_SETTING_KEY = "variant-filter-setting";

export const stringFilterTooltipText =
  "Search is case sensitive. For best performance, use an Exact filter whenever possible.";

export const waterfallPageContainerId = "waterfall-page";

export const waterfallGuideId = "data-waterfall-guide-id";

export const walkthroughSteps: WalkthroughStep[] = [
  {
    description:
      "We've introduced a new layout for increased information density. Columns are commits, rows are build variants, and squares are tasks.",
    targetId: "task-box",
    title: "New Layout",
  },
  {
    description:
      "Familiarize yourself with our new task icons using the icon legend at the bottom right.",
    targetId: "task-legend",
    title: "Reimagined Task Statuses",
    tooltipJustify: TooltipJustify.End,
  },
  {
    description:
      "Pin variants to the top of the page to help with debugging and monitoring common workflows.",
    targetId: "build-variant-pin",
    title: "Pin Build Variants",
    tooltipJustify: TooltipJustify.Start,
  },
  {
    description:
      "Use the date picker to find commits from specific dates and track down regressions.",
    targetId: "jump-to-date",
    title: "Jump to Date",
  },
  {
    description:
      "Explore other filtering options in the menu, such as search by git hash.",
    shouldClick: true,
    targetId: "search-git-hash",
    title: "Search by Git Hash",
  },
  {
    description: "A summary of task statuses for any given run.",
    shouldClick: true,
    targetId: "summary-view",
    title: "Summary View",
  },
];

export const tupleSelectOptions = [
  {
    displayName: "Exact",
    validator: () => true,
    value: FilterType.Exact,
  },
  {
    displayName: "Regex",
    validator: validators.validateRegexp,
    value: FilterType.Regex,
  },
];

export const resetFilterState: ServerFilters = {
  requesters: undefined,
  statuses: undefined,
  tasks: undefined,
  variants: undefined,
};
