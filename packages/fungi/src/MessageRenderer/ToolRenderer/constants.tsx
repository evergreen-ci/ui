import { RichLinkProps } from "@lg-chat/rich-links";
import { glyphs } from "@evg-ui/lib/components/Icon";
import { ToolState } from "../types";
import { MergedFindingsView } from "./MergedFindingsView";
import { isMergedFindings } from "./utils";

/**
 * Mapping of tool names to their various states.
 * This should be updated as new tools are added to the agent.
 * Only include labels for tools that are visible to the user.
 */
export const renderableToolLabels: Record<
  `tool-${string}`,
  {
    loadingCopy: string;
    completedCopy: string;
    errorCopy: string;
    glyph: keyof typeof glyphs;
    renderLinks?: (
      output: unknown,
      onLinkClick?: (href: string) => void,
    ) => RichLinkProps[] | undefined;
    renderOutput?: (
      output: unknown,
      onLinkClick?: (href: string) => void,
    ) => React.ReactNode | undefined;
  }
> = {
  "tool-askEvergreenAgentTool": {
    loadingCopy: "Asking Evergreen Agent for more information",
    completedCopy: "Received information from the Evergreen Agent",
    errorCopy: "Error fetching information from Evergreen Agent",
    glyph: "EvergreenLogo",
    renderOutput: (output) => {
      if (typeof output === "string") {
        return output;
      }
      return undefined;
    },
  },
  "tool-logAnalyzerTool": {
    loadingCopy: "Analyzing logs",
    completedCopy: "Analyzed logs",
    errorCopy: "Error analyzing logs",
    glyph: "File",
    renderOutput: (output, onLinkClick) =>
      isMergedFindings(output) ? (
        <MergedFindingsView findings={output} onLineClick={onLinkClick} />
      ) : undefined,
  },
};

// 2) Create an enum-like object with compile-time checking
const satisfiesToolStates = <T extends Record<string, ToolState>>(t: T) => t;

export const ToolStateEnum = satisfiesToolStates({
  OutputError: "output-error",
  InputStreaming: "input-streaming",
  InputAvailable: "input-available",
  OutputAvailable: "output-available",
} as const);
