import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils";
import MetadataCard, { MetadataItem, MetadataLabel } from ".";

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
        <MetadataItem>
          <MetadataLabel>Metadata Label 1:</MetadataLabel> Metadata Value 1
        </MetadataItem>
        <MetadataItem tooltipDescription="This is a tooltip description">
          <MetadataLabel>Metadata Label 2:</MetadataLabel> Metadata Value 2
        </MetadataItem>
        <MetadataItem>
          <MetadataLabel color="red">Metadata Label 3:</MetadataLabel> Metadata
          Value 3
        </MetadataItem>
      </MetadataCard>
    </div>
  ),
};
