import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import EventDiffTable from ".";

export default {
  component: EventDiffTable,
} satisfies CustomMeta<typeof EventDiffTable>;

export const Default: CustomStoryObj<typeof EventDiffTable> = {
  render: (args) => <EventDiffTable {...args} />,
  argTypes: {},
  args: {
    after: {
      stringField: "updated value",
      numberField: 1,
      booleanField: true,
      deletedField: undefined,
      addedField: "added value",
      nested: {
        array: [1, 2, 3],
        object: {
          key: "value",
          value: "value",
        },
      },
      customKey: "modified value",
    },
    before: {
      stringField: "original value",
      numberField: 96,
      booleanField: false,
      deletedField: "deleted value",
      addedField: undefined,
      nested: {
        array: [4, 5, 6],
        object: {
          key: "modified value",
          value: "value",
        },
      },
      customKey: "custom value",
    },
    customKeyValueRenderConfig: {
      customKey: (value) => <b style={{ color: "red" }}>{value}</b>,
    },
  },
};

export const ShiftedList: CustomStoryObj<typeof EventDiffTable> = {
  args: {
    before: {
      projectRef: {
        admins: [
          "jonathan.brill",
          "annie.black",
          "mohamed.khelif",
          "sophie.stadler",
          "chaya.malik",
        ],
      },
    },
    after: {
      projectRef: {
        admins: [
          "bynn.lee",
          "jonathan.brill",
          "annie.black",
          "mohamed.khelif",
          "sophie.stadler",
          "chaya.malik",
        ],
      },
    },
  },
};

export const UpdatedArrayObject: CustomStoryObj<typeof EventDiffTable> = {
  args: {
    before: {
      subscriptions: [
        {
          id: "668c0cafd004f70007891cf1",
          subscriber: { type: "email" },
          trigger: { requesters: ["patch"] },
        },
      ],
    },
    after: {
      subscriptions: [
        {
          id: "668c0cafd004f70007891cf1",
          subscriber: { type: "email" },
          trigger: { requesters: ["git_tag_request"] },
        },
      ],
    },
  },
};
