import { useRef, useState } from "react";
import { H2 } from "@leafygreen-ui/typography";
import { StickyHeaderContainer } from "components/Settings/sharedStyles";
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

  const Container = StickyHeaderContainer;

  return (
    <>
      <div ref={headerScrollRef} />
      <Container saveable={saveable} showShadow={showShadow}>
        <H2 data-cy="admin-settings-tab-title">{title}</H2>
        {saveable && <AdminSaveButton adminSettingsData={adminSettingsData} />}
      </Container>
    </>
  );
};
