import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { getUserMock } from "gql/mocks/getUser";

import DateSeparator from ".";

export default {
  component: DateSeparator,
  title: "components/HistoryTable/DateSeparator",
} satisfies CustomMeta<typeof DateSeparator>;

export const DateSeparatorStory: CustomStoryObj<typeof DateSeparator> = {
  args: {
    date: new Date("2021-01-01"),
  },
  parameters: {
    apolloClient: {
      mocks: [getUserMock],
    },
  },
  render: (args) => <DateSeparator {...args} />,
};
