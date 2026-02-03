import { useState } from "react";
import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils";

import SearchableDropdown, { SearchableDropdownProps } from ".";

export default {
  component: SearchableDropdown,
} satisfies CustomMeta<typeof SearchableDropdown>;

export const Default: CustomStoryObj<SearchableDropdownProps<string>> = {
  render: (args) => <Dropdown options={["1", "2", "3"]} {...args} />,
  args: {
    allowMultiSelect: false,
    disabled: false,
    label: "Searchable Dropdown",
  },
};

export const CustomOption: CustomStoryObj<
  SearchableDropdownProps<{ label: string; value: string }>
> = {
  render: (args) => (
    <Dropdown
      allowMultiSelect
      label="Custom option select"
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      optionRenderer={(option, onClick, isChecked) => (
        <button
          key={option.value}
          onClick={() => onClick(option.value)}
          type="button"
        >
          {isChecked(option.value) && `✔️`}
          {option.label}
        </button>
      )}
      options={[
        {
          label: "Option 1",
          value: "1",
        },
        {
          label: "Option 2",
          value: "2",
        },
        {
          label: "Option 3",
          value: "3",
        },
      ]}
      {...args}
    />
  ),
};

// @ts-expect-error: FIXME. This comment was added by an automated script.
const Dropdown = (props) => {
  const [value, setValue] = useState([]);
  return <SearchableDropdown {...props} onChange={setValue} value={value} />;
};
