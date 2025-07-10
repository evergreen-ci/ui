import { useRef, useState } from "react";
import styled from "@emotion/styled";
import { H2 } from "@leafygreen-ui/typography";
import { size, transitionDuration, zIndex } from "@evg-ui/lib/constants/tokens";
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
      <Container saveable={saveable} showShadow={showShadow}>
        <H2 data-cy="project-settings-tab-title">{title}</H2>
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

const Container = styled.div<{ showShadow: boolean; saveable: boolean }>`
  align-items: start;
  background-color: white;
  display: flex;
  gap: ${size.s};
  justify-content: space-between;
  margin: 0 -${size.l};
  padding: 0 ${size.l} ${size.s} ${size.l};

  ${({ saveable }) => saveable && "position: sticky;"}
  z-index: ${zIndex.stickyHeader};
  top: 0;

  ${({ showShadow }) =>
    showShadow
      ? "box-shadow: 0 3px 4px -4px rgba(0, 0, 0, 0.6);"
      : "box-shadow: unset;"}
  transition: box-shadow ${transitionDuration.default}ms ease-in-out;
`;
