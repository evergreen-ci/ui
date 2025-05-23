import styled from "@emotion/styled";
import { H2 } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";
import { AdminSettingsTabRoutes } from "constants/routes";
import { BaseTab } from "../BaseTab";
import { getFormSchema } from "./formSchema";
import { TabProps } from "./types";

const tab = AdminSettingsTabRoutes.Announcements;

export const AnnouncementTab: React.FC<TabProps> = ({ announcementsData }) => {
  const initialFormState = announcementsData;

  const formSchema = getFormSchema();
  return (
    <>
      <TitleContainer>
        <H2>Announcements</H2>
      </TitleContainer>
      <BaseTab
        formSchema={formSchema}
        initialFormState={initialFormState}
        tab={tab}
      />
    </>
  );
};

const TitleContainer = styled.div`
  margin-bottom: ${size.m};
`;
