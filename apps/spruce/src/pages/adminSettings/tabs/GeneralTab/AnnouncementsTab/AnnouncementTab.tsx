import { H2 } from "@leafygreen-ui/typography";
import { AdminSettingsGeneralSection } from "constants/routes";
import { BaseTab } from "../../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

export const AnnouncementTab: React.FC<TabProps> = ({ announcementsData }) => {
  const initialFormState = announcementsData;
  const formSchema = getFormSchema();
  return (
    <>
      <H2>Announcements</H2>
      <BaseTab
        formSchema={formSchema}
        initialFormState={initialFormState}
        tab={AdminSettingsGeneralSection.Announcements}
      />
    </>
  );
};
