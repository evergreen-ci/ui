import { size } from "@evg-ui/lib/constants/tokens";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { renderableToolLabels } from "./constants";
import { ToolRenderer } from "./ToolRenderer";

export default {
  component: ToolRenderer,
} satisfies CustomMeta<typeof ToolRenderer>;

const allToolStates = [
  "output-error",
  "input-streaming",
  "input-available",
  "output-available",
];
export const Default = {
  argTypes: {
    type: {
      control: { type: "select" },
      options: Object.keys(renderableToolLabels),
    },
    state: {
      control: { type: "select" },
      options: allToolStates,
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
      options: allToolStates,
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
