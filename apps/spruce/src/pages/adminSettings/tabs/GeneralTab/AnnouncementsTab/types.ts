import { BannerTheme } from "gql/generated/types";

export interface AnnouncementsFormState {
  announcements: {
    banner: string;
    bannerTheme: BannerTheme;
  };
}

export type TabProps = {
  announcementsData: AnnouncementsFormState;
};
