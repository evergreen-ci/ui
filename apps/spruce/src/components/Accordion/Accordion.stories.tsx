import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { Accordion } from ".";

export default {
  component: Accordion,
  argTypes: {
    defaultOpen: {
      control: "boolean",
      description: "Whether the accordion should be open by default",
    },
    disableAnimation: {
      control: "boolean",
      description:
        "Whether the accordion should animate when opening and closing",
    },
    shouldRenderChildIfHidden: {
      control: "boolean",
      description:
        "Whether the child component should be rendered if the accordion is collapsed",
    },
    toggleFromBottom: {
      control: "boolean",
      description: "Whether the accordion should toggle from the bottom",
    },
    useIndent: {
      control: "boolean",
      description: "Whether the accordion content should have an indent",
    },
    showCaret: {
      control: "boolean",
      description: "Whether the accordion should show a caret icon",
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
