import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";
import MetadataCard, { MetadataItem } from ".";

export default {
  component: MetadataCard,
  argTypes: {
    loading: {
      control: { type: "boolean" },
    },
  },
  args: {
    loading: false,
    title: "Example Metadata Card",
  },
} satisfies CustomMeta<typeof MetadataCard>;

export const Default: CustomStoryObj<typeof MetadataCard> = {
  render: (args) => (
    <div style={{ width: 300 }}>
      <MetadataCard {...args}>
        <MetadataItem label="Metadata Label 1">Metadata Value 1</MetadataItem>
        <MetadataItem
          label="Metadata Label 2"
          tooltipDescription="This is a tooltip description"
        >
          Metadata Value 2
        </MetadataItem>
        <MetadataItem label="Metadata Label 3" labelColor="red">
          Metadata Value 3
        </MetadataItem>
      </MetadataCard>
    </div>
  ),
};
