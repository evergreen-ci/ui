import { useState } from "react";
import Icon from "@leafygreen-ui/icon";
import { Meta, StoryObj } from "@storybook/react";
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
      value={value}
      onChange={(e) => setValue(e.target.value)}
      icon={<Icon glyph="MagnifyingGlass" />}
    />
  );
};
