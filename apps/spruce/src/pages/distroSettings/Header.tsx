import { useRef, useState } from "react";
import { H2 } from "@leafygreen-ui/typography";
import { StickyHeaderContainer } from "components/Settings/sharedStyles";
import { DistroSettingsTabRoutes } from "constants/routes";
import { DistroQuery } from "gql/generated/types";
import useIntersectionObserver from "hooks/useIntersectionObserver";
import { getTabTitle } from "./getTabTitle";
import { HeaderButtons } from "./HeaderButtons";
import {
  WritableDistroSettingsTabs,
  WritableDistroSettingsType,
} from "./tabs/types";

interface Props {
  distro: DistroQuery["distro"];
  tab: DistroSettingsTabRoutes;
}

export const Header: React.FC<Props> = ({ distro, tab }) => {
  const { title } = getTabTitle(tab);
  const saveable = Object.values(WritableDistroSettingsTabs).includes(
    tab as WritableDistroSettingsType,
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
        <H2 data-cy="distro-settings-tab-title">{title}</H2>
        {saveable && (
          <HeaderButtons
            distro={distro}
            tab={tab as WritableDistroSettingsType}
          />
        )}
      </StickyHeaderContainer>
    </>
  );
};
