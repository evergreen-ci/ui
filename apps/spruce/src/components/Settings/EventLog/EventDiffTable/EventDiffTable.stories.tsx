import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import EventDiffTable from ".";

export default {
  component: EventDiffTable,
} satisfies CustomMeta<typeof EventDiffTable>;

export const Default: CustomStoryObj<typeof EventDiffTable> = {
  args: {
    after: {
      addedField: "added value",
      booleanField: true,
      customKey: "modified value",
      deletedField: undefined,
      nested: {
        array: [1, 2, 3],
        object: {
          key: "value",
          value: "value",
        },
      },
      numberField: 1,
      stringField: "updated value",
    },
    before: {
      addedField: undefined,
      booleanField: false,
      customKey: "custom value",
      deletedField: "deleted value",
      nested: {
        array: [4, 5, 6],
        object: {
          key: "modified value",
          value: "value",
        },
      },
      numberField: 96,
      stringField: "original value",
    },
    customKeyValueRenderConfig: {
      customKey: (value) => <b style={{ color: "red" }}>{value}</b>,
    },
  },
  argTypes: {},
  render: (args) => <EventDiffTable {...args} />,
};
