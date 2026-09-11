import { MenuItem, Text } from "@via-ds/components";
import Icon from "@evg-ui/lib/components/Icon";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { useWaterfallAnalytics } from "analytics";
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
    <MenuItem
      data-testid="jump-to-most-recent"
      id="jump-to-most-recent"
      onAction={handleClick}
      textValue="Jump to most recent commit"
    >
      <Icon glyph="ClockWithArrow" slot="icon" />
      <Text>Jump to most recent commit</Text>
    </MenuItem>
  );
};
