import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils";
import { SearchSuggestionGroup } from "./types";
import SearchPopover from ".";

const mockSearchSuggestions: SearchSuggestionGroup[] = [
  {
    suggestions: ["ERROR", "FATAL", "Exception", "error:", "failed"],
    title: "Error Patterns",
  },
  {
    suggestions: ["WARNING", "WARN", "warning:", "deprecated"],
    title: "Warning Patterns",
  },
  {
    suggestions: ["INFO", "DEBUG", "TRACE", "info:"],
    title: "Info Patterns",
  },
  {
    suggestions: [".*error.*", "^ERROR", "\\d{4}-\\d{2}-\\d{2}", "[A-Z]+:"],
    title: "Regular Expressions",
  },
];

export default {
  component: SearchPopover,
  parameters: {
    docs: {
      description: {
        component:
          "A popover component that displays grouped search suggestions with keyboard navigation support.",
      },
    },
  },
  title: "Search/SearchPopover",
} satisfies CustomMeta<typeof SearchPopover>;

export const Default: CustomStoryObj<typeof SearchPopover> = {
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Whether the popover trigger is disabled",
    },
    onClick: {
      action: "suggestion-clicked",
      description: "Callback fired when a suggestion is clicked",
    },
    searchSuggestions: {
      control: "object",
      description: "Array of grouped search suggestions",
    },
  },
  args: {
    disabled: false,
    onClick: (suggestion: string) => {
      console.log("Selected suggestion:", suggestion);
    },
    searchSuggestions: mockSearchSuggestions,
  },
};

export const EmptyState: CustomStoryObj<typeof SearchPopover> = {
  args: {
    disabled: false,
    onClick: (suggestion: string) => {
      console.log("Selected suggestion:", suggestion);
    },
    searchSuggestions: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Displays the empty state when no search suggestions are provided.",
      },
    },
  },
};

export const SingleGroup: CustomStoryObj<typeof SearchPopover> = {
  args: {
    disabled: false,
    onClick: (suggestion: string) => {
      console.log("Selected suggestion:", suggestion);
    },
    searchSuggestions: [
      {
        suggestions: [
          "console.log",
          "console.warn",
          "console.error",
          "console.debug",
        ],
        title: "Console Methods",
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Shows a single group of search suggestions.",
      },
    },
  },
};

export const Disabled: CustomStoryObj<typeof SearchPopover> = {
  args: {
    disabled: true,
    onClick: (suggestion: string) => {
      console.log("Selected suggestion:", suggestion);
    },
    searchSuggestions: mockSearchSuggestions,
  },
  parameters: {
    docs: {
      description: {
        story: "Shows the disabled state of the search popover.",
      },
    },
  },
};
