import { useState } from "react";
import { MenuSeparator, SubMenu } from "@leafygreen-ui/menu";
import Icon from "@evg-ui/lib/components/Icon";
import { ButtonDropdown, DropdownItem } from "components/ButtonDropdown";
import { walkthroughSteps, waterfallGuideId } from "../constants";
import { AddNotification } from "./AddNotification";
import { ClearAllFilters } from "./ClearAllFilters";
import { GitCommitSearch } from "./GitCommitSearch";
import { JumpToMostRecent } from "./JumpToMostRecent";
import { OmitInactiveBuilds } from "./OmitInactiveBuilds";

const menuProps = { [waterfallGuideId]: walkthroughSteps[4].targetId };

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
      {...menuProps}
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

      <SubMenu glyph={<Icon glyph="Settings" />} title="Settings">
        <OmitInactiveBuilds
          key="omit-inactive-builds"
          omitInactiveBuilds={omitInactiveBuilds}
          setOmitInactiveBuilds={setOmitInactiveBuilds}
        />
      </SubMenu>
    </ButtonDropdown>
  );
};
