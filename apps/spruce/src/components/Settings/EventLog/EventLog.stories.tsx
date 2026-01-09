import { actions } from "storybook/actions";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { Event } from "./types";
import EventLog from ".";

const event: Event = {
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
  timestamp: new Date("2024-08-31T00:00:00.000Z"),
  user: "Mohamed Khelif",
};

export default {
  component: EventLog,
} satisfies CustomMeta<typeof EventLog>;

export const Default: CustomStoryObj<typeof EventLog> = {
  render: (args) => <EventLog {...args} />,
  argTypes: {},
  args: {
    count: 1,
    events: [event],
    limit: 15,
    loading: false,
    previousCount: 0,
    customKeyValueRenderConfig: {
      customKey: (value) => <b style={{ color: "red" }}>{value}</b>,
    },
    handleFetchMore: () => actions("handleFetchMore"),
  },
};

export const CustomEventRenderer: CustomStoryObj<typeof EventLog> = {
  render: (args) => (
    <EventLog
      {...args}
      eventRenderer={(data) => (
        <div>
          <p>Custom event renderer</p>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    />
  ),
  argTypes: {},
  args: {
    count: 1,
    events: [event],
    limit: 15,
    loading: false,
    previousCount: 0,
    customKeyValueRenderConfig: {
      customKey: (value) => <b style={{ color: "red" }}>{value}</b>,
    },
    handleFetchMore: () => actions("handleFetchMore"),
  },
};
