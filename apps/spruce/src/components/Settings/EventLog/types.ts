import { JSONObject, JSONValue } from "utils/object/types";

export type Event = {
  after?: JSONObject | null;
  before?: JSONObject | null;
  data?: JSONObject | null;
  timestamp: Date;
  user: string;
};

export type EventDiffLine = {
  key: string;
  before: JSONValue;
  after: JSONValue;
};
