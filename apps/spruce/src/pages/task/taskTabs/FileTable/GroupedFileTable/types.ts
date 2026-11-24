import { Unpacked } from "@evg-ui/lib/types/utils";
import { GroupedFiles } from "../types";

export type GroupedFilesFile = Unpacked<NonNullable<GroupedFiles["files"]>>;

export type AssociatedLink = {
  link: string;
  name: string;
};

export type FileTableRow = {
  associatedLinks: AssociatedLink[];
  name: string;
  link: string | null;
  urlParsley: string | null;
};
