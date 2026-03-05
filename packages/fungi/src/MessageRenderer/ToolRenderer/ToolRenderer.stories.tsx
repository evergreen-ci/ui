import { size } from "@evg-ui/lib/constants/tokens";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { ToolStateEnum } from "../types";
import { renderableToolLabels } from "./constants";
import { ToolRenderer } from ".";

export default {
  component: ToolRenderer,
} satisfies CustomMeta<typeof ToolRenderer>;

export const Default = {
  argTypes: {
    type: {
      control: { type: "select" },
      options: Object.keys(renderableToolLabels),
    },
    state: {
      control: { type: "select" },
      options: Object.values(ToolStateEnum),
      type: "string",
    },
  },
  args: {
    type: "tool-askEvergreenAgentTool",
    state: "output-available",
  },
} satisfies CustomStoryObj<typeof ToolRenderer>;

export const AllTools = {
  argTypes: {
    state: {
      control: { type: "select" },
      options: Object.values(ToolStateEnum),
      type: "string",
    },
  },
  render: (args) => (
    <>
      {Object.keys(renderableToolLabels).map((tool) => (
        <div key={tool} style={{ padding: `${size.xs} 0` }}>
          <ToolRenderer {...args} type={tool as `tool-${string}`} />
        </div>
      ))}
    </>
  ),
} satisfies CustomStoryObj<typeof ToolRenderer>;

export const AnalyzerProgress = {
  args: {
    type: "tool-logCoreAnalyzerTool",
    toolCallId: "call_example",
    state: "input-available",
    input: "analyze logs",
    progress: { percentage: 50, phase: "Refining chunk 3 of 5" },
  },
} satisfies CustomStoryObj<typeof ToolRenderer>;
