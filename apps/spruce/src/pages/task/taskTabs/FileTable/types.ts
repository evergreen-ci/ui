import { TaskFilesQuery } from "gql/generated/types";
import { Unpacked } from "types/utils";

export type GroupedFiles = Unpacked<
  // @ts-ignore: FIXME. This comment was added by an automated script.
  TaskFilesQuery["task"]["files"]["groupedFiles"]
>;
