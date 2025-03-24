import { JSONObject, JSONValue } from "utils/object/types";

export type Event = {
  after?: JSONObject;
  before?: JSONObject;
  data?: JSONObject;
  timestamp: Date;
  user: string;
};

export type EventDiffLine = {
  key: string;
  before: JSONValue;
  after: JSONValue;
};
