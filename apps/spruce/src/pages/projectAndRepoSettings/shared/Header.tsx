import { useRef, useState } from "react";
import styled from "@emotion/styled";
import { H2, H2Props } from "@leafygreen-ui/typography";
import { stickyHeaderContainer } from "components/Settings/sharedStyles";
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

  const Container = stickyHeaderContainer;

  return (
    <>
      <div ref={headerScrollRef} />
      <Container saveable={saveable} showShadow={showShadow}>
        <StyledH2 data-cy="project-settings-tab-title">{title}</StyledH2>
        {saveable && (
          <HeaderButtons
            id={id}
            projectType={projectType}
            tab={tab as WritableProjectSettingsType}
          />
        )}
      </Container>
    </>
  );
};

const StyledH2 = styled(H2)<H2Props>``;
