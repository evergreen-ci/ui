import { FormStateMap } from "../types";
import { AnnouncementTab } from "./AnnouncementsTab/AnnouncementTab";

interface Props {
  tabData: FormStateMap;
}

export const GeneralTab: React.FC<Props> = ({ tabData }) => (
  <AnnouncementTab announcementsData={tabData.announcements} />
);
