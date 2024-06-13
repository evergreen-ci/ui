// TODO: Relocate story to @evg-ui/components package
import { useState } from "react";
import { TextInputWithGlyph } from "@evg-ui/lib/components/TextInputWithGlyph";
import Icon from "components/Icon";
import { CustomStoryObj, CustomMeta } from "test_utils/types";

export default {
  title: "Components/TextInput/TextInputWithGlyph",
  component: TextInputWithGlyph,
} satisfies CustomMeta<typeof TextInputWithGlyph>;

export const Default: CustomStoryObj<typeof TextInputWithGlyph> = {
  render: (args) => <Input {...args} />,
  args: {
    label: "Some search field",
    placeholder: "Search",
  },
};

// @ts-expect-error: FIXME. This comment was added by an automated script.
const Input = (props) => {
  const [value, setValue] = useState("");
  return (
    <TextInputWithGlyph
      icon={<Icon glyph="MagnifyingGlass" />}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  );
};
