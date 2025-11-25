import { useState } from "react";
import { Icon } from "@leafygreen-ui/icon";
import { InlineKeyCode } from "@leafygreen-ui/typography";
import { Meta, StoryObj } from "@storybook/react-vite";
import { TextInputWithGlyph } from ".";

export default {
  title: "Components/TextInput/TextInputWithGlyph",
  component: TextInputWithGlyph,
} satisfies Meta<typeof TextInputWithGlyph>;

export const Default: StoryObj<typeof TextInputWithGlyph> = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <TextInputWithGlyph
        {...args}
        icon={<Icon glyph="MagnifyingGlass" />}
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
    );
  },
  args: {
    label: "Some search field",
    placeholder: "Search",
  },
};

export const WithPersistentPlaceholder: StoryObj<typeof TextInputWithGlyph> = {
  render: (args) => {
    const [value, setValue] = useState("Test");
    return (
      <TextInputWithGlyph
        {...args}
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
  },
  args: {
    label: "Some search field",
    placeholder: "Search",
  },
};
