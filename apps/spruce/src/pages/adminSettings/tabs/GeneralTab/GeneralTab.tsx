import { AdminSettingsGeneralSection } from "constants/routes";
import { FormStateMap } from "../types";
import { AnnouncementTab } from "./AnnouncementsTab/AnnouncementTab";
import { FeatureFlagsTab } from "./FeatureFlagsTab/FeatureFlagsTab";
import { RunnersTab } from "./RunnersTab/RunnersTab";

interface Props {
  tabData: FormStateMap;
}

export const GeneralTab: React.FC<Props> = ({ tabData }) => (
  <>
    <AnnouncementTab
      announcementsData={tabData[AdminSettingsGeneralSection.Announcements]}
    />
    <FeatureFlagsTab
      featureFlagsData={tabData[AdminSettingsGeneralSection.FeatureFlags]}
    />
    <RunnersTab runnersData={tabData[AdminSettingsGeneralSection.Runners]} />
  </>
);
