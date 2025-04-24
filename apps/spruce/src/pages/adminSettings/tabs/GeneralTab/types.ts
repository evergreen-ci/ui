export interface GeneralFormState {
  announcements: {
    bannerText: string;
    bannerStyle: string;
  };
}

export type TabProps = {
  announcementsData: GeneralFormState;
};
