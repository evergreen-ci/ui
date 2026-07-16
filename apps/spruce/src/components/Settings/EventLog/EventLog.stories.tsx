import { actions } from "storybook/actions";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { Event } from "./types";
import EventLog from ".";

const event: Event = {
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
  timestamp: new Date("2024-08-31T00:00:00.000Z"),
  user: "Mohamed Khelif",
};

export default {
  component: EventLog,
} satisfies CustomMeta<typeof EventLog>;

export const Default: CustomStoryObj<typeof EventLog> = {
  args: {
    customKeyValueRenderConfig: {
      customKey: (value) => <b style={{ color: "red" }}>{value}</b>,
    },
    events: [event],
    handleFetchMore: () => actions("handleFetchMore"),
    lastFetchedCount: 1,
    limit: 15,
    loading: false,
  },
  argTypes: {},
  render: (args) => <EventLog {...args} />,
};

export const CustomEventRenderer: CustomStoryObj<typeof EventLog> = {
  args: {
    customKeyValueRenderConfig: {
      customKey: (value) => <b style={{ color: "red" }}>{value}</b>,
    },
    events: [event],
    handleFetchMore: () => actions("handleFetchMore"),
    lastFetchedCount: 1,
    limit: 15,
    loading: false,
  },
  argTypes: {},
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
};
