import { RichLinkProps } from "@lg-chat/rich-links";
import { glyphs } from "@evg-ui/lib/components/Icon";
import { ToolState } from "../types";
import { isLogCoreAnalyzerOutput } from "./utils";

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
    renderOutput?: (output: unknown) => string | undefined;
  }
> = {
  "tool-askEvergreenAgentTool": {
    loadingCopy: "Asking Evergreen Agent for more information",
    completedCopy: "Received information from the Evergreen Agent",
    errorCopy: "Error fetching information from Evergreen Agent",
    glyph: "EvergreenLogo",
  },
  "tool-logCoreAnalyzerTool": {
    loadingCopy: "Analyzing logs",
    completedCopy: "Analyzed logs",
    errorCopy: "Error analyzing logs",
    glyph: "File",
    renderLinks: (output, onLinkClick) => {
      if (!isLogCoreAnalyzerOutput(output) || !output.lineReferences.length) {
        return undefined;
      }
      return output.lineReferences.map(({ description, line }) => ({
        children: `Line ${line}: ${description}`,
        onLinkClick: () => onLinkClick?.(`#L${line}`),
        variant: "Code" as const,
      }));
    },
    renderOutput: (output) =>
      isLogCoreAnalyzerOutput(output) ? output.markdown : undefined,
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
