import { useMemo } from "react";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { WaterfallFilterOptions } from "./types";

const parseOptions = { parseBooleans: false, parseNumbers: false };

export const useTaskTagFilter = () => {
  const [tags] = useQueryParam<string[]>(
    WaterfallFilterOptions.TaskTags,
    [],
    parseOptions,
  );
  return useMemo(
    () => tags.filter((tag) => typeof tag === "string" && tag.length > 0),
    [tags],
  );
};
