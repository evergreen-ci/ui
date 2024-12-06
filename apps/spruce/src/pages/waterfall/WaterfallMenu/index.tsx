import { useState } from "react";
import { ButtonDropdown } from "components/ButtonDropdown";
import { GitCommitSearch } from "./GitCommitSearch";

export const WaterfallMenu: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const dropdownItems = [
    <GitCommitSearch key="git-commit-search" setMenuOpen={setMenuOpen} />,
  ];

  return (
    <ButtonDropdown
      data-cy="waterfall-menu"
      dropdownItems={dropdownItems}
      open={menuOpen}
      setOpen={setMenuOpen}
      size="default"
    />
  );
};
