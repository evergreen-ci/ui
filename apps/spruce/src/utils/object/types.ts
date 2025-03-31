type Primitive = string | number | boolean | null | undefined;
type JSONObject = { [key: string]: JSONValue };
type JSONArray = JSONValue[];
type JSONValue = Primitive | JSONArray | JSONObject | Date;

export type { JSONValue, JSONObject, JSONArray, Primitive };
