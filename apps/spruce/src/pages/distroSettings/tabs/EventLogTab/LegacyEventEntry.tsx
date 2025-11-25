import { Code } from "@leafygreen-ui/code";
import { JSONValue } from "utils/object/types";

export const LegacyEventEntry: React.FC<{ data: JSONValue }> = ({ data }) => (
  <Code data-cy="legacy-event" language="json">
    {JSON.stringify(data, null, 2)}
  </Code>
);
