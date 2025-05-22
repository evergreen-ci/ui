import { BannerTheme } from "gql/generated/types";

export interface AnnouncementsFormState {
  banner: string;
  bannerTheme: BannerTheme;
}

export type TabProps = {
  announcementsData: AnnouncementsFormState;
};
