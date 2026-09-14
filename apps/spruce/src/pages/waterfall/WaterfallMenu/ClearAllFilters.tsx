import { MenuItem, Text } from "@via-ds/components";
import Icon from "@evg-ui/lib/components/Icon";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { useWaterfallAnalytics } from "analytics";
import { WaterfallFilterOptions } from "../types";

interface ClearAllFiltersProps {
  setMenuOpen: (open: boolean) => void;
}

export const ClearAllFilters: React.FC<ClearAllFiltersProps> = ({
  setMenuOpen,
}) => {
  const { sendEvent } = useWaterfallAnalytics();
  const [queryParams, setQueryParams] = useQueryParams();

  const handleClick = () => {
    sendEvent({ name: "Clicked clear all filters button" });
    setQueryParams({
      ...queryParams,
      [WaterfallFilterOptions.BuildVariant]: undefined,
      [WaterfallFilterOptions.Task]: undefined,
      [WaterfallFilterOptions.Statuses]: undefined,
      [WaterfallFilterOptions.Requesters]: undefined,
      [WaterfallFilterOptions.Date]: undefined,
      [WaterfallFilterOptions.Revision]: undefined,
    });
    setMenuOpen(false);
  };

  return (
    <MenuItem
      data-testid="clear-all-filters"
      id="clear-all-filters"
      onAction={handleClick}
      textValue="Clear all filters"
    >
      <Icon glyph="NoFilter" slot="icon" />
      <Text>Clear all filters</Text>
    </MenuItem>
  );
};
