import { H2 } from "@leafygreen-ui/typography";
import { AdminSettingsTabRoutes } from "constants/routes";
import { BaseTab } from "../BaseTab";
import { TitleContainer } from "../SharedStyles";
import { getFormSchema } from "./formSchema";
import { TabProps } from "./types";

export const AnnouncementTab: React.FC<TabProps> = ({ announcementsData }) => {
  const initialFormState = announcementsData;
  console.log("AnnouncementTab initialFormState", initialFormState);
  const formSchema = getFormSchema();
  return (
    <>
      <TitleContainer>
        <H2>Announcements</H2>
      </TitleContainer>
      <BaseTab
        formSchema={formSchema}
        initialFormState={initialFormState}
        tab={AdminSettingsTabRoutes.Announcements}
      />
    </>
  );
};
