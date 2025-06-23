import { useState } from "react";
import Icon from "@leafygreen-ui/icon";
import { InlineKeyCode } from "@leafygreen-ui/typography";
import { Meta, StoryObj } from "@storybook/react-vite";
import { TextInputWithGlyph, TextInputWithGlyphProps } from ".";

export default {
  title: "Components/TextInput/TextInputWithGlyph",
  component: TextInputWithGlyph,
} satisfies Meta<typeof TextInputWithGlyph>;

export const Default: StoryObj<typeof TextInputWithGlyph> = {
  render: (args) => <Input {...args} />,
  args: {
    label: "Some search field",
    placeholder: "Search",
  },
};

const Input = (props: TextInputWithGlyphProps) => {
  const [value, setValue] = useState("");
  return (
    <TextInputWithGlyph
      {...props}
      icon={<Icon glyph="MagnifyingGlass" />}
      onChange={(e) => setValue(e.target.value)}
      value={value}
    />
  );
};

const InputWithPersistentPlaceholder = (props: TextInputWithGlyphProps) => {
  const [value, setValue] = useState("Test");
  return (
    <TextInputWithGlyph
      {...props}
      onChange={(e) => setValue(e.target.value)}
      persistentPlaceholder={
        value.length > 0 ? (
          <span>
            {value} <InlineKeyCode>Tab</InlineKeyCode> to complete
          </span>
        ) : null
      }
      value={value}
    />
  );
};

export const WithPersistentPlaceholder: StoryObj<typeof TextInputWithGlyph> = {
  render: (args) => <InputWithPersistentPlaceholder {...args} />,
  args: {
    label: "Some search field",
    placeholder: "Search",
  },
};
