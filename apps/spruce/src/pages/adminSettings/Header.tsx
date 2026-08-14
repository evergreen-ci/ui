import { useRef, useState } from "react";
import { H2 } from "@leafygreen-ui/typography";
import { StickyHeaderContainer } from "components/Settings/sharedStyles";
import { AdminSettingsTabRoutes } from "constants/routes";
import useIntersectionObserver from "hooks/useIntersectionObserver";
import { AdminSaveButton } from "./AdminSaveButton";
import { getTabTitle } from "./getTabTitle";

interface Props {
  tab: AdminSettingsTabRoutes;
}

export const Header: React.FC<Props> = ({ tab }) => {
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
      <StickyHeaderContainer saveable={saveable} showShadow={showShadow}>
        <H2 data-testid="admin-settings-tab-title">{title}</H2>
        {saveable && <AdminSaveButton />}
      </StickyHeaderContainer>
    </>
  );
};
