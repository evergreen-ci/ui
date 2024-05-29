import { TaskFilesQuery } from "gql/generated/types";
import { Unpacked } from "types/utils";

export type GroupedFiles = Unpacked<
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  TaskFilesQuery["task"]["files"]["groupedFiles"]
>;
