import { Unpacked } from "@evg-ui/lib/types/utils";
import { TaskFilesQuery } from "gql/generated/types";

export type GroupedFiles = Unpacked<
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  TaskFilesQuery["task"]["files"]["groupedFiles"]
>;
