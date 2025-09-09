import { render, screen } from "@evg-ui/lib/test_utils";
import { ToolStateEnum } from "./types";
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
});
