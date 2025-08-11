import { useRef, useState } from "react";
import styled from "@emotion/styled";
import { H2, H2Props } from "@leafygreen-ui/typography";
import { size, transitionDuration, zIndex } from "@evg-ui/lib/constants/tokens";
import { AdminSettingsTabRoutes } from "constants/routes";
import { AdminSettings } from "gql/generated/types";
import useIntersectionObserver from "hooks/useIntersectionObserver";
import { AdminSaveButton } from "./AdminSaveButton";
import { getTabTitle } from "./getTabTitle";

interface Props {
  adminSettingsData: AdminSettings;
  tab: AdminSettingsTabRoutes;
}

export const Header: React.FC<Props> = ({ adminSettingsData, tab }) => {
  const { title } = getTabTitle(tab);
  const saveable = tab === AdminSettingsTabRoutes.General;

  const headerScrollRef = useRef<HTMLDivElement>(null);
  const [showShadow, setShowShadow] = useState(false);
  useIntersectionObserver(headerScrollRef, ([entry]) => {
    setShowShadow(!entry.isIntersecting);
  });

  return (
    <>
      <div ref={headerScrollRef} />
      <Container saveable={saveable} showShadow={showShadow}>
        <StyledH2 data-cy="admin-settings-tab-title">{title}</StyledH2>
        {saveable && <AdminSaveButton adminSettingsData={adminSettingsData} />}
      </Container>
    </>
  );
};

const StyledH2 = styled(H2)<H2Props>``;

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
