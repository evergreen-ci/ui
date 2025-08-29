import { render, screen } from "@evg-ui/lib/test_utils";
import RenderToolUse from ".";

describe("RenderToolUse", () => {
  it("renders a tool with a loading state if the output is not available", () => {
    render(
      <RenderToolUse
        tool={{
          type: "tool-askEvergreenAgentTool",
          toolCallId: "123",
          state: "input-streaming",
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
      <RenderToolUse
        tool={{
          type: "tool-askEvergreenAgentTool",
          state: "output-available",
          toolCallId: "123",
          input: "test",
          output: { steps: { "123": { startedAt: 1, endedAt: 2 } } },
        }}
      />,
    );
    expect(
      screen.getByText("Asked Evergreen Agent for more information"),
    ).toBeInTheDocument();
  });
  it("does not render a tool if it should not be a ui tool", () => {
    render(
      <RenderToolUse
        tool={{
          type: "tool-someRandomBackgroundTool",
          state: "output-available",
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
      <RenderToolUse
        tool={{
          type: "tool-askEvergreenAgentTool",
          state: "output-error",
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
