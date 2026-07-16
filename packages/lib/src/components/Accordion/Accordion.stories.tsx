import { CustomMeta, CustomStoryObj } from "test_utils/types";
import Accordion, { AccordionCaretAlign, AccordionCaretIcon } from ".";

export default {
  args: {
    caretAlign: AccordionCaretAlign.Center,
    caretIcon: AccordionCaretIcon.Chevron,
    defaultOpen: false,
    disableAnimations: true,
    useIndent: true,
  },
  argTypes: {
    caretAlign: {
      control: "radio",
      description: "Where the caret icon should be aligned",
      options: [
        AccordionCaretAlign.Start,
        AccordionCaretAlign.Center,
        AccordionCaretAlign.End,
      ],
    },
    caretIcon: {
      control: "radio",
      description: "What glyph to use for the caret icon",
      options: [AccordionCaretIcon.Caret, AccordionCaretIcon.Chevron],
    },
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
  },
  component: Accordion,
} satisfies CustomMeta<typeof Accordion>;

export const Default: CustomStoryObj<typeof Accordion> = {
  args: {
    children: "Accordion content",
    title: "Accordion",
  },
  render: (args) => <Accordion {...args} />,
};

export const WithSubtitle: CustomStoryObj<typeof Accordion> = {
  args: {
    children: "Accordion content",
    subtitle: "Subtitle",
    title: "Accordion",
  },
  render: (args) => <Accordion {...args} />,
};

export const WithToggledTitle: CustomStoryObj<typeof Accordion> = {
  args: {
    children: "Accordion content",
    title: "Some really long title that will be replaced because ...",
    toggledTitle: (
      <div>
        <div>Some really long title that will be replaced because</div>
        <div>it&apos;s too long and we want to fit more content</div>
      </div>
    ),
  },
  render: (args) => <Accordion {...args} />,
};
