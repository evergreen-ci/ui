import { H2 } from "@leafygreen-ui/typography";
import { AdminSettingsGeneralSection } from "constants/routes";
import { BaseTab } from "../../BaseTab";
import { formSchema } from "./getFormSchema";
import { TabProps } from "./types";

export const AnnouncementTab: React.FC<TabProps> = ({ announcementsData }) => (
  <>
    <H2>Announcements</H2>
    <BaseTab
      formSchema={formSchema}
      initialFormState={announcementsData}
      tab={AdminSettingsGeneralSection.Announcements}
    />
  </>
);
