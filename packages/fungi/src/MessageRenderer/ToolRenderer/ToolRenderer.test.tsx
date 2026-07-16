import { render, screen, userEvent } from "@evg-ui/lib/test_utils";
import { ToolStateEnum } from "../types";
import { MergedFindings } from "./utils";
import { ToolRenderer } from ".";

const baseFindings: MergedFindings = {
  errors: [],
  events: [],
  metrics: [],
  observations: [],
  overallStatus: "failure",
  summary: "Two issues",
};

describe("ToolRenderer", () => {
  it("renders a tool with a loading state if the output is not available", () => {
    const { rerender } = render(
      <ToolRenderer
        {...{
          input: "test",
          state: ToolStateEnum.InputStreaming,
          toolCallId: "123",
          type: "tool-askEvergreenAgentTool",
        }}
      />,
    );
    expect(
      screen.getByText("Asking Evergreen Agent for more information"),
    ).toBeInTheDocument();
    rerender(
      <ToolRenderer
        {...{
          input: "test",
          state: ToolStateEnum.InputAvailable,
          toolCallId: "123",
          type: "tool-askEvergreenAgentTool",
        }}
      />,
    );
    expect(
      screen.getByText("Asking Evergreen Agent for more information"),
    ).toBeInTheDocument();
  });

  it("renders a tool with a done state if the output is available", () => {
    render(
      <ToolRenderer
        {...{
          input: "test",
          output: { steps: { "123": { endedAt: 2, startedAt: 1 } } },
          state: ToolStateEnum.OutputAvailable,
          toolCallId: "123",
          type: "tool-askEvergreenAgentTool",
        }}
      />,
    );
    expect(
      screen.getByText("Received information from the Evergreen Agent"),
    ).toBeInTheDocument();
  });

  it("does not render a tool if it should not be a ui tool", () => {
    render(
      <ToolRenderer
        {...{
          input: "test",
          output: { steps: { "123": { endedAt: 2, startedAt: 1 } } },
          state: ToolStateEnum.OutputAvailable,
          toolCallId: "123",
          type: "tool-someRandomBackgroundTool",
        }}
      />,
    );
    expect(screen.queryByDataCy("tool-use-chip")).not.toBeInTheDocument();
  });

  it("renders a tool with an error state if the output is an error", () => {
    render(
      <ToolRenderer
        {...{
          errorText: "Error fetching information from Evergreen Agent",
          input: "test",
          state: ToolStateEnum.OutputError,
          toolCallId: "123",
          type: "tool-askEvergreenAgentTool",
        }}
      />,
    );
    expect(
      screen.getByText("Error fetching information from Evergreen Agent"),
    ).toBeInTheDocument();
  });

  it("renders a progress indicator when progress prop is provided during loading", () => {
    render(
      <ToolRenderer
        {...{
          input: "test",
          state: ToolStateEnum.InputAvailable,
          toolCallId: "456",
          type: "tool-logAnalyzerTool",
        }}
        progress={{ percentage: 50, phase: "Refining chunk 3 of 5" }}
      />,
    );
    expect(screen.getByText("Analyzing logs")).toBeInTheDocument();
    expect(screen.getByText("Refining chunk 3 of 5")).toBeInTheDocument();
  });

  it("shows loading ellipsis when no progress prop is provided during loading", () => {
    render(
      <ToolRenderer
        {...{
          input: "test",
          state: ToolStateEnum.InputAvailable,
          toolCallId: "456",
          type: "tool-logAnalyzerTool",
        }}
      />,
    );
    expect(screen.getByText("Analyzing logs")).toBeInTheDocument();
    expect(screen.queryByText("%")).not.toBeInTheDocument();
  });

  it("does not show progress indicator when tool is completed", () => {
    render(
      <ToolRenderer
        {...{
          input: "test",
          output: { result: "analysis complete" },
          state: ToolStateEnum.OutputAvailable,
          toolCallId: "456",
          type: "tool-logAnalyzerTool",
        }}
        progress={{ percentage: 100, phase: "Analysis complete" }}
      />,
    );
    expect(screen.getByText("Analyzed logs")).toBeInTheDocument();
    expect(screen.queryByText("Analysis complete")).not.toBeInTheDocument();
  });

  it("does not render rich navigation links alongside the findings panel", () => {
    render(
      <ToolRenderer
        {...{
          input: "test",
          output: {
            ...baseFindings,
            errors: [
              {
                evidence: "NPE",
                line: 42,
                message: "Null pointer",
                severity: "error",
              },
              {
                evidence: "Leak",
                line: 87,
                message: "Memory leak",
                severity: "warning",
              },
            ],
          } satisfies MergedFindings,
          state: ToolStateEnum.OutputAvailable,
          toolCallId: "456",
          type: "tool-logAnalyzerTool",
        }}
      />,
    );
    expect(screen.getByText("Analyzed logs")).toBeInTheDocument();
    // Errors are only shown inside the expandable findings panel, not as
    // separate rich links below the action card.
    expect(screen.queryByText(/^Line 42:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Line 87:/)).not.toBeInTheDocument();
  });

  it("renders status, summary, and findings for logAnalyzerTool output when expanded", async () => {
    const user = userEvent.setup();
    render(
      <ToolRenderer
        {...{
          input: "test",
          output: {
            errors: [
              {
                evidence: "95% used",
                line: null,
                message: "Disk nearly full",
                severity: "warning",
              },
            ],
            events: [
              {
                description: "Task started",
                line: 10,
                timestamp: "2026-04-22T14:00:00Z",
              },
            ],
            metrics: [{ name: "Duration", value: "2m" }],
            observations: ["Cleanup recommended"],
            overallStatus: "partial_failure",
            summary: "One warning found",
          } satisfies MergedFindings,
          state: ToolStateEnum.OutputAvailable,
          toolCallId: "456",
          type: "tool-logAnalyzerTool",
        }}
      />,
    );
    expect(screen.getByText("Analyzed logs")).toBeInTheDocument();
    expect(screen.queryByDataCy("tool-output")).not.toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: /expand additional content/i }),
    );
    expect(screen.getByText("Partial failure")).toBeInTheDocument();
    expect(screen.getByText("One warning found")).toBeInTheDocument();
    const findingSummary = screen.getByText("Disk nearly full");
    expect(findingSummary).toBeInTheDocument();
    const details = findingSummary.closest("details");
    expect(details).not.toBeNull();
    expect(details).not.toHaveAttribute("open");
    await user.click(findingSummary);
    expect(details).toHaveAttribute("open");
    expect(screen.getByText("95% used")).toBeInTheDocument();
    expect(screen.getByText("No line")).toBeInTheDocument();
    expect(screen.getByText("Task started")).toBeInTheDocument();
    expect(screen.getByText("2026-04-22T14:00:00Z")).toBeInTheDocument();
    expect(screen.getByText("Duration")).toBeInTheDocument();
    expect(screen.getByText("2m")).toBeInTheDocument();
    expect(screen.getByText("Cleanup recommended")).toBeInTheDocument();
  });

  it("does not render findings when output does not match MergedFindings shape", () => {
    render(
      <ToolRenderer
        {...{
          input: "test",
          output: { result: "analysis complete" },
          state: ToolStateEnum.OutputAvailable,
          toolCallId: "456",
          type: "tool-logAnalyzerTool",
        }}
      />,
    );
    expect(screen.getByText("Analyzed logs")).toBeInTheDocument();
    expect(screen.queryByText("analysis complete")).not.toBeInTheDocument();
    expect(screen.queryByDataCy("tool-output")).not.toBeInTheDocument();
  });

  it("does not render expandable content for askEvergreenAgentTool", () => {
    render(
      <ToolRenderer
        {...{
          input: "test",
          output: { steps: { "123": { endedAt: 2, startedAt: 1 } } },
          state: ToolStateEnum.OutputAvailable,
          toolCallId: "123",
          type: "tool-askEvergreenAgentTool",
        }}
      />,
    );
    expect(
      screen.getByText("Received information from the Evergreen Agent"),
    ).toBeInTheDocument();
  });
});
