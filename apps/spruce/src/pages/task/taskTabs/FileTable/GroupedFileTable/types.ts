import { Unpacked } from "@evg-ui/lib/types/utils";
import { GroupedFiles } from "../types";

export type GroupedFilesFile = Unpacked<NonNullable<GroupedFiles["files"]>>;

export type FileTableRow = {
  name: string;
  link: string;
  urlParsley: string | null;
};
