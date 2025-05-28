import styled from "@emotion/styled";
import { size } from "@evg-ui/lib/constants/tokens";
import { AdminSettingsTabRoutes } from "constants/routes";
import { BaseTab } from "../BaseTab";
import { getFormSchema } from "./formSchema";
import { TabProps } from "./types";

const PageTitle = styled.h2`
  margin-bottom: ${size.s};
  font-size: 24px;
  font-weight: bold;
`;

export const AnnouncementTab: React.FC<TabProps> = ({ announcementsData }) => {
  const initialFormState = announcementsData;

  const formSchema = getFormSchema();
  return (
    <>
      <TitleContainer>
        <PageTitle>Announcements</PageTitle>
      </TitleContainer>
      <BaseTab
        formSchema={formSchema}
        initialFormState={initialFormState}
        tab={AdminSettingsTabRoutes.Announcements}
      />
    </>
  );
};

const TitleContainer = styled.div`
  margin-bottom: ${size.m};
`;
