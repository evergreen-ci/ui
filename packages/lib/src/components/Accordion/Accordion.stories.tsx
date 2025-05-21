import { CustomMeta, CustomStoryObj } from "test_utils/types";
import Accordion, { AccordionCaretAlign, AccordionCaretIcon } from ".";

export default {
  component: Accordion,
  argTypes: {
    defaultOpen: {
      control: "boolean",
      description: "Whether the accordion should be open by default",
    },
    disableAnimations: {
      control: "boolean",
      description:
        "Whether the accordion should animate when opening and closing",
    },
    useIndent: {
      control: "boolean",
      description: "Whether the accordion content should have an indent",
    },
    caretAlign: {
      control: "radio",
      options: [
        AccordionCaretAlign.Start,
        AccordionCaretAlign.Center,
        AccordionCaretAlign.End,
      ],
      description: "Where the caret icon should be aligned",
    },
    caretIcon: {
      control: "radio",
      options: [AccordionCaretIcon.Caret, AccordionCaretIcon.Chevron],
      description: "What glyph to use for the caret icon",
    },
  },
  args: {
    defaultOpen: false,
    disableAnimations: true,
    useIndent: true,
    caretAlign: AccordionCaretAlign.Center,
    caretIcon: AccordionCaretIcon.Chevron,
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

export const WithToggledTitle: CustomStoryObj<typeof Accordion> = {
  render: (args) => <Accordion {...args} />,
  args: {
    title: "Some really long title that will be replaced because ...",
    toggledTitle: (
      <div>
        <div>Some really long title that will be replaced because</div>
        <div>it&apos;s too long and we want to fit more content</div>
      </div>
    ),
    children: "Accordion content",
  },
};
