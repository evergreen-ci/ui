import { type IconProps } from "@evg-ui/lib/components/Icon";
import { useWaterfallAnalytics } from "analytics";
import FilterChips, { useFilterChipQueryParams } from "components/FilterChips";
import { WaterfallFilterOptions } from "./types";

export const TextFilterChips = () => {
  const { sendEvent } = useWaterfallAnalytics();

  const { chips, handleClearAll, handleOnRemove } = useFilterChipQueryParams(
    validQueryParams,
    urlParamToTitleMap,
  );

  return (
    <FilterChips
      chips={chips}
      onClearAll={() => {
        sendEvent({ name: "Deleted all filter chips" });
        handleClearAll();
      }}
      onRemove={(b) => {
        sendEvent({ name: "Deleted one filter chip" });
        handleOnRemove(b);
      }}
    />
  );
};

const validQueryParams = new Set([
  WaterfallFilterOptions.BuildVariant,
  WaterfallFilterOptions.VariantTags,
  WaterfallFilterOptions.Task,
  WaterfallFilterOptions.TaskTags,
]);

const urlParamToTitleMap = {
  [WaterfallFilterOptions.BuildVariant]: {
    label: "Variant",
    glyph: "String",
  },
  [WaterfallFilterOptions.VariantTags]: {
    label: "Variant",
    glyph: "Tag",
  },
  [WaterfallFilterOptions.Task]: {
    label: "Task",
    glyph: "String",
  },
  [WaterfallFilterOptions.TaskTags]: {
    label: "Task",
    glyph: "Tag",
  },
} satisfies Record<string, { label: string; glyph: IconProps["glyph"] }>;
