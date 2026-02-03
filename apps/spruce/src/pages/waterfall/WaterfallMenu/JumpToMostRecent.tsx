import { Icon } from "@evg-ui/lib/components";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { useWaterfallAnalytics } from "analytics";
import { DropdownItem } from "components/ButtonDropdown";
import { WaterfallFilterOptions } from "../types";

interface Props {
  setMenuOpen: (open: boolean) => void;
}

export const JumpToMostRecent: React.FC<Props> = ({ setMenuOpen }) => {
  const { sendEvent } = useWaterfallAnalytics();
  const [queryParams, setQueryParams] = useQueryParams();

  const handleClick = () => {
    sendEvent({ name: "Clicked jump to most recent commit button" });
    setQueryParams({
      ...queryParams,
      [WaterfallFilterOptions.Date]: undefined,
      [WaterfallFilterOptions.Revision]: undefined,
      [WaterfallFilterOptions.MaxOrder]: undefined,
      [WaterfallFilterOptions.MinOrder]: undefined,
    });
    setMenuOpen(false);
  };

  return (
    <DropdownItem
      data-cy="jump-to-most-recent"
      glyph={<Icon glyph="ClockWithArrow" />}
      onClick={handleClick}
    >
      Jump to most recent commit
    </DropdownItem>
  );
};
