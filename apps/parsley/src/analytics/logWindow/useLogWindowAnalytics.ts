import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";
import { SectionStatus } from "constants/logs";
import { DIRECTION } from "context/LogContext/types";
import { Filter } from "types/logs";

type Action =
  | { name: "Created new filter"; "filter.expression": string }
  | { name: "Deleted filter"; "filter.expression": string }
  | { name: "Toggled filter active state"; active: boolean }
  | { name: "Clicked all filters toggle"; checked: boolean }
  | { name: "Used project filters"; "filter.expressions": string[] }
  | { name: "Created bookmark" }
  | { name: "Created new share line" }
  | { name: "Deleted share line" }
  | { name: "Used bookmark to navigate to a line" }
  | { name: "Deleted bookmark" }
  | { name: "Deleted all bookmarks" }
  | { name: "Toggled share menu"; open: boolean }
  | { name: "Clicked copy share link button" }
  | { name: "Clicked copy share lines to clipboard button" }
  | { name: "Clicked add to Parsley AI button" }
  | { name: "Used range limit for search" }
  | { name: "Changed existing filter"; before: Filter; after: Filter }
  | { name: "Created new highlight"; "highlight.expression": string }
  | { name: "Deleted existing highlight"; "highlight.expression": string }
  | { name: "Used search"; "search.expression": string }
  | {
      name: "Used search suggestion";
      suggestion: string;
      tab_complete: boolean;
    }
  | {
      name: "Toggled expanded lines";
      option: "All" | `${number} ${"above" | "below"}`;
      "line.count": number;
      open: true;
    }
  | { name: "Toggled expanded lines"; open: false }
  | { name: "Used search result pagination"; direction: DIRECTION }
  | {
      name: "Toggled section caret";
      "section.name": string;
      "section.type": "command" | "function";
      "section.open": boolean;
      "section.status"?: SectionStatus;
      "section.nested": boolean;
    }
  | { name: "Clicked open all sections button" }
  | { name: "Clicked close all sections button" }
  | {
      name: "Clicked open subsections button";
      "section.function.name": string;
      "section.function.status": SectionStatus;
      "section.function.was_closed": boolean;
    }
  | {
      name: "Clicked close subsections button";
      "section.function.name": string;
      "section.function.status": SectionStatus;
    }
  | {
      name: "Viewed log with sections and jump to failing line";
      "settings.sections.enabled": boolean;
      "settings.jump_to_failing_line.enabled": boolean;
    };

export const useLogWindowAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("LogWindow");
