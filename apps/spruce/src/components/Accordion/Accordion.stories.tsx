import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { Accordion } from ".";

export default {
  component: Accordion,
  argTypes: {
    defaultOpen: {
      control: "boolean",
    },
    disableAnimation: {
      control: "boolean",
    },
    shouldRenderChildIfHidden: {
      control: "boolean",
    },
    toggleFromBottom: {
      control: "boolean",
    },
    useIndent: {
      control: "boolean",
    },
  },
} satisfies CustomMeta<typeof Accordion>;

export const Default: CustomStoryObj<typeof Accordion> = {
  render: (args) => <Accordion {...args} />,
  args: {
    title: "Accordion",
    children: "Accordion content",
  },
};

export const WithSubtitle: CustomStoryObj<typeof Accordion> = {
  render: (args) => <Accordion {...args} />,
  args: {
    title: "Accordion",
    subtitle: "Subtitle",
    children: "Accordion content",
  },
};
