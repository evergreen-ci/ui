import { Unpacked } from "@evg-ui/lib/types/utils";
import { TaskFilesQuery } from "gql/generated/types";

export type GroupedFiles = Unpacked<
  NonNullable<TaskFilesQuery["task"]>["files"]["groupedFiles"]
>;
