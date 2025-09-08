/**
 * Mapping of tool names to their various states.
 * This should be updated as new tools are added to the agent.
 * Only include labels for tools that are visible to the user.
 */
export const toolLabels: Record<
  string,
  {
    loading: string;
    done: string;
    error: string;
  }
> = {
  "tool-askEvergreenAgentTool": {
    loading: "Asking Evergreen Agent for more information",
    done: "Asked Evergreen Agent for more information",
    error: "Error fetching information from Evergreen Agent",
  },
  "tool-logCoreAnalyzerWorkflow": {
    loading: "Analyzing logs",
    done: "Analyzed logs",
    error: "Error analyzing logs",
  },
};
