import { useMemo } from "react";
import { AdminSettingsTabRoutes } from "constants/routes";
import { BaseTab } from "../BaseTab";
import { getFormSchema } from "./formSchema";
import { TabProps } from "./types";

const tab = AdminSettingsTabRoutes.Announcements;

export const AnnouncementTab: React.FC<TabProps> = ({ announcementsData }) => {
  const initialFormState = announcementsData;

  const formSchema = useMemo(() => getFormSchema(), []);
  return (
    <BaseTab
      formSchema={formSchema}
      initialFormState={initialFormState}
      tab={tab}
    />
  );
};
