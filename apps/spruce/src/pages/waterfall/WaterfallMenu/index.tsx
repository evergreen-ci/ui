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
import Bell from "@via-ds/icons/Bell";
import Bulb from "@via-ds/icons/Bulb";
import Code from "@via-ds/icons/Code";
import Ellipsis from "@via-ds/icons/Ellipsis";
import { useWaterfallAnalytics } from "analytics";
import { OMIT_INACTIVE_WATERFALL_BUILDS } from "constants/cookies";
import { walkthroughSteps, waterfallGuideId } from "../constants";
import { AddNotification } from "./AddNotification";
import { ClearAllFilters } from "./ClearAllFilters";
import { GitCommitSearch } from "./GitCommitSearch";
import styles from "./index.module.css";
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
          className={styles.trigger}
          data-testid="waterfall-menu"
          {...{ [waterfallGuideId]: walkthroughSteps[4].targetId }}
        >
          <Ellipsis />
        </Button>
        <MenuPopover>
          <Menu aria-label="Waterfall actions">
            <MenuItem
              data-testid="git-commit-search"
              id="git-commit-search"
              onAction={() => {
                setMenuOpen(false);
                setGitCommitModalOpen(true);
              }}
              textValue="Search by git hash"
            >
              <Code slot="icon" />
              <Text>Search by git hash</Text>
            </MenuItem>
            <JumpToMostRecent setMenuOpen={setMenuOpen} />
            <ClearAllFilters setMenuOpen={setMenuOpen} />
            <MenuItem
              data-testid="add-notification"
              id="add-notification"
              onAction={() => {
                setMenuOpen(false);
                setNotificationModalOpen(true);
              }}
              textValue="Add notification"
            >
              <Bell slot="icon" />
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
              <Bulb slot="icon" />
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
      {(menuOpen || gitCommitModalOpen) && (
        <GitCommitSearch
          open={gitCommitModalOpen}
          setOpen={setGitCommitModalOpen}
        />
      )}
      {(menuOpen || notificationModalOpen) && (
        <AddNotification
          open={notificationModalOpen}
          projectIdentifier={projectIdentifier}
          setMenuOpen={setMenuOpen}
          setOpen={setNotificationModalOpen}
        />
      )}
    </>
  );
};
