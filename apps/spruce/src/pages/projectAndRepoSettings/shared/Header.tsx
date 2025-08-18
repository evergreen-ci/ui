import { useRef, useState } from "react";
import { H2 } from "@leafygreen-ui/typography";
import { StickyHeaderContainer } from "components/Settings/sharedStyles";
import { ProjectSettingsTabRoutes } from "constants/routes";
import useIntersectionObserver from "hooks/useIntersectionObserver";
import { getTabTitle } from "./getTabTitle";
import { HeaderButtons } from "./HeaderButtons";
import {
  WritableProjectSettingsTabs,
  WritableProjectSettingsType,
} from "./tabs/types";
import { ProjectType } from "./tabs/utils";

interface Props {
  id: string;
  projectType: ProjectType;
  tab: ProjectSettingsTabRoutes;
}

export const Header: React.FC<Props> = ({ id, projectType, tab }) => {
  const { title } = getTabTitle(tab);
  const saveable = Object.values(WritableProjectSettingsTabs).includes(
    tab as WritableProjectSettingsType,
  );

  const headerScrollRef = useRef<HTMLDivElement>(null);
  const [showShadow, setShowShadow] = useState(false);
  useIntersectionObserver(headerScrollRef, ([entry]) => {
    setShowShadow(!entry.isIntersecting);
  });

  return (
    <>
      <div ref={headerScrollRef} />
      <StickyHeaderContainer saveable={saveable} showShadow={showShadow}>
        <H2 data-cy="project-settings-tab-title">{title}</H2>
        {saveable && (
          <HeaderButtons
            id={id}
            projectType={projectType}
            tab={tab as WritableProjectSettingsType}
          />
        )}
      </StickyHeaderContainer>
    </>
  );
};
