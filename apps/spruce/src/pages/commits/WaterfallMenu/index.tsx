import { useState } from "react";
import { ButtonDropdown } from "components/ButtonDropdown";
import { walkthroughSteps, waterfallGuideId } from "pages/waterfall/constants";
import { AddNotification } from "./AddNotification";
import { GitCommitSearch } from "./GitCommitSearch";

const menuProps = { [waterfallGuideId]: walkthroughSteps[5].targetId };

export const WaterfallMenu: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const dropdownItems = [
    <AddNotification key="add-notification" setMenuOpen={setMenuOpen} />,
    <GitCommitSearch key="git-commit-search" setMenuOpen={setMenuOpen} />,
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
