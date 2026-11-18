import { type IconProps } from "@evg-ui/lib/components/Icon";
import { Align, WalkthroughStep } from "components/WalkthroughGuideCue";
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
    tooltipAlign: Align.End,
  },
  {
    title: "Pin Build Variants",
    description:
      "Pin variants to the top of the page to help with debugging and monitoring common workflows.",
    targetId: "build-variant-pin",
    tooltipAlign: Align.Start,
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
    value: FilterType.Exact,
    displayName: "Exact",
    glyph: "ExactString",
    tooltip: "Case-sensitive search on name for the best performance.",
  },
  {
    value: FilterType.Regex,
    displayName: "Regex",
    glyph: "Regex",
    tooltip: "Regex match on name, may take longer.",
    validator: validators.validateRegexp,
  },
  {
    value: FilterType.Tag,
    displayName: "Tag",
    glyph: "Tag",
    tooltip: "Exact match on a tag from your Evergreen config file.",
  },
] satisfies {
  value: FilterType;
  displayName: string;
  glyph: IconProps["glyph"];
  tooltip: string;
  validator?: (value: string) => boolean;
}[];

export const resetFilterState: ServerFilters = {
  requesters: undefined,
  statuses: undefined,
  tasks: undefined,
  taskTags: undefined,
  variants: undefined,
  variantTags: undefined,
};
