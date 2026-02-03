import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils";
import { CaseSensitivity, MatchType } from "constants/enums";
import FilterGroup from ".";

export default {
  component: FilterGroup,
} satisfies CustomMeta<typeof FilterGroup>;

export const Default: CustomStoryObj<typeof FilterGroup> = {
  argTypes: {},
  args: {
    deleteFilter: () => {},
    editFilter: () => {},
    filter: {
      caseSensitive: CaseSensitivity.Sensitive,
      expression: "Some Filter Expression",
      matchType: MatchType.Exact,
      visible: true,
    },
  },
  render: (args) => <FilterGroup {...args} />,
};
