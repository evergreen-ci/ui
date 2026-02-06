import { useState } from "react";
import { MenuGroup, MenuSeparator } from "@leafygreen-ui/menu";
import Icon from "@evg-ui/lib/components/Icon";
import { ButtonDropdown, DropdownItem } from "components/ButtonDropdown";
import { walkthroughSteps, waterfallGuideId } from "../constants";
import { AddNotification } from "./AddNotification";
import { ClearAllFilters } from "./ClearAllFilters";
import { GitCommitSearch } from "./GitCommitSearch";
import { JumpToMostRecent } from "./JumpToMostRecent";
import { OmitInactiveBuilds } from "./OmitInactiveBuilds";

type Props = {
  omitInactiveBuilds: boolean;
  projectIdentifier: string;
  restartWalkthrough: () => void;
  setOmitInactiveBuilds: (value: boolean) => void;
};

export const WaterfallMenu: React.FC<Props> = ({
  omitInactiveBuilds,
  projectIdentifier,
  restartWalkthrough,
  setOmitInactiveBuilds,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <ButtonDropdown
      data-cy="waterfall-menu"
      open={menuOpen}
      renderDarkMenu={false}
      setOpen={setMenuOpen}
      size="default"
      triggerProps={{ [waterfallGuideId]: walkthroughSteps[4].targetId }}
    >
      <GitCommitSearch key="git-commit-search" setMenuOpen={setMenuOpen} />
      <JumpToMostRecent key="jump-to-most-recent" setMenuOpen={setMenuOpen} />
      <ClearAllFilters key="clear-all-filters" setMenuOpen={setMenuOpen} />
      <AddNotification
        key="add-notification"
        projectIdentifier={projectIdentifier}
        setMenuOpen={setMenuOpen}
      />
      <DropdownItem
        key="restart-walkthrough"
        data-cy="restart-walkthrough"
        glyph={<Icon glyph="Bulb" />}
        onClick={() => {
          setMenuOpen(false);
          restartWalkthrough();
        }}
      >
        Restart walkthrough
      </DropdownItem>

      <MenuSeparator />

      <MenuGroup glyph={<Icon glyph="Settings" />} title="Settings">
        <OmitInactiveBuilds
          key="omit-inactive-builds"
          omitInactiveBuilds={omitInactiveBuilds}
          setOmitInactiveBuilds={setOmitInactiveBuilds}
        />
      </MenuGroup>
    </ButtonDropdown>
  );
};
