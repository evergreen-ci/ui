import { render, screen, userEvent } from "@evg-ui/lib/test_utils";
import { ToolStateEnum } from "../types";
import { MergedFindings } from "./utils";
import { ToolRenderer } from ".";

const baseFindings: MergedFindings = {
  summary: "Two issues",
  overallStatus: "failure",
  errors: [],
  events: [],
  metrics: [],
  observations: [],
};

describe("ToolRenderer", () => {
  it("renders a tool with a loading state if the output is not available", () => {
    const { rerender } = render(
      <ToolRenderer
        {...{
          type: "tool-askEvergreenAgentTool",
          toolCallId: "123",
          state: ToolStateEnum.InputStreaming,
          input: "test",
        }}
      />,
    );
    expect(
      screen.getByText("Asking Evergreen Agent for more information"),
    ).toBeInTheDocument();
    rerender(
      <ToolRenderer
        {...{
          type: "tool-askEvergreenAgentTool",
          state: ToolStateEnum.InputAvailable,
          toolCallId: "123",
          input: "test",
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
          type: "tool-askEvergreenAgentTool",
          state: ToolStateEnum.OutputAvailable,
          toolCallId: "123",
          input: "test",
          output: { steps: { "123": { startedAt: 1, endedAt: 2 } } },
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
          type: "tool-someRandomBackgroundTool",
          state: ToolStateEnum.OutputAvailable,
          toolCallId: "123",
          input: "test",
          output: { steps: { "123": { startedAt: 1, endedAt: 2 } } },
        }}
      />,
    );
    expect(screen.queryByDataCy("tool-use-chip")).not.toBeInTheDocument();
  });

  it("renders a tool with an error state if the output is an error", () => {
    render(
      <ToolRenderer
        {...{
          type: "tool-askEvergreenAgentTool",
          state: ToolStateEnum.OutputError,
          toolCallId: "123",
          input: "test",
          errorText: "Error fetching information from Evergreen Agent",
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
          type: "tool-logAnalyzerTool",
          state: ToolStateEnum.InputAvailable,
          toolCallId: "456",
          input: "test",
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
          type: "tool-logAnalyzerTool",
          state: ToolStateEnum.InputAvailable,
          toolCallId: "456",
          input: "test",
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
          type: "tool-logAnalyzerTool",
          state: ToolStateEnum.OutputAvailable,
          toolCallId: "456",
          input: "test",
          output: { result: "analysis complete" },
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
          type: "tool-logAnalyzerTool",
          state: ToolStateEnum.OutputAvailable,
          toolCallId: "456",
          input: "test",
          output: {
            ...baseFindings,
            errors: [
              {
                line: 42,
                severity: "error",
                message: "Null pointer",
                evidence: "NPE",
              },
              {
                line: 87,
                severity: "warning",
                message: "Memory leak",
                evidence: "Leak",
              },
            ],
          } satisfies MergedFindings,
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
          type: "tool-logAnalyzerTool",
          state: ToolStateEnum.OutputAvailable,
          toolCallId: "456",
          input: "test",
          output: {
            summary: "One warning found",
            overallStatus: "partial_failure",
            errors: [
              {
                line: null,
                severity: "warning",
                message: "Disk nearly full",
                evidence: "95% used",
              },
            ],
            events: [
              {
                line: 10,
                timestamp: "2026-04-22T14:00:00Z",
                description: "Task started",
              },
            ],
            metrics: [{ name: "Duration", value: "2m" }],
            observations: ["Cleanup recommended"],
          } satisfies MergedFindings,
        }}
      />,
    );
    expect(screen.getByText("Analyzed logs")).toBeInTheDocument();
    expect(screen.queryByDataCy("tool-output")).not.toBeInTheDocument();
    await user.click(screen.getByLabelText("Expand additional content"));
    expect(screen.getByText("Partial failure")).toBeInTheDocument();
    expect(screen.getByText("One warning found")).toBeInTheDocument();
    expect(screen.getByText("Disk nearly full")).toBeInTheDocument();
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
          type: "tool-logAnalyzerTool",
          state: ToolStateEnum.OutputAvailable,
          toolCallId: "456",
          input: "test",
          output: { result: "analysis complete" },
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
          type: "tool-askEvergreenAgentTool",
          state: ToolStateEnum.OutputAvailable,
          toolCallId: "123",
          input: "test",
          output: { steps: { "123": { startedAt: 1, endedAt: 2 } } },
        }}
      />,
    );
    expect(
      screen.getByText("Received information from the Evergreen Agent"),
    ).toBeInTheDocument();
  });
});
