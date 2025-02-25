import { useState } from "react";
import { ButtonDropdown } from "components/ButtonDropdown";
import { walkthroughSteps, waterfallGuideId } from "../constants";
import { ClearAllFilters } from "./ClearAllFilters";
import { GitCommitSearch } from "./GitCommitSearch";
import { JumpToMostRecent } from "./JumpToMostRecent";

const menuProps = { [waterfallGuideId]: walkthroughSteps[4].targetId };

export const WaterfallMenu: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const dropdownItems = [
    <GitCommitSearch key="git-commit-search" setMenuOpen={setMenuOpen} />,
    <JumpToMostRecent key="jump-to-most-recent" setMenuOpen={setMenuOpen} />,
    <ClearAllFilters key="clear-all-filters" setMenuOpen={setMenuOpen} />,
  ];

  return (
    <ButtonDropdown
      data-cy="waterfall-menu"
      dropdownItems={dropdownItems}
      open={menuOpen}
      setOpen={setMenuOpen}
      size="default"
      {...menuProps}
    />
  );
};
