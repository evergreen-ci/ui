import { useState } from "react";
import {
  Button,
  Header,
  Menu,
  MenuItem,
  MenuPopover,
  MenuRoot,
  MenuSection,
  MenuSeparator,
  Text,
} from "@via-ds/components";
import Icon from "@evg-ui/lib/components/Icon";
import { useWaterfallAnalytics } from "analytics";
import { OMIT_INACTIVE_WATERFALL_BUILDS } from "constants/cookies";
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
  const { sendEvent } = useWaterfallAnalytics();
  const [menuOpen, setMenuOpen] = useState(false);
  const [gitCommitModalOpen, setGitCommitModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);

  return (
    <>
      <MenuRoot isOpen={menuOpen} onOpenChange={setMenuOpen}>
        <Button
          aria-label="Waterfall menu"
          data-testid="waterfall-menu"
          size="small"
          variant="tertiary"
          {...{ [waterfallGuideId]: walkthroughSteps[4].targetId }}
        >
          <Icon glyph="Ellipsis" />
        </Button>
        <MenuPopover>
          <Menu aria-label="Waterfall actions">
            <MenuItem
              data-testid="git-commit-search"
              id="git-commit-search"
              onAction={() => setGitCommitModalOpen(true)}
              textValue="Search by git hash"
            >
              <Icon glyph="Code" slot="icon" />
              <Text>Search by git hash</Text>
            </MenuItem>
            <JumpToMostRecent
              key="jump-to-most-recent"
              setMenuOpen={setMenuOpen}
            />
            <ClearAllFilters
              key="clear-all-filters"
              setMenuOpen={setMenuOpen}
            />
            <MenuItem
              data-testid="add-notification"
              id="add-notification"
              onAction={() => setNotificationModalOpen(true)}
              textValue="Add notification"
            >
              <Icon glyph="Bell" slot="icon" />
              <Text>Add notification</Text>
            </MenuItem>
            <MenuItem
              data-testid="restart-walkthrough"
              id="restart-walkthrough"
              onAction={() => {
                setMenuOpen(false);
                restartWalkthrough();
              }}
              textValue="Restart walkthrough"
            >
              <Icon glyph="Bulb" slot="icon" />
              <Text>Restart walkthrough</Text>
            </MenuItem>

            <MenuSeparator />

            <MenuSection>
              <Header>
                <Text slot="heading">Settings</Text>
              </Header>
              <MenuItem
                id="omit-inactive-builds"
                onAction={() => {
                  const newValue = !omitInactiveBuilds;
                  setOmitInactiveBuilds(newValue);
                  localStorage.setItem(
                    OMIT_INACTIVE_WATERFALL_BUILDS,
                    newValue.toString(),
                  );
                  sendEvent({
                    name: "Toggled omit inactive builds",
                    enabled: newValue,
                  });
                }}
                textValue="Omit inactive builds"
              >
                <OmitInactiveBuilds omitInactiveBuilds={omitInactiveBuilds} />
              </MenuItem>
            </MenuSection>
          </Menu>
        </MenuPopover>
      </MenuRoot>
      <GitCommitSearch
        open={gitCommitModalOpen}
        setOpen={setGitCommitModalOpen}
      />
      <AddNotification
        open={notificationModalOpen}
        projectIdentifier={projectIdentifier}
        setMenuOpen={setMenuOpen}
        setOpen={setNotificationModalOpen}
      />
    </>
  );
};
