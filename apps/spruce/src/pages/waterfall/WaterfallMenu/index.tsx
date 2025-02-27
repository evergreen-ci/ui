import { useState } from "react";
import { ButtonDropdown } from "components/ButtonDropdown";
import { walkthroughSteps, waterfallGuideId } from "../constants";
import { AddNotification } from "./AddNotification";
import { ClearAllFilters } from "./ClearAllFilters";
import { GitCommitSearch } from "./GitCommitSearch";
import { JumpToMostRecent } from "./JumpToMostRecent";

const menuProps = { [waterfallGuideId]: walkthroughSteps[4].targetId };

type Props = {
  projectIdentifier: string;
};

export const WaterfallMenu: React.FC<Props> = ({ projectIdentifier }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const dropdownItems = [
    <GitCommitSearch key="git-commit-search" setMenuOpen={setMenuOpen} />,
    <JumpToMostRecent key="jump-to-most-recent" setMenuOpen={setMenuOpen} />,
    <ClearAllFilters key="clear-all-filters" setMenuOpen={setMenuOpen} />,
    <AddNotification
      key="add-notification"
      projectIdentifier={projectIdentifier}
      setMenuOpen={setMenuOpen}
    />,
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
