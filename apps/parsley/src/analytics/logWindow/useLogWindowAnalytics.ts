import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";
import { SectionStatus } from "constants/logs";
import { DIRECTION } from "context/LogContext/types";
import { Filter } from "types/logs";

type Action =
  | { name: "Created new filter"; filterExpression: string }
  | { name: "Deleted filter"; filterExpression: string }
  | { name: "Toggled filter active state"; active: boolean }
  | { name: "Used project filters"; filters: Filter[] }
  | { name: "Created bookmark" }
  | { name: "Created new share line" }
  | { name: "Deleted share line" }
  | { name: "Used bookmark to navigate to a line" }
  | { name: "Deleted bookmark" }
  | { name: "Deleted all bookmarks" }
  | { name: "Toggled share menu"; open: boolean }
  | { name: "Clicked copy share link button" }
  | { name: "Clicked copy share lines to clipboard button" }
  | { name: "Used range limit for search" }
  | { name: "Changed existing filter"; before: Filter; after: Filter }
  | { name: "Created new highlight"; highlightExpression: string }
  | { name: "Deleted existing highlight"; highlightExpression: string }
  | { name: "Used search"; searchExpression: string }
  | { name: "Used search suggestion"; suggestion: string }
  | {
      name: "Toggled expanded lines";
      option: "All" | "Five";
      lineCount: number;
      open: true;
    }
  | { name: "Toggled expanded lines"; open: false }
  | { name: "Used search result pagination"; direction: DIRECTION }
  | {
      name: "Toggled section caret";
      sectionName: string;
      sectionType: "command" | "function";
      open: boolean;
      status?: SectionStatus;
      isNested: boolean;
    }
  | { name: "Clicked open all sections button" }
  | { name: "Clicked close all sections button" }
  | {
      name: "Clicked open subsections button";
      functionName: string;
      status: SectionStatus;
      wasfunctionClosed: boolean;
    }
  | {
      name: "Clicked close subsections button";
      functionName: string;
      status: SectionStatus;
    }
  | {
      name: "Viewed log with sections and jump to failing line";
      sectionsEnabled: boolean;
      jumpToFailingLineEnabled: boolean;
    };

export const useLogWindowAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("LogWindow");
