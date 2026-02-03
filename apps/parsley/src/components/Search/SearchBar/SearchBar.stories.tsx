import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils";
import { SearchSuggestionGroup } from "./SearchPopover/types";

import SearchBar from ".";

export default {
  component: SearchBar,
} satisfies CustomMeta<typeof SearchBar>;

export const Default: CustomStoryObj<typeof SearchBar> = {
  argTypes: {
    disabled: { control: "boolean", description: "Should disable input" },
    validator: {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      control: "func",
      defaultValue: "() => true",
      description: "Function to validate input",
    },
  },
  args: {
    disabled: false,
    searchSuggestions: [],
    validator(value) {
      return value.length > 3;
    },
  },
};

const mockSearchSuggestions: SearchSuggestionGroup[] = [
  {
    suggestions: [
      "console.log",
      "console.warn",
      "console.debug",
      "console.error",
    ],
    title: "Console Methods",
  },
  {
    suggestions: [
      "console.table",
      "console.group",
      "console.time",
      "console.timeEnd",
    ],
    title: "Console Advanced",
  },
  {
    suggestions: [
      "console.clear",
      "console.dir",
      "console.count",
      "console.info",
    ],
    title: "Console Utility",
  },
];

export const WithSearchSuggestions: CustomStoryObj<typeof SearchBar> = {
  argTypes: {
    disabled: { control: "boolean", description: "Should disable input" },
    validator: {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      control: "func",
      defaultValue: "() => true",
      description: "Function to validate input",
    },
  },
  args: {
    disabled: false,
    searchSuggestions: mockSearchSuggestions,
    validator(value) {
      return value !== "bad";
    },
  },
};
