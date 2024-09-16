import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import Accordion from ".";

export default {
  component: Accordion,
} satisfies CustomMeta<typeof Accordion>;

export const Default: CustomStoryObj<typeof Accordion> = {
  args: {
    children: "Accordion content",
    subtitle: "Subtitle",
    title: "Accordion",
    toggledTitle: "Toggled Accordion",
  },
  render: (args) => <Accordion {...args} />,
};
