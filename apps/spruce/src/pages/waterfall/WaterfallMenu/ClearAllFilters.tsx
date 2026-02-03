import { Icon } from "@evg-ui/lib/components";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { useWaterfallAnalytics } from "analytics";
import { DropdownItem } from "components/ButtonDropdown";
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
    <DropdownItem
      data-cy="clear-all-filters"
      glyph={<Icon glyph="NoFilter" />}
      onClick={handleClick}
    >
      Clear all filters
    </DropdownItem>
  );
};
