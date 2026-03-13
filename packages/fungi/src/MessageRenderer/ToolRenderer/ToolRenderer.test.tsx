import { render, screen } from "@evg-ui/lib/test_utils";
import { ToolStateEnum } from "../types";
import { ToolRenderer } from ".";

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
          type: "tool-logCoreAnalyzerTool",
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
          type: "tool-logCoreAnalyzerTool",
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
          type: "tool-logCoreAnalyzerTool",
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
});
